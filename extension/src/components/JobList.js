import React, { useState } from 'react';
import { sampleJobApplications, jobStatusColors, jobStatusLabels } from '../data/sampleData';
import './JobList.css';

const JobList = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredJobs = sampleJobApplications.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    } else if (sortBy === 'company') {
      return a.company.localeCompare(b.company);
    } else if (sortBy === 'xp') {
      return b.xpEarned - a.xpEarned;
    }
    return 0;
  });

  const getStatusBadge = (status) => (
    <span 
      className="status-badge" 
      style={{ backgroundColor: jobStatusColors[status] }}
    >
      {jobStatusLabels[status]}
    </span>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="job-list">
      <header className="job-list-header">
        <h2>📋 My Applications</h2>
        <div className="job-count">{sortedJobs.length} jobs</div>
      </header>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="oa">Online Assessment</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Recent</option>
            <option value="company">Company</option>
            <option value="xp">XP Earned</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="jobs-container">
        {sortedJobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <div className="job-company">{job.company}</div>
              {getStatusBadge(job.status)}
            </div>
            
            <div className="job-position">{job.position}</div>
            
            <div className="job-details">
              <div className="job-detail">
                <span className="detail-icon">💰</span>
                <span className="detail-text">{job.salaryRange}</span>
              </div>
              
              <div className="job-detail">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{job.location}</span>
              </div>
            </div>

            <div className="job-footer">
              <div className="job-dates">
                <div className="date-item">
                  <span className="date-label">Applied:</span>
                  <span className="date-value">{formatDate(job.appliedDate)}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Updated:</span>
                  <span className="date-value">{formatDate(job.lastUpdated)}</span>
                </div>
              </div>
              
              <div className="job-xp">
                <span className="xp-icon">⭐</span>
                <span className="xp-value">{job.xpEarned} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedJobs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No applications found</div>
          <div className="empty-description">
            Try adjusting your filters or add your first job application!
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;