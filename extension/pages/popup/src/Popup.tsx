import '@src/Popup.css';
import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SignInScreen from './components/SignInScreen';
import TrackerScreen from './components/TrackerScreen';
import { Home } from './screens/Home';
import { Friends } from './screens/Friends';
import { Profile } from './screens/Profile';
import { queryClient } from './lib/queryClient';
import { useAppStore } from './store/useAppStore';
import { useDataPrefetch } from './hooks/useDataPrefetch';

const ACCESS_TOKEN_KEY = 'job_tracker_access_token';
const REFRESH_TOKEN_KEY = 'job_tracker_refresh_token';

const PopupContent = () => {
  const { isAuthenticated, currentScreen, setAuthenticated, setCurrentScreen } = useAppStore();
  
  // Prefetch user data when authenticated
  useDataPrefetch();

  useEffect(() => {
    // Check for tokens in chrome.storage.local
    chrome.storage.local.get([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY], result => {
      if (result[ACCESS_TOKEN_KEY] && result[REFRESH_TOKEN_KEY]) {
        setAuthenticated(true);
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

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <SignInScreen />;
    }

    switch (currentScreen) {
      case 'friends':
        return <Friends onBack={navigateToHome} />;
      case 'profile':
        return <Profile onBack={navigateToHome} />;
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
