import React, { useState } from 'react';
import { db } from '../services/db';

export default function JobDetailView({ jobId, user, onBack, onAuthRequired, onApplicationSubmitted, applications = [] }) {
  const job = db.getJobById(jobId);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!job) {
    return (
      <div className="dashboard-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h3>Job not found</h3>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '16px' }}>Back to Listings</button>
      </div>
    );
  }

  // Check if candidate already applied
  const userApplication = user && user.role === 'candidate'
    ? applications.find(app => app.jobId === job.id && app.candidateId === user.id)
    : null;

  const handleApply = (e) => {
    e.preventDefault();
    if (!user) {
      onAuthRequired();
      return;
    }
    if (user.role !== 'candidate') {
      setError('Only candidate accounts can submit applications.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      const res = db.submitApplication({
        jobId: job.id,
        candidateId: user.id,
        coverLetter
      });

      setIsSubmitting(false);
      if (res.success) {
        setSuccess('Application submitted successfully!');
        onApplicationSubmitted(res.application);
      } else {
        setError(res.error);
      }
    }, 800);
  };

  // Timeline render logic based on application status
  const renderTimeline = () => {
    if (!userApplication) return null;

    const stages = [
      { name: 'Applied', key: 'Applied' },
      { name: 'Under Review', key: 'Reviewing' },
      { name: 'Interview', key: 'Interview' },
      { name: 'Decision', key: 'Decision' } // Decision covers Offered or Rejected
    ];

    const currentStatus = userApplication.status;

    // Helper to see if stage is completed or current
    const getStageState = (stageKey, idx) => {
      const statusMap = {
        'Applied': 0,
        'Reviewing': 1,
        'Interview': 2,
        'Offered': 3,
        'Rejected': 3
      };

      const currentIdx = statusMap[currentStatus];
      
      if (stageKey === 'Decision') {
        if (currentStatus === 'Offered' || currentStatus === 'Rejected') {
          return 'completed';
        }
        return 'pending';
      }

      const stageIdx = idx;
      if (currentIdx > stageIdx) return 'completed';
      if (currentIdx === stageIdx) return 'current';
      return 'pending';
    };

    return (
      <div className="timeline-container">
        <h4 className="timeline-title">Application Status</h4>
        <div className="timeline">
          {stages.map((stage, idx) => {
            const state = getStageState(stage.key, idx);
            let displayTitle = stage.name;
            
            // Adjust title for decision
            if (stage.key === 'Decision') {
              if (currentStatus === 'Offered') displayTitle = 'Offered 🎉';
              else if (currentStatus === 'Rejected') displayTitle = 'Rejected';
            }

            return (
              <div key={idx} className={`timeline-step ${state}`}>
                <div className="timeline-node">
                  {state === 'completed' ? '✓' : ''}
                </div>
                <div className="timeline-info">
                  <div className="timeline-name">{displayTitle}</div>
                  {state === 'current' && <span className="badge badge-reviewing" style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}>Active</span>}
                  {stage.key === 'Decision' && currentStatus === 'Offered' && <span className="badge badge-offered" style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}>Hired</span>}
                  {stage.key === 'Decision' && currentStatus === 'Rejected' && <span className="badge badge-rejected" style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}>Closed</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="status-notes-box">
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Latest Recruiter Note:
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
            {userApplication.statusNotes || 'No notes available yet.'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          color: 'var(--primary)',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '24px',
          fontSize: '0.95rem'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Listings
      </button>

      <div className="job-detail-layout">
        {/* Main Details */}
        <main className="job-detail-main">
          <div className="job-detail-header">
            <img src={job.logo} alt={job.company} className="company-logo" style={{ width: '72px', height: '72px' }} />
            <div className="job-detail-header-info">
              <h1 className="job-detail-title">{job.title}</h1>
              <div className="job-detail-meta">
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{job.company}</div>
                <div>•</div>
                <div>{job.location}</div>
                <div>•</div>
                <div style={{ textTransform: 'capitalize' }}>{job.workMode}</div>
              </div>
            </div>
          </div>

          <div className="job-section">
            <h3 className="job-section-title">About the Role</h3>
            <p style={{ whiteSpace: 'pre-line', fontSize: '1rem', color: 'var(--text-secondary)' }}>{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="job-section">
              <h3 className="job-section-title">Requirements</h3>
              <ul className="job-list-items">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="job-section">
              <h3 className="job-section-title">Benefits & Perks</h3>
              <ul className="job-list-items">
                {job.benefits.map((ben, i) => (
                  <li key={i}>{ben}</li>
                ))}
              </ul>
            </div>
          )}
        </main>

        {/* Sidebar Info & Applying */}
        <aside className="job-detail-sidebar">
          <div className="sidebar-salary">{job.salary}</div>
          <div className="sidebar-salary-label">Estimated Salary Range</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location</span>
              <span className="text-white">{job.location}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Job Type</span>
              <span className="text-white">{job.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category</span>
              <span className="text-white">{job.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Posted Date</span>
              <span className="text-white">{new Date(job.postedDate).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</span>
            </div>
          </div>

          {/* Action Box */}
          {user && user.role === 'admin' ? (
            <div className="dashboard-panel" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: 600 }}>Admin View</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                You are viewing this job post as an administrator. Modify this listing in the Admin Dashboard.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => window.location.hash = '#admin'}
              >
                Go to Admin Panel
              </button>
            </div>
          ) : userApplication ? (
            // Applied
            renderTimeline()
          ) : (
            // Apply Form
            <form onSubmit={handleApply}>
              {error && (
                <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  {success}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Cover Letter / Note</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Explain why you are a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ resize: 'none', fontSize: '0.9rem' }}
                  required
                />
              </div>

              {user ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Application...' : 'Apply Now'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={onAuthRequired}
                >
                  Sign In to Apply
                </button>
              )}
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
