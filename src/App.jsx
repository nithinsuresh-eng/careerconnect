import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import AuthModal from './components/AuthModal';
import HomeView from './views/HomeView';
import JobListView from './views/JobListView';
import JobDetailView from './views/JobDetailView';
import UserDashboard from './views/UserDashboard';
import AdminDashboard from './views/AdminDashboard';
import './App.css';

export default function App() {
  // Initialize Database on App load
  useEffect(() => {
    db.init();
  }, []);

  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('wyntrix_theme');
    return saved || 'dark';
  });

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('wyntrix_theme', theme);
  }, [theme]);

  // Auth States
  const [user, setUser] = useState(() => db.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // DB States
  const [jobs, setJobs] = useState(() => db.getJobs());
  const [applications, setApplications] = useState(() => db.getApplications());

  // Search parameters passed from Home page to Job Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  // Active Job Detail ID
  const [activeJobDetailId, setActiveJobDetailId] = useState('');

  // Hash Router State
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#home');

  // Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state with LocalStorage for jobs/apps when database triggers updates
  useEffect(() => {
    setJobs(db.getJobs());
    setApplications(db.getApplications());
  }, []);

  // Listen to hash routes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentHash(hash);
      // Scroll to top on page change
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Authentication Callbacks
  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    
    // Redirect appropriately
    if (loggedInUser.role === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '#dashboard';
    }
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    showToast('Logged out successfully.', 'success');
    window.location.hash = '#home';
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleViewJob = (jobId) => {
    setActiveJobDetailId(jobId);
    window.location.hash = '#job-detail';
  };

  const handleNavigateToJobs = (query = '', category = '') => {
    setSearchQuery(query || '');
    setSearchCategory(category || '');
    window.location.hash = '#jobs';
  };

  // Guard routing for dashboards
  useEffect(() => {
    if (currentHash === '#dashboard' && (!user || user.role !== 'candidate')) {
      window.location.hash = '#home';
    }
    if (currentHash === '#admin' && (!user || user.role !== 'admin')) {
      window.location.hash = '#home';
    }
  }, [currentHash, user]);

  // Page Routing Switch
  const renderView = () => {
    switch (currentHash) {
      case '#home':
        return (
          <HomeView
            jobs={jobs}
            onViewJob={handleViewJob}
            onNavigateToJobs={handleNavigateToJobs}
          />
        );
      case '#jobs':
        return (
          <JobListView
            jobs={jobs}
            onViewJob={handleViewJob}
            initialQuery={searchQuery}
            initialCategory={searchCategory}
          />
        );
      case '#job-detail':
        return (
          <JobDetailView
            jobId={activeJobDetailId}
            user={user}
            applications={applications}
            onBack={() => window.location.hash = '#jobs'}
            onAuthRequired={() => {
              setAuthModalTab('login');
              setIsAuthModalOpen(true);
            }}
            onApplicationSubmitted={(newApp) => {
              setApplications(prev => [newApp, ...prev]);
              showToast('Application submitted successfully!', 'success');
            }}
          />
        );
      case '#dashboard':
        return (
          <UserDashboard
            user={user}
            jobs={jobs}
            applications={applications}
            onUpdateUser={(updated) => setUser(updated)}
            onViewJob={handleViewJob}
          />
        );
      case '#admin':
        return (
          <AdminDashboard
            jobs={jobs}
            applications={applications}
            onCreateJob={(job) => {
              setJobs(prev => [job, ...prev]);
              showToast('Opportunity posted successfully!', 'success');
            }}
            onUpdateJob={(job) => {
              setJobs(prev => prev.map(j => j.id === job.id ? job : j));
              showToast('Opportunity updated successfully!', 'success');
            }}
            onDeleteJob={(id) => {
              setJobs(prev => prev.filter(j => j.id !== id));
              setApplications(prev => prev.filter(a => a.jobId !== id));
              showToast('Opportunity removed.', 'success');
            }}
            onUpdateApplicationStatus={(app) => {
              setApplications(prev => prev.map(a => a.id === app.id ? app : a));
              showToast(`Application status updated to ${app.status}.`, 'success');
            }}
          />
        );
      default:
        return (
          <HomeView
            jobs={jobs}
            onViewJob={handleViewJob}
            onNavigateToJobs={handleNavigateToJobs}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => window.location.hash = '#home'}>
          <span style={{ fontSize: '1.6rem' }}>✨</span>
          <span>Wyntrix Careers</span>
        </div>
        
        <div className="nav-links">
          <button
            className={`nav-link ${currentHash === '#home' ? 'active' : ''}`}
            onClick={() => window.location.hash = '#home'}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentHash === '#jobs' ? 'active' : ''}`}
            onClick={() => window.location.hash = '#jobs'}
          >
            Find Jobs
          </button>
          
          {user && user.role === 'candidate' && (
            <button
              className={`nav-link ${currentHash === '#dashboard' ? 'active' : ''}`}
              onClick={() => window.location.hash = '#dashboard'}
            >
              Dashboard
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              className={`nav-link ${currentHash === '#admin' ? 'active' : ''}`}
              onClick={() => window.location.hash = '#admin'}
            >
              Admin Dashboard
            </button>
          )}
        </div>

        <div className="nav-actions">
          {/* Theme Toggler */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? (
              // Sun icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              // Moon icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hello, <strong style={{ color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</strong>
              </span>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAuthModalTab('register');
                  setIsAuthModalOpen(true);
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main page router viewport */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Auth Modal Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialTab={authModalTab}
      />

      {/* Toast popup */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'success' : 'error'}`}>
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
