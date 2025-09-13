import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { usePrefetchUserData } from './useApiQueries';

/**
 * Hook to prefetch user data when authenticated
 * This helps improve user experience by loading data in the background
 */
export const useDataPrefetch = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const { prefetchAll } = usePrefetchUserData();

  useEffect(() => {
    if (isAuthenticated) {
      // Prefetch all user data when authenticated
      prefetchAll();
    }
  }, [isAuthenticated, prefetchAll]);
};
