import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

const ACCESS_TOKEN_KEY = 'job_tracker_access_token';
const REFRESH_TOKEN_KEY = 'job_tracker_refresh_token';
const FIREBASE_TOKEN_KEY = 'job_tracker_firebase_token';

// Listen for OAuth token messages from auth-callback
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OAUTH_TOKENS') {
    // Store tokens in chrome.storage.local
    // Exchange the firebase custom token for an ID token

    (async () => {
      try {
        const resp = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.CEB_FIREBASE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: message.firebaseToken,
              returnSecureToken: true,
            }),
          },
        );

        const data: any = await resp.json();

        chrome.storage.local.set(
          {
            [ACCESS_TOKEN_KEY]: message.accessToken,
            [REFRESH_TOKEN_KEY]: message.refreshToken,
            [FIREBASE_TOKEN_KEY]: data.idToken,
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
                firebaseToken: message.firebaseToken,
              })
              .catch(() => {
                // Popup might not be open, that's fine
                console.log('No popup to notify');
              });
          },
        );

        // Log the response from Firebase to avoid unused variable
        console.log('Firebase signInWithCustomToken response', data);
      } catch (err: any) {
        console.error('Error exchanging firebase token', err);
        sendResponse({ success: false, error: err?.message || String(err) });
      }
    })();

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
