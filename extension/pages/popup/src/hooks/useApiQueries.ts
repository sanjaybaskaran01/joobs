import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserJobsApplied,
  fetchUserChart,
  fetchFriendsChart,
  fetchUserFriends,
  fetchApplicationStatuses,
  refreshApplicationStatuses,
  fetchUserProfile,
  fetchUserAchievements,
  getUser,
} from '../api/api';
import { useAppStore } from '../store/useAppStore';

// Query keys for consistent caching
export const queryKeys = {
  userJobsApplied: ['userJobsApplied'] as const,
  userChart: ['userChart'] as const,
  friendsChart: (friendName: string) => ['friendsChart', friendName] as const,
  userFriends: ['userFriends'] as const,
  applicationStatuses: ['applicationStatuses'] as const,
  userProfile: ['userProfile'] as const,
  userAchievements: ['userAchievements'] as const,
  user: ['user'] as const,
};

// Custom hooks for API queries
export const useUserJobsApplied = () => {
  const jobsAppliedData = useAppStore((state) => state.jobsAppliedData);
  const setJobsAppliedData = useAppStore((state) => state.setJobsAppliedData);
  
  return useQuery({
    queryKey: queryKeys.userJobsApplied,
    queryFn: fetchUserJobsApplied,
    initialData: jobsAppliedData, // Use cached data immediately
    onSuccess: (data: any) => {
      setJobsAppliedData(data);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user jobs applied:', error);
      setJobsAppliedData(null);
    },
  });
};

export const useUserChart = () => {
  const chartData = useAppStore((state) => state.chartData);
  const setChartData = useAppStore((state) => state.setChartData);
  
  return useQuery({
    queryKey: queryKeys.userChart,
    queryFn: fetchUserChart,
    initialData: chartData, // Use cached data immediately
    onSuccess: (data: any) => {
      setChartData(data);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user chart:', error);
      setChartData(null);
    },
  });
};

export const useFriendsChart = (friendName: string) => {
  return useQuery({
    queryKey: queryKeys.friendsChart(friendName),
    queryFn: () => fetchFriendsChart(friendName),
    enabled: !!friendName, // Only run query if friendName is provided
  });
};

export const useUserFriends = () => {
  const friends = useAppStore((state) => state.friends);
  const setFriends = useAppStore((state) => state.setFriends);
  
  return useQuery({
    queryKey: queryKeys.userFriends,
    queryFn: fetchUserFriends,
    initialData: friends.length > 0 ? { friends } : undefined, // Use cached data if available
    onSuccess: (data: any) => {
      setFriends(data.friends);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user friends:', error);
      setFriends([]);
    },
  });
};

export const useApplicationStatuses = () => {
  const applicationStatuses = useAppStore((state) => state.applicationStatuses);
  const setApplicationStatuses = useAppStore((state) => state.setApplicationStatuses);
  
  return useQuery({
    queryKey: queryKeys.applicationStatuses,
    queryFn: fetchApplicationStatuses,
    initialData: applicationStatuses.length > 0 ? { applications: applicationStatuses } : undefined,
    onSuccess: (data: any) => {
      setApplicationStatuses(data.applications);
    },
    onError: (error: any) => {
      console.error('Failed to fetch application statuses:', error);
      setApplicationStatuses([]);
    },
  });
};

export const useUserProfile = () => {
  const userProfile = useAppStore((state) => state.userProfile);
  const setUserProfile = useAppStore((state) => state.setUserProfile);
  
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: fetchUserProfile,
    initialData: userProfile, // Use cached data immediately
    onSuccess: (data: any) => {
      setUserProfile(data);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    },
  });
};

export const useUserAchievements = () => {
  const achievements = useAppStore((state) => state.achievements);
  const setAchievements = useAppStore((state) => state.setAchievements);
  
  return useQuery({
    queryKey: queryKeys.userAchievements,
    queryFn: fetchUserAchievements,
    initialData: achievements.length > 0 ? { achievements } : undefined,
    onSuccess: (data: any) => {
      setAchievements(data.achievements);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user achievements:', error);
      setAchievements([]);
    },
  });
};

export const useUser = () => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getUser,
    initialData: user, // Use cached data immediately
    onSuccess: (data: any) => {
      setUser(data);
    },
    onError: (error: any) => {
      console.error('Failed to fetch user:', error);
      setUser(null);
    },
  });
};

// Mutation hooks
export const useRefreshApplicationStatuses = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: refreshApplicationStatuses,
    onSuccess: () => {
      // Invalidate and refetch application statuses after successful refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.applicationStatuses });
    },
    onError: (error) => {
      console.error('Failed to refresh application statuses:', error);
    },
  });
};

// Utility hook to prefetch all user data
export const usePrefetchUserData = () => {
  const queryClient = useQueryClient();
  
  const prefetchAll = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.userJobsApplied,
      queryFn: fetchUserJobsApplied,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.userChart,
      queryFn: fetchUserChart,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.userFriends,
      queryFn: fetchUserFriends,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.applicationStatuses,
      queryFn: fetchApplicationStatuses,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.userProfile,
      queryFn: fetchUserProfile,
    });
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.userAchievements,
      queryFn: fetchUserAchievements,
    });
  };
  
  return { prefetchAll };
};
