// Extract tokens from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const refreshToken = urlParams.get('refresh_token');
const firebaseToken = urlParams.get('firebase_token');


if (accessToken && refreshToken) {
  // Send tokens to the extension
  chrome.runtime.sendMessage(
    {
      type: 'OAUTH_TOKENS',
      accessToken: accessToken,
      refreshToken: refreshToken,
      firebaseToken: firebaseToken,
    },
    response => {
      console.log('Tokens sent to extension:', response);
      // Close the tab after sending tokens
      setTimeout(() => {
        window.close();
      }, 1000);
    },
  );
} else {
  console.error('No tokens found in URL parameters');
}
