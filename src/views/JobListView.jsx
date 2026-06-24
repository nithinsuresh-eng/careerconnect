import React, { useState, useEffect } from 'react';

export default function JobListView({ jobs, onViewJob, initialQuery = '', initialCategory = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState({ Job: false, Internship: false });
  const [selectedModes, setSelectedModes] = useState({ Remote: false, Hybrid: false, 'On-site': false });
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync with initial props changes (e.g., if user searches from home page)
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Extract all unique categories
  const categories = Array.from(new Set(jobs.map(j => j.category)));

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchCat = job.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchDesc && !matchCat) return false;
    }

    // 2. Opportunity Type
    const typeActive = selectedTypes.Job || selectedTypes.Internship;
    if (typeActive) {
      if (selectedTypes.Job && job.type !== 'Job') return false;
      if (selectedTypes.Internship && job.type !== 'Internship') return false;
    }

    // 3. Work Mode
    const modeActive = selectedModes.Remote || selectedModes.Hybrid || selectedModes['On-site'];
    if (modeActive) {
      if (!selectedModes[job.workMode]) return false;
    }

    // 4. Category
    if (selectedCategory && job.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleModeChange = (mode) => {
    setSelectedModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  // Card Mouse Move Effect for Glowing Border
  const handleMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes({ Job: false, Internship: false });
    setSelectedModes({ Remote: false, Hybrid: false, 'On-site': false });
    setSelectedCategory('');
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Explore Opportunities</h2>
          <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>Find and apply to the best matching career opportunities</p>
        </div>
      </div>

      <div className="job-listings-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Filters</h3>
            <button
              onClick={clearFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>

          {/* Search Box */}
          <div className="filter-section">
            <h4 className="filter-title">Search Keyword</h4>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Title, company, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px 12px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Opportunity Type */}
          <div className="filter-section">
            <h4 className="filter-title">Opportunity Type</h4>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedTypes.Job}
                onChange={() => handleTypeChange('Job')}
              />
              <span>Full-time Job</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedTypes.Internship}
                onChange={() => handleTypeChange('Internship')}
              />
              <span>Internship</span>
            </label>
          </div>

          {/* Work Mode */}
          <div className="filter-section">
            <h4 className="filter-title">Work Mode</h4>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedModes.Remote}
                onChange={() => handleModeChange('Remote')}
              />
              <span>Remote</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedModes.Hybrid}
                onChange={() => handleModeChange('Hybrid')}
              />
              <span>Hybrid</span>
            </label>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedModes['On-site']}
                onChange={() => handleModeChange('On-site')}
              />
              <span>On-site</span>
            </label>
          </div>

          {/* Category Dropdown */}
          <div className="filter-section">
            <h4 className="filter-title">Job Category</h4>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '10px 12px', fontSize: '0.9rem', width: '100%' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Listings List */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Showing {filteredJobs.length} opportunities
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="dashboard-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ marginBottom: '8px' }}>No Opportunities Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px' }}>
                We couldn't find any listings matching your search parameters. Try adjusting your filters or search keywords.
              </p>
              <button className="btn btn-secondary" onClick={clearFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="listings-list">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="job-card"
                  onMouseMove={(e) => handleMouseMove(e, job.id)}
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
          )}
        </main>
      </div>
    </div>
  );
}
