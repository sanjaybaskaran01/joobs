import React from 'react';
import { sampleAchievements } from '../data/sampleData';
import './Achievements.css';

const Achievements = () => {
  const unlockedAchievements = sampleAchievements.filter(a => a.unlocked);
  const lockedAchievements = sampleAchievements.filter(a => !a.unlocked);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalXP = unlockedAchievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);

  return (
    <div className="achievements">
      <header className="achievements-header">
        <h2>🏆 Achievements</h2>
        <div className="achievement-stats">
          <div className="stat">
            <span className="stat-number">{unlockedAchievements.length}</span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="stat">
            <span className="stat-number">{totalXP}</span>
            <span className="stat-label">Total XP</span>
          </div>
        </div>
      </header>

      <div className="achievements-progress">
        <div className="progress-info">
          <span>Progress: {unlockedAchievements.length}/{sampleAchievements.length}</span>
          <span>{Math.round((unlockedAchievements.length / sampleAchievements.length) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${(unlockedAchievements.length / sampleAchievements.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="achievement-section">
          <h3 className="section-title">✅ Unlocked</h3>
          <div className="achievements-grid">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card unlocked">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div className="achievement-meta">
                    <div className="achievement-xp">+{achievement.xpReward} XP</div>
                    <div className="achievement-date">
                      Unlocked {formatDate(achievement.unlockedDate)}
                    </div>
                  </div>
                </div>
                <div className="achievement-status">
                  <span className="status-check">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="achievement-section">
          <h3 className="section-title">🔒 Locked</h3>
          <div className="achievements-grid">
            {lockedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card locked">
                <div className="achievement-icon locked-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div className="achievement-meta">
                    <div className="achievement-xp">+{achievement.xpReward} XP</div>
                  </div>
                </div>
                <div className="achievement-status">
                  <span className="status-lock">🔒</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;