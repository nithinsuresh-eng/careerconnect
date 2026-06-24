import React, { useState } from 'react';
import { db } from '../services/db';

export default function AuthModal({ isOpen, onClose, onSuccess, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('candidate'); // 'candidate' | 'admin'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'login') {
      const res = db.login(email, password);
      if (res.success) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error);
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      const res = db.register({ name, email, password, role });
      if (res.success) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.9rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {error}
              </div>
            )}

            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Register As</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                  <label className="filter-option" style={{ margin: 0 }}>
                    <input
                      type="radio"
                      name="auth-role"
                      checked={role === 'candidate'}
                      onChange={() => setRole('candidate')}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                    />
                    <span>Candidate (Job Seeker)</span>
                  </label>
                  <label className="filter-option" style={{ margin: 0 }}>
                    <input
                      type="radio"
                      name="auth-role"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                    />
                    <span>Admin (Recruiter)</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer" style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {tab === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {tab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <span
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => { setTab('register'); setError(''); }}
                  >
                    Register here
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => { setTab('login'); setError(''); }}
                  >
                    Sign in here
                  </span>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
