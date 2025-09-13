import { Router, Request, Response } from 'express';
import { getAuthUrl, getTokensFromCode, getUserInfo } from '../config/google';
// import { getAuth, getFirestore } from '../config/firebase';
import { createCustomToken } from '../services/authService';
import { google } from 'googleapis';
import { getAdminAuth, getAdminFirestore } from "../config/firebase";


const router = Router();

// Function to decode base64url encoded content
const decodeBase64Url = (str: string): string => {
  try {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64url:', error);
    return str; // Return original if decoding fails
  }
};

// Function to extract email content from payload
const extractEmailContent = (payload: any): { textContent: string; htmlContent: string; hasAttachments: boolean } => {
  let textContent = '';
  let htmlContent = '';
  let hasAttachments = false;
  
  const extractFromPart = (part: any): void => {
    if (part.filename && part.filename.length > 0) {
      hasAttachments = true;
    }
    
    if (part.mimeType === 'text/plain' && part.body?.data) {
      textContent += decodeBase64Url(part.body.data);
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      htmlContent += decodeBase64Url(part.body.data);
    } else if (part.parts && Array.isArray(part.parts)) {
      // Recursively process multipart content
      part.parts.forEach(extractFromPart);
    }
  };
  
  if (payload.parts && Array.isArray(payload.parts)) {
    payload.parts.forEach(extractFromPart);
  } else if (payload.body?.data) {
    // Single part message
    if (payload.mimeType === 'text/plain') {
      textContent = decodeBase64Url(payload.body.data);
    } else if (payload.mimeType === 'text/html') {
      htmlContent = decodeBase64Url(payload.body.data);
    }
  }
  
  return { textContent, htmlContent, hasAttachments };
};

// Function to fetch recent emails using Gmail API
const fetchRecentEmails = async (accessToken: string, maxResults: number = 10) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Get list of recent messages
    const messagesResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults,
    });
    
    if (!messagesResponse.data.messages || messagesResponse.data.messages.length === 0) {
      return {
        emails: [],
        totalCount: 0,
        message: 'No emails found'
      };
    }
    
    // Get full details for each message
    const emailPromises = messagesResponse.data.messages.map(async (message) => {
      const emailResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full' // Changed from 'metadata' to 'full' to get complete email content
      });
      
      const email = emailResponse.data;
      const headers = email.payload?.headers || [];
      
      // Extract email metadata
      const getHeader = (name: string) => 
        headers.find(header => header.name?.toLowerCase() === name.toLowerCase())?.value || '';
      
      // Extract email content
      const { textContent, htmlContent, hasAttachments } = extractEmailContent(email.payload);
      
      return {
        id: email.id,
        threadId: email.threadId,
        snippet: email.snippet,
        from: getHeader('From'),
        to: getHeader('To'),
        cc: getHeader('Cc'),
        bcc: getHeader('Bcc'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        labelIds: email.labelIds,
        isUnread: email.labelIds?.includes('UNREAD') || false,
        isImportant: email.labelIds?.includes('IMPORTANT') || false,
        timestamp: email.internalDate,
        sizeEstimate: email.sizeEstimate,
        // Full content
        content: {
          text: textContent,
          html: htmlContent,
          hasAttachments: hasAttachments
        }
      };
    });
    
    const emails = await Promise.all(emailPromises);
    
    return {
      emails: emails,
      totalCount: messagesResponse.data.resultSizeEstimate || 0,
      message: `Successfully fetched ${emails.length} recent emails with full content`
    };
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Initiate Google OAuth flow
router.get('/google', (req: Request, res: Response) => {
  try {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({ error: "Failed to generate authentication URL" });
  }
});

/**
 * Step 2: Handle Google OAuth callback
 */
router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    if (!tokens.access_token) {
      return res.status(400).json({ error: "Failed to obtain access token" });
    }

    // Get user info from Google
    const userInfo = await getUserInfo(tokens.access_token);
    if (!userInfo.email) {
      return res.status(400).json({ error: "Failed to get user email" });
    }

    console.log('User authenticated:', userInfo);

    // Fetch recent emails
    let emailData = null;
    let emailError = null;
    
    try {
      emailData = await fetchRecentEmails(tokens.access_token, 10);
      console.log(`Fetched ${emailData.emails.length} recent emails for user: ${userInfo.email}`);
    } catch (error) {
      console.error('Error fetching emails during auth:', error);
      emailError = error instanceof Error ? error.message : 'Failed to fetch emails';
    }

    // Return user info, tokens, and email data
    const response: any = {
      success: true,
      userInfo,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      },
      message: 'Authentication successful'
    };

    // Include email data if successfully fetched
    if (emailData) {
      response.emails = emailData;
    } else if (emailError) {
      response.emailError = emailError;
      response.message += ' (Note: Email fetching failed)';
    }

    res.json(response);
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// New endpoint to fetch emails independently (useful for testing or refreshing email data)
router.get('/emails/recent', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const accessToken = authHeader.split('Bearer ')[1];
    const { maxResults = 10 } = req.query;

    // Verify token is still valid
    const tokenResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    if (!tokenResponse.ok) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    const emailData = await fetchRecentEmails(accessToken, parseInt(maxResults as string));
    
    res.json({
      success: true,
      data: emailData,
      message: 'Recent emails fetched successfully'
    });
    
  } catch (error) {
    console.error('Error fetching recent emails:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent emails',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user info
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "No valid authorization token provided" });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    const user = await auth.getUser(decodedToken.uid);

    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

/**
 * Step 4: Test endpoint for Firebase Auth
 */
// router.get("/test-firebase-connection", async (_req, res) => {
//   try {
//     const auth = getAdminAuth();
//     const userList = await auth.listUsers(1);
//     res.json({
//       message: "Connected to Firebase",
//       sampleUser: userList.users[0] || null,
//     });
//   } catch (error: any) {
//     console.error("Firebase connection failed:", error);
//     res.status(500).json({
//       error: "Firebase connection failed",
//       details: error.message || error,
//     });
//   }
// });


// router.get("/test-firebase-applications", async (_req, res) => {
//   try {
//     const db = getAdminFirestore();

//     // Query first 5 job applications
//     const snapshot = await db.collection("jobApplications").limit(5).get();

//     const jobApplications = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.json({
//       message: "Connected to Firebase Firestore",
//       jobApplications,
//     });
//   } catch (error: any) {
//     console.error("Firestore connection failed:", error);
//     res.status(500).json({
//       error: "Firestore connection failed",
//       details: error.message || error,
//     });
//   }
// });


/**
 * Step 5: Logout
 */
router.post("/logout", async (_req: Request, res: Response) => {
  try {
    // Optional: revoke tokens in Google here
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

export { router as authRoutes };
