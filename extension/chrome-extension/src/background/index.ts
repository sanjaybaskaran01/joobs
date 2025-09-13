import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

const ACCESS_TOKEN_KEY = 'job_tracker_access_token';
const REFRESH_TOKEN_KEY = 'job_tracker_refresh_token';

// Listen for OAuth token messages from auth-callback
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OAUTH_TOKENS') {
    // Store tokens in chrome.storage.local
    chrome.storage.local.set(
      {
        [ACCESS_TOKEN_KEY]: message.accessToken,
        [REFRESH_TOKEN_KEY]: message.refreshToken,
      },
      () => {
        console.log('OAuth tokens stored successfully');
        sendResponse({ success: true });

        // Notify any open popups about the authentication
        chrome.runtime
          .sendMessage({
            type: 'AUTH_SUCCESS',
            accessToken: message.accessToken,
            refreshToken: message.refreshToken,
          })
          .catch(() => {
            // Popup might not be open, that's fine
            console.log('No popup to notify');
          });
      },
    );

    // Return true to indicate we'll send a response asynchronously
    return true;
  }

  // Return false for other message types
  return false;
});

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
