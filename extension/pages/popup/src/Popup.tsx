import '@src/Popup.css';
import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SignInScreen from './components/SignInScreen';
import TrackerScreen from './components/TrackerScreen';
import { Home } from './screens/Home';
import { Friends } from './screens/Friends';
import { Profile } from './screens/Profile';
import { AddFriend } from './screens/AddFriend';
import { forceRefreshApplications } from './api/api';
import { queryClient } from './lib/queryClient';
import { useAppStore } from './store/useAppStore';
import { useDataPrefetch } from './hooks/useDataPrefetch';

const ACCESS_TOKEN_KEY = 'job_tracker_access_token';
const REFRESH_TOKEN_KEY = 'job_tracker_refresh_token';
const FIREBASE_TOKEN_KEY = 'job_tracker_firebase_token';


const PopupContent = () => {
  const { isAuthenticated, currentScreen, setAuthenticated, setCurrentScreen } = useAppStore();
  
  // Prefetch user data when authenticated
  useDataPrefetch();

  useEffect(() => {
    // Check for tokens in chrome.storage.local
    chrome.storage.local.get([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, FIREBASE_TOKEN_KEY], async result => {
      if (result[ACCESS_TOKEN_KEY] && result[REFRESH_TOKEN_KEY] && result[FIREBASE_TOKEN_KEY]) {
        setIsAuthenticated(true);
        
        // Force refresh applications when popup opens and user is authenticated
        try {
          await forceRefreshApplications(result[ACCESS_TOKEN_KEY]);
          console.log('Applications refreshed on popup open');
        } catch (error) {
          console.error('Failed to refresh applications on popup open:', error);
        }
      }
    });

    // Listen for auth success message from background script
    const messageListener = (message: any, sender: any, sendResponse: any) => {
      if (message.type === 'AUTH_SUCCESS') {
        setAuthenticated(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [setAuthenticated]);

  const navigateToFriends = () => {
    setCurrentScreen('friends');
  };

  const navigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  const navigateToAddFriend = () => {
    setCurrentScreen('addFriend');
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <SignInScreen />;
    }

    switch (currentScreen) {
      case 'friends':
        return <Friends onBack={navigateToHome} onNavigateToAddFriend={navigateToAddFriend} />;
      case 'profile':
        return <Profile onBack={navigateToHome} />;
      case 'addFriend':
        return <AddFriend onBack={() => setCurrentScreen('friends')} />;
      case 'home':
      default:
        return <Home onNavigateToFriends={navigateToFriends} onNavigateToProfile={navigateToProfile} />;
    }
  };

  return <div className="App">{renderScreen()}</div>;
};

const Popup = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PopupContent />
      {/* Only show devtools in development */}
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
};

export default Popup;
