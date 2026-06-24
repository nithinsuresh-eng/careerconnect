import React, { useState } from 'react';

export default function HomeView({ jobs, onViewJob, onNavigateToJobs }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigateToJobs(searchQuery);
  };

  const featuredJobs = jobs.slice(0, 3);

  const categories = [
    { name: 'Software Development', count: '120+ Openings', icon: '💻' },
    { name: 'Design & Creative', count: '45+ Openings', icon: '🎨' },
    { name: 'Marketing', count: '30+ Openings', icon: '📈' },
    { name: 'Data Science & Analytics', count: '55+ Openings', icon: '📊' },
  ];

  return (
    <div className="home-container">
      <section className="home-hero">
        <h1 className="hero-title">
          Explore Your Next <span>Career Spark</span>
        </h1>
        <p className="hero-subtitle">
          Discover handpicked job and internship opportunities from top tech companies. Submit applications and track your progress in real-time.
        </p>

        <form onSubmit={handleSearchSubmit} className="hero-search-box">
          <svg style={{ marginLeft: '12px', alignSelf: 'center', color: 'var(--text-muted)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by job title, company or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Find Opportunities</button>
        </form>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-val">500+</span>
            <span className="stat-label">Opportunities</span>
          </div>
          <div className="stat-item" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0 40px' }}>
            <span className="stat-val">98%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">12k+</span>
            <span className="stat-label">Applicants</span>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section style={{ margin: '60px 0' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore by Category</h2>
            <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>Find opportunities tailored to your professional skills</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {categories.map((cat, i) => (
            <div
              key={i}
              className="dashboard-panel"
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                border: '1px solid var(--border)'
              }}
              onClick={() => onNavigateToJobs(null, cat.name)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                width: '60px',
                height: '60px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cat.icon}
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs section */}
      <section style={{ margin: '60px 0 20px' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Opportunities</h2>
            <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>Latest high-impact jobs and internships posted recently</p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigateToJobs('')}>
            View All
          </button>
        </div>

        <div className="listings-list">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => onViewJob(job.id)}
            >
              <img src={job.logo} alt={job.company} className="company-logo" />
              <div className="job-card-content">
                <div className="job-card-top">
                  <div>
                    <h3 className="job-card-title">{job.title}</h3>
                    <div className="job-card-company">{job.company}</div>
                  </div>
                  <span className={`badge ${job.type === 'Job' ? 'badge-applied' : 'badge-interview'}`}>
                    {job.type}
                  </span>
                </div>
                <div className="job-card-details">
                  <div className="detail-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {job.location}
                  </div>
                  <div className="detail-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    {job.workMode}
                  </div>
                  <div className="detail-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    {job.salary}
                  </div>
                </div>
                <p className="job-card-desc">{job.description}</p>
                <div className="job-card-tags">
                  <span className="job-tag">{job.category}</span>
                  <span className="job-tag">Posted {new Date(job.postedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
