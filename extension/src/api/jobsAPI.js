// API service for job application tracking
class JobsAPI {
  constructor() {
    this.baseURL = 'http://localhost:3001/api'; // Backend API URL
  }

  // Authenticate with Gmail
  async authenticateGmail() {
    // Implementation for Gmail OAuth integration
    return chrome.identity.getAuthToken({ interactive: true });
  }

  // Fetch job applications from backend
  async getJobApplications() {
    try {
      const response = await fetch(`${this.baseURL}/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }

  // Submit new job application
  async submitJobApplication(jobData) {
    try {
      const response = await fetch(`${this.baseURL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting job application:', error);
      throw error;
    }
  }

  // Get user achievements
  async getAchievements() {
    try {
      const response = await fetch(`${this.baseURL}/achievements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  // Get user stats (XP, streaks, etc.)
  async getUserStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { xp: 0, streak: 0, totalApplications: 0 };
    }
  }
}

export default new JobsAPI();