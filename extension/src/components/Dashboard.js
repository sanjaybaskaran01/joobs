import React from 'react';
import { sampleUserStats, sampleAchievements } from '../data/sampleData';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    totalXP, 
    currentLevel, 
    xpToNextLevel, 
    currentStreak, 
    longestStreak,
    totalApplications,
    interviews,
    offers 
  } = sampleUserStats;

  const recentAchievements = sampleAchievements
    .filter(achievement => achievement.unlocked)
    .slice(-3);

  const progressPercentage = ((totalXP % 300) / 300) * 100; // Assuming 300 XP per level

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎯 Joobs Dashboard</h1>
        <div className="level-badge">
          Level {currentLevel}
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="xp-section">
        <div className="xp-info">
          <span className="xp-current">{totalXP} XP</span>
          <span className="xp-next">{xpToNextLevel} to next level</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card applications">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-number">{totalApplications}</div>
            <div className="stat-label">Applications</div>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-number">{currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="stat-card interviews">
          <div className="stat-icon">🎤</div>
          <div className="stat-info">
            <div className="stat-number">{interviews}</div>
            <div className="stat-label">Interviews</div>
          </div>
        </div>

        <div className="stat-card offers">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-number">{offers}</div>
            <div className="stat-label">Offers</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="achievements-section">
        <h3>🏆 Recent Achievements</h3>
        <div className="achievements-list">
          {recentAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-item">
              <span className="achievement-icon">{achievement.icon}</span>
              <div className="achievement-info">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className="achievement-xp">+{achievement.xpReward} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary">
          📝 Add Job Application
        </button>
        <button className="action-btn secondary">
          📊 View All Jobs
        </button>
      </div>
    </div>
  );
};

export default Dashboard;