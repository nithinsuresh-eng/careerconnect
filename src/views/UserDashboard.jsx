import React, { useState } from 'react';
import { db } from '../services/db';

export default function UserDashboard({ user, jobs, applications, onUpdateUser, onViewJob }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'profile'
  
  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [education, setEducation] = useState(user?.education || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  if (!user) return null;

  // Filter applications that belong to current candidate user
  const userApps = applications.filter(app => app.candidateId === user.id);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setSaveError('');

    const res = db.updateProfile(user.id, {
      name,
      bio,
      education,
      experience,
      skills
    });

    if (res.success) {
      setSaveSuccess('Profile updated successfully!');
      onUpdateUser(res.user);
      setTimeout(() => setSaveSuccess(''), 3000);
    } else {
      setSaveError(res.error || 'Failed to update profile.');
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanInput = skillInput.trim();
    if (cleanInput && !skills.includes(cleanInput)) {
      setSkills([...skills, cleanInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="dashboard-layout">
      {/* Welcome header */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h2>Welcome, {user.name}!</h2>
          <p style={{ fontSize: '0.95rem' }}>Manage your applications, profile, and track hiring decisions.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications ({userApps.length})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile & CV
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'applications' ? (
        <div>
          {userApps.length === 0 ? (
            <div className="dashboard-panel empty-state">
              <div className="empty-state-icon">📁</div>
              <h3>No Applications Yet</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 16px' }}>
                You haven't applied to any jobs or internships yet. Check out our opportunity board to find your match!
              </p>
              <button className="btn btn-primary" onClick={() => window.location.hash = '#jobs'}>
                Browse Opportunities
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userApps.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                if (!job) return null;

                // Map statuses to appropriate badge CSS class names
                const statusClasses = {
                  'Applied': 'badge-applied',
                  'Reviewing': 'badge-reviewing',
                  'Interview': 'badge-interview',
                  'Offered': 'badge-offered',
                  'Rejected': 'badge-rejected'
                };
                const badgeClass = statusClasses[app.status] || 'badge-applied';

                return (
                  <div key={app.id} className="job-card" style={{ cursor: 'default' }}>
                    <img src={job.logo} alt={job.company} className="company-logo" />
                    <div className="job-card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <h3 className="job-card-title">{job.title}</h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                          <span className="job-card-company" style={{ margin: 0 }}>{job.company}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                          {app.status}
                        </span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => onViewJob(job.id)}
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Track Status
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Main Edit Form */}
          <div className="dashboard-panel">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Edit Professional Profile
            </h3>
            
            <form onSubmit={handleProfileSave}>
              {saveSuccess && (
                <div style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  {saveSuccess}
                </div>
              )}
              {saveError && (
                <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {saveError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Short intro about yourself, interests, goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Education</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Degree, Major, Institution (Year of graduation)"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Experience</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Summarize your past roles, internships, and key achievements..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Sidebar Skills Management */}
          <div className="dashboard-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Skills & Tags
            </h3>
            
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add skill (e.g. Python)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px' }}>Add</button>
            </form>

            <div className="skill-tags">
              {skills.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '10px 0' }}>
                  No skills added yet. Add skills to stand out to recruiters!
                </div>
              ) : (
                skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      className="skill-tag-remove"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
