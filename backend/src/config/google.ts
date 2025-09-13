import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const createOAuth2Client = (): OAuth2Client => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

export const getGmailScopes = (): string[] => {
  return [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',

  ];
};

export const getAuthUrl = (): string => {
  const oauth2Client = createOAuth2Client();
  const scopes = getGmailScopes();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Force consent screen to get refresh token
  });
};

export const getTokensFromCode = async (code: string) => {
  const oauth2Client = createOAuth2Client();
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens from code:', error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  try {
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const createGmailClient = (accessToken: string) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

