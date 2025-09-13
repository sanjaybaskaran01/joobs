import '@src/Popup.css';
import { useEffect, useState } from 'react';
import SignInScreen from './components/SignInScreen';
import TrackerScreen from './components/TrackerScreen';
import { Home } from './screens/Home';
import { Friends } from './screens/Friends';
import { Profile } from './screens/Profile';

const ACCESS_TOKEN_KEY = 'job_tracker_access_token';
const REFRESH_TOKEN_KEY = 'job_tracker_refresh_token';

const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'friends' | 'profile'>('home');

  useEffect(() => {
    // Check for tokens in chrome.storage.local
    chrome.storage.local.get([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY], result => {
      if (result[ACCESS_TOKEN_KEY] && result[REFRESH_TOKEN_KEY]) {
        setIsAuthenticated(true);
      }
    });

    // Listen for auth success message from background script
    const messageListener = (message: any, sender: any, sendResponse: any) => {
      if (message.type === 'AUTH_SUCCESS') {
        setIsAuthenticated(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

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

export default Popup;
