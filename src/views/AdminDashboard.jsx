import React, { useState } from 'react';
import { db } from '../services/db';

export default function AdminDashboard({
  jobs,
  applications,
  onCreateJob,
  onUpdateJob,
  onDeleteJob,
  onUpdateApplicationStatus
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobs' | 'applications'
  
  // Job modal/editor states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // Null for create, job object for edit
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Job'); // 'Job' | 'Internship'
  const [jobMode, setJobMode] = useState('Remote'); // 'Remote' | 'Hybrid' | 'On-site'
  const [jobSalary, setJobSalary] = useState('');
  const [jobCategory, setJobCategory] = useState('Software Development');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState(''); // Textarea, comma-separated lines
  const [jobBens, setJobBens] = useState(''); // Textarea, comma-separated lines
  const [jobLogo, setJobLogo] = useState('');

  // Application view modal states
  const [viewingApp, setViewingApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Mock DB User lookup helper
  const getUserProfile = (candidateId) => {
    const users = JSON.parse(localStorage.getItem('wyntrix_users')) || [];
    return users.find(u => u.id === candidateId) || {};
  };

  // Metric computations
  const totalJobsCount = jobs.length;
  const totalAppsCount = applications.length;
  const statusCounts = {
    Applied: applications.filter(a => a.status === 'Applied').length,
    Reviewing: applications.filter(a => a.status === 'Reviewing').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Offered: applications.filter(a => a.status === 'Offered').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const handleOpenCreateJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobCompany('');
    setJobLocation('');
    setJobType('Job');
    setJobMode('Remote');
    setJobSalary('');
    setJobCategory('Software Development');
    setJobDesc('');
    setJobReqs('');
    setJobBens('');
    setJobLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60');
    setIsJobModalOpen(true);
  };

  const handleOpenEditJobModal = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobCompany(job.company);
    setJobLocation(job.location);
    setJobType(job.type);
    setJobMode(job.workMode);
    setJobSalary(job.salary);
    setJobCategory(job.category);
    setJobDesc(job.description);
    setJobReqs(job.requirements ? job.requirements.join('\n') : '');
    setJobBens(job.benefits ? job.benefits.join('\n') : '');
    setJobLogo(job.logo);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    const requirementsArray = jobReqs.split('\n').map(r => r.trim()).filter(Boolean);
    const benefitsArray = jobBens.split('\n').map(b => b.trim()).filter(Boolean);

    const jobData = {
      title: jobTitle,
      company: jobCompany,
      location: jobLocation,
      type: jobType,
      workMode: jobMode,
      salary: jobSalary,
      category: jobCategory,
      description: jobDesc,
      requirements: requirementsArray,
      benefits: benefitsArray,
      logo: jobLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60'
    };

    if (editingJob) {
      const updated = db.updateJob(editingJob.id, jobData);
      if (updated) {
        onUpdateJob(updated);
      }
    } else {
      const created = db.createJob(jobData);
      onCreateJob(created);
    }

    setIsJobModalOpen(false);
  };

  const handleDeleteJob = (id) => {
    if (window.confirm('Are you sure you want to delete this job listing? All corresponding applicant submissions will also be deleted.')) {
      db.deleteJob(id);
      onDeleteJob(id);
    }
  };

  const handleOpenAppReviewModal = (app) => {
    setViewingApp(app);
    setNewStatus(app.status);
    setNewNotes(app.statusNotes || '');
  };

  const handleSaveAppStatus = (e) => {
    e.preventDefault();
    const res = db.updateApplicationStatus(viewingApp.id, newStatus, newNotes);
    if (res.success) {
      onUpdateApplicationStatus(res.application);
      setViewingApp(null);
    }
  };

  // Helper percentage for overview bars
  const getPercentage = (count) => {
    if (totalAppsCount === 0) return 0;
    return Math.round((count / totalAppsCount) * 100);
  };

  return (
    <div className="dashboard-layout">
      {/* Welcome header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h2>Admin Command Center</h2>
          <p style={{ fontSize: '0.95rem' }}>Track recruitment analytics, manage job listings, and review candidate workflows.</p>
        </div>
        {activeTab === 'jobs' && (
          <button className="btn btn-primary" onClick={handleOpenCreateJobModal}>
            <span style={{ fontSize: '1.2rem', marginRight: '4px', fontWeight: 'bold' }}>+</span> Post New Opportunity
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Analytics Overview
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Manage Jobs ({totalJobsCount})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Manage Applications ({totalAppsCount})
        </button>
      </div>

      {/* Overview tab content */}
      {activeTab === 'overview' && (
        <div>
          <div className="admin-metrics">
            <div className="metric-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Postings</span>
                <div className="metric-number">{totalJobsCount}</div>
              </div>
              <div className="metric-icon">💼</div>
            </div>

            <div className="metric-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Submissions</span>
                <div className="metric-number">{totalAppsCount}</div>
              </div>
              <div className="metric-icon">📁</div>
            </div>

            <div className="metric-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Interviews Pending</span>
                <div className="metric-number">{statusCounts.Interview}</div>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>🤝</div>
            </div>

            <div className="metric-card">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Offers Extended</span>
                <div className="metric-number">{statusCounts.Offered}</div>
              </div>
              <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>🎉</div>
            </div>
          </div>

          {/* Graphical status metrics */}
          <div className="dashboard-panel">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Application Funnel Distribution
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { name: 'Applied (New)', count: statusCounts.Applied, color: 'var(--badge-applied-text)' },
                { name: 'Reviewing (Sourcing)', count: statusCounts.Reviewing, color: 'var(--badge-reviewing-text)' },
                { name: 'Interviewing', count: statusCounts.Interview, color: 'var(--badge-interview-text)' },
                { name: 'Offered (Hired)', count: statusCounts.Offered, color: 'var(--badge-offered-text)' },
                { name: 'Rejected (Archived)', count: statusCounts.Rejected, color: 'var(--badge-rejected-text)' }
              ].map((status, index) => {
                const percentage = getPercentage(status.count);
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{status.name}</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {status.count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: status.color, borderRadius: '9999px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <div className="admin-grid">
          <div className="admin-table-container">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <h3>No Jobs Available</h3>
                <p>Post a job or internship opportunity to get started.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company / Role</th>
                    <th>Category</th>
                    <th>Type / Mode</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={job.logo} alt={job.company} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <div>
                            <div className="text-white" style={{ fontSize: '0.95rem' }}>{job.title}</div>
                            <div style={{ fontSize: '0.85rem' }}>{job.company} ({job.location})</div>
                          </div>
                        </div>
                      </td>
                      <td>{job.category}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span className={`badge ${job.type === 'Job' ? 'badge-applied' : 'badge-interview'}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                            {job.type}
                          </span>
                          <span style={{ fontSize: '0.85rem' }}>{job.workMode}</span>
                        </div>
                      </td>
                      <td>{job.salary}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleOpenEditJobModal(job)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteJob(job.id)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <div className="admin-grid">
          <div className="admin-table-container">
            {applications.length === 0 ? (
              <div className="empty-state">
                <h3>No Applications Submitted</h3>
                <p>Applications submitted by candidates will appear here for review.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Opportunity</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => {
                    const job = jobs.find(j => j.id === app.jobId) || {};
                    const applicant = getUserProfile(app.candidateId);

                    const statusClasses = {
                      'Applied': 'badge-applied',
                      'Reviewing': 'badge-reviewing',
                      'Interview': 'badge-interview',
                      'Offered': 'badge-offered',
                      'Rejected': 'badge-rejected'
                    };
                    const badgeClass = statusClasses[app.status] || 'badge-applied';

                    return (
                      <tr key={app.id}>
                        <td>
                          <div className="text-white" style={{ fontSize: '0.95rem' }}>{applicant.name || 'Unknown Candidate'}</div>
                          <div style={{ fontSize: '0.85rem' }}>{applicant.email || ''}</div>
                        </td>
                        <td>
                          <div className="text-white" style={{ fontSize: '0.95rem' }}>{job.title || 'Deleted Position'}</div>
                          <div style={{ fontSize: '0.85rem' }}>{job.company || ''}</div>
                        </td>
                        <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${badgeClass}`} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleOpenAppReviewModal(app)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Job Post Modal */}
      {isJobModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJobModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingJob ? 'Edit Opportunity' : 'Post New Opportunity'}</h3>
              <button className="modal-close" onClick={() => setIsJobModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveJob}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Backend Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Acme Corp"
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Boston, MA or Remote"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. $80,000 - $100,000"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Opportunity Type</label>
                    <select
                      className="form-control"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="Job">Job (Full-time/Part-time)</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Mode</label>
                    <select
                      className="form-control"
                      value={jobMode}
                      onChange={(e) => setJobMode(e.target.value)}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Category</label>
                    <select
                      className="form-control"
                      value={jobCategory}
                      onChange={(e) => setJobCategory(e.target.value)}
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="Design & Creative">Design & Creative</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                      <option value="Finance & HR">Finance & HR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Logo Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="HTTPS link to image"
                      value={jobLogo}
                      onChange={(e) => setJobLogo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Provide a detailed description of the role..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Requirements (One per line)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="BS in Computer Science&#10;3+ years React experience..."
                    value={jobReqs}
                    onChange={(e) => setJobReqs(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Benefits & Perks (One per line)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Medical insurance&#10;Flexible PTO..."
                    value={jobBens}
                    onChange={(e) => setJobBens(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsJobModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Application Modal */}
      {viewingApp && (() => {
        const applicant = getUserProfile(viewingApp.candidateId);
        const job = jobs.find(j => j.id === viewingApp.jobId) || {};
        return (
          <div className="modal-overlay" onClick={() => setViewingApp(null)}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Review Application</h3>
                <button className="modal-close" onClick={() => setViewingApp(null)}>&times;</button>
              </div>
              <form onSubmit={handleSaveAppStatus}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Candidate Profile Details */}
                  <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1rem' }}>
                      Candidate Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px' }}>
                      <div className="profile-avatar" style={{ width: '60px', height: '60px', fontSize: '1.4rem' }}>
                        {applicant.name ? applicant.name[0] : 'U'}
                      </div>
                      <div>
                        <div className="text-white" style={{ fontSize: '1.05rem' }}>{applicant.name}</div>
                        <div style={{ fontSize: '0.85rem' }}>{applicant.email}</div>
                        {applicant.education && (
                          <div style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--text-primary)' }}>
                            <strong>Education:</strong> {applicant.education}
                          </div>
                        )}
                        {applicant.experience && (
                          <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                            <strong>Experience:</strong> {applicant.experience}
                          </div>
                        )}
                      </div>
                    </div>
                    {applicant.bio && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        {applicant.bio}
                      </p>
                    )}
                    {applicant.skills && applicant.skills.length > 0 && (
                      <div className="skill-tags" style={{ marginTop: '12px' }}>
                        {applicant.skills.map((skill, i) => (
                          <span key={i} className="skill-tag" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Application details */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', fontSize: '0.95rem' }}>
                      Position Applied For
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong className="text-white">{job.title}</strong> at {job.company}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', fontSize: '0.95rem' }}>
                      Cover Letter
                    </div>
                    <div style={{ fontSize: '0.9rem', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                      {viewingApp.coverLetter || 'No cover letter was submitted.'}
                    </div>
                  </div>

                  <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />

                  {/* Status update fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Application Status</label>
                      <select
                        className="form-control"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="Applied">Applied (New)</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Interview">Interview</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Decision Date</label>
                      <input
                        type="text"
                        className="form-control"
                        value={new Date(viewingApp.appliedDate).toLocaleDateString()}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Recruiter Feedback / Notes (Visible to Candidate)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Add notes for candidate regarding status change..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      style={{ resize: 'vertical' }}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setViewingApp(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Status Changes</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
