import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token from localStorage on each request (synchronous)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // const token = localStorage.getItem('authToken');
      const token =
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUwMDZlMjc5MTVhMTcwYWIyNmIxZWUzYjgxZDExNjU0MmYxMjRmMjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vam9vYnMtNzFiY2UiLCJhdWQiOiJqb29icy03MWJjZSIsImF1dGhfdGltZSI6MTc1Nzc3OTY3MiwidXNlcl9pZCI6InRlc3QtdXNlci11aWQiLCJzdWIiOiJ0ZXN0LXVzZXItdWlkIiwiaWF0IjoxNzU3Nzc5NjcyLCJleHAiOjE3NTc3ODMyNzIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.U4t5Deo67An_jtuxJOAUVssncXX-onodFKQ4Sqc1of1H7Iip1qXPcflbm3YK3MFpM4jMq8yV9FO0P4RWpvOhVMxDHNIoiThEqB3rqRx7whb8m_QWHpK4MBAPuMOPLFRwRpOu9Oq_B-2l9GmN32204ukQhP8SoqzkGS9ADdGsnuK8rHGAyeKErja7YWUdzOlpk-U4hzy4RHMahp80r56P96K0YJm6ucb97enJ0sR5yPu4M2Us-FcH1-rkaa-N_YdT0UIVGO3XPcospM5Ck9jgg8baP-rMti9zQIRr9qB75HkTzQpicqbfO7dooFcrK8hxHM2E1-shdmJsX0qHXmHolg';
      if (token) {
        // Merge existing headers into a plain object and cast to any to avoid AxiosHeaders type mismatch
        config.headers = {
          ...((config.headers as Record<string, unknown>) || {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    } catch {
      /* ignore storage errors */
    }
    return config;
  },
  error => Promise.reject(error),
);

// Optionally unwrap responses and forward errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    // You can normalize error shape here if desired
    return Promise.reject(error);
  },
);

/**
 * Set or clear the Authorization token used by the axios instance.
 * Also persists token to localStorage for the popup lifecycle.
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      localStorage.setItem('authToken', token);
    } catch {
      /* ignore storage errors */
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try {
      localStorage.removeItem('authToken');
    } catch {
      /* ignore storage errors */
    }
  }
}

export async function fetchUserJobsApplied() {
  try {
    const response = await api.post<{ dates: string[]; streak: number, totalApplications: number }>('/api/v1/jobs_applied_dates');
    return response.data;
  } catch (error) {
    console.error('Error fetching user jobs applied:', error);
    throw error;
  }
}

export async function fetchUserChart() {
  try {
    const response = await api.post<{ x: string[]; y: number[] }>('/api/v1/user_chart');
    return response.data;
  } catch (error) {
    console.error('Error fetching user chart data:', error);
    throw error;
  }
}

// Verify if this is possible.
export async function fetchFriendsChart(friendName: string) {
  try {
    const response = await api.get<{ x: string[]; y: number[] }>('/api/v1/friend_user_chart', {
      params: {
        friendName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friends chart data:', error);
    throw error;
  }
}

export async function fetchUserFriends() {
  try {
    const response = await api.get<{ friends: { name: string; xp: number; streak: number }[] }>('/api/v1/friends');
    return response.data;
  } catch (error) {
    console.error('Error fetching user friends:', error);
    throw error;
  }
}

export async function fetchApplicationStatuses() {
  try {
    const response = await api.get<{
      applications: { icon: string; company_name: string; last_updated: string; status: string; email_url: string }[];
    }>('/api/v1/application_status');
    return response.data;
  } catch (error) {
    console.error('Error fetching application statuses:', error);
    throw error;
  }
}

export async function refreshApplicationStatuses() {
  try {
    const response = await api.post<{ success: boolean }>('/api/v1/refresh_applications', {
      accessToken: localStorage.getItem('googleAccessToken'),
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing application statuses:', error);
    throw error;
  }
}

export async function fetchUserProfile() {
  try {
    const response = await api.get<{ xp: number; invite_code: string }>('/api/v1/user_details');
    // Store this in local storage for easy access
    localStorage.setItem('inviteCode', response.data.invite_code);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function fetchUserAchievements() {
  try {
    const response = await api.get<{ achievements: { description: string; xp: number; completed: boolean }[] }>(
      '/api/v1/achievements',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    const response = await api.get<{ uid: string; email: string; displayName: string }>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
}

export default api;
