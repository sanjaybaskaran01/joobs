import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for our application state
export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface UserProfile {
  xp: number;
  invite_code: string;
}

export interface JobApplication {
  icon: string;
  company_name: string;
  last_updated: string;
  status: string;
  email_url: string;
}

export interface Friend {
  name: string;
  xp: number;
  streak: number;
}

export interface Achievement {
  description: string;
  xp: number;
  completed: boolean;
}

export interface JobsAppliedData {
  dates: string[];
  currentStreak: number;
}

export interface ChartData {
  x: string[];
  y: number[];
}

// Application state interface
interface AppState {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  
  // User data
  userProfile: UserProfile | null;
  jobsAppliedData: JobsAppliedData | null;
  chartData: ChartData | null;
  friends: Friend[];
  applicationStatuses: JobApplication[];
  achievements: Achievement[];
  
  // UI state
  currentScreen: 'home' | 'friends' | 'profile';
  isLoading: boolean;
  
  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setJobsAppliedData: (data: JobsAppliedData | null) => void;
  setChartData: (data: ChartData | null) => void;
  setFriends: (friends: Friend[]) => void;
  setApplicationStatuses: (applications: JobApplication[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setCurrentScreen: (screen: 'home' | 'friends' | 'profile') => void;
  setLoading: (loading: boolean) => void;
  
  // Utility actions
  clearUserData: () => void;
  updateUserXP: (xp: number) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        userProfile: null,
        jobsAppliedData: null,
        chartData: null,
        friends: [],
        applicationStatuses: [],
        achievements: [],
        currentScreen: 'home',
        isLoading: false,

        // Actions
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setUser: (user) => set({ user }),
        setUserProfile: (userProfile) => set({ userProfile }),
        setJobsAppliedData: (jobsAppliedData) => set({ jobsAppliedData }),
        setChartData: (chartData) => set({ chartData }),
        setFriends: (friends) => set({ friends }),
        setApplicationStatuses: (applicationStatuses) => set({ applicationStatuses }),
        setAchievements: (achievements) => set({ achievements }),
        setCurrentScreen: (currentScreen) => set({ currentScreen }),
        setLoading: (isLoading) => set({ isLoading }),

        // Utility actions
        clearUserData: () => set({
          user: null,
          userProfile: null,
          jobsAppliedData: null,
          chartData: null,
          friends: [],
          applicationStatuses: [],
          achievements: [],
        }),

        updateUserXP: (xp) => set((state) => ({
          userProfile: state.userProfile ? { ...state.userProfile, xp } : null,
        })),
      }),
      {
        name: 'app-store',
        // Only persist authentication and user data, not UI state
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          userProfile: state.userProfile,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);
