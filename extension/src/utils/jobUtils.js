// Utility functions for job tracking and gamification

export const calculateLevel = (xp) => {
  // Each level requires 300 XP more than the previous
  return Math.floor(xp / 300) + 1;
};

export const calculateXPToNextLevel = (xp) => {
  const currentLevelXP = xp % 300;
  return 300 - currentLevelXP;
};

export const calculateStreak = (applications) => {
  // Calculate current application streak
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    const hasApplication = applications.some(app => 
      app.appliedDate === dateString
    );

    if (hasApplication) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getXPForStatus = (status) => {
  const xpMap = {
    applied: 25,
    oa: 40,
    interview: 75,
    offer: 150,
    rejected: 15
  };
  return xpMap[status] || 0;
};

export const checkAchievements = (userStats, applications) => {
  const achievements = [];
  const { totalApplications, interviews, offers, currentStreak } = userStats;

  // First application
  if (totalApplications >= 1) {
    achievements.push('first_step');
  }

  // Five applications in one day
  const today = new Date().toISOString().split('T')[0];
  const todayApplications = applications.filter(app => app.appliedDate === today);
  if (todayApplications.length >= 5) {
    achievements.push('hot_streak');
  }

  // First interview
  if (interviews >= 1) {
    achievements.push('interview_ready');
  }

  // 7-day streak
  if (currentStreak >= 7) {
    achievements.push('consistency_king');
  }

  // First offer
  if (offers >= 1) {
    achievements.push('offer_collector');
  }

  // 50 applications
  if (totalApplications >= 50) {
    achievements.push('application_master');
  }

  return achievements;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    applied: '#3B82F6',
    oa: '#F59E0B',
    interview: '#10B981',
    offer: '#059669',
    rejected: '#EF4444'
  };
  return colors[status] || '#6B7280';
};

export const generateJobId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

export const saveToStorage = async (key, data) => {
  try {
    await chrome.storage.local.set({ [key]: data });
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

export const getFromStorage = async (key) => {
  try {
    const result = await chrome.storage.local.get([key]);
    return result[key] || null;
  } catch (error) {
    console.error('Error getting from storage:', error);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await chrome.storage.local.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};