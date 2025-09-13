# Firebase Gmail Server

A Node.js TypeScript server that integrates Firebase Authentication with Google OAuth to fetch Gmail emails for authenticated users.

## Features

- 🔐 **Google OAuth Authentication** - Secure user authentication via Google
- 📧 **Gmail API Integration** - Fetch and read user emails
- 🔥 **Firebase Integration** - User management and data storage
- 🛡️ **TypeScript** - Type-safe development
- 🚀 **Express.js** - Fast and reliable web server
- 📱 **RESTful API** - Clean API endpoints

## Prerequisites

Before running this application, you need to set up:

1. **Google Cloud Console Project**
2. **Firebase Project**
3. **Gmail API Access**

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Gmail API
   - Google+ API (for user info)
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - Your production domain callback URL

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings > Service Accounts
4. Generate a new private key (downloads JSON file)
5. Enable Authentication and Firestore Database

### 3. Environment Configuration

1. Copy `env.example` to `.env`
2. Fill in all the required environment variables:

```bash
# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Google OAuth Configuration (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Gmail API Scopes
GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly
```

### 4. Installation and Running

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## API Endpoints

### Authentication

- `GET /auth/google` - Get Google OAuth URL
- `GET /auth/google/callback` - Handle OAuth callback
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### Gmail Integration

- `GET /api/emails` - Get user's emails
  - Query params: `maxResults`, `pageToken`
- `GET /api/emails/:emailId` - Get specific email details
- `GET /api/emails/search/:query` - Search emails
- `GET /api/emails/stats/summary` - Get email statistics

### Health Check

- `GET /health` - Server health status

## Usage Example

### 1. Start Authentication Flow

```javascript
// Get OAuth URL
const response = await fetch('http://localhost:3000/auth/google');
const { authUrl } = await response.json();

// Redirect user to authUrl
window.location.href = authUrl;
```

### 2. Fetch Emails (after authentication)

```javascript
// Get user's emails
const response = await fetch('http://localhost:3000/api/emails?maxResults=10', {
  headers: {
    'Authorization': `Bearer ${firebaseToken}`
  }
});

const { data } = await response.json();
console.log(data.emails);
```

### 3. Search Emails

```javascript
// Search for emails
const query = encodeURIComponent('from:example@gmail.com');
const response = await fetch(`http://localhost:3000/api/emails/search/${query}`, {
  headers: {
    'Authorization': `Bearer ${firebaseToken}`
  }
});

const { data } = await response.json();
console.log(data.emails);
```

## Project Structure

```
src/
├── config/
│   ├── firebase.ts      # Firebase configuration
│   └── google.ts        # Google OAuth configuration
├── middleware/
│   └── errorHandler.ts  # Error handling middleware
├── routes/
│   ├── auth.ts          # Authentication routes
│   └── emails.ts        # Email-related routes
├── services/
│   ├── authService.ts   # Authentication service
│   └── gmailService.ts  # Gmail API service
└── index.ts             # Main server file
```

## Security Features

- ✅ Firebase Authentication integration
- ✅ JWT token verification
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Error handling

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Clean build directory
npm run clean
```

## Troubleshooting

### Common Issues

1. **"Gmail access not authorized"**
   - Ensure user has completed OAuth flow
   - Check if Gmail API is enabled in Google Cloud Console

2. **"Firebase not initialized"**
   - Verify Firebase service account credentials
   - Check environment variables

3. **"Invalid token"**
   - Ensure Firebase token is valid and not expired
   - Check token format in Authorization header

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and stack traces.

## License

MIT License - feel free to use this project for your applications.

