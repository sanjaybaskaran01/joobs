import { Router, Request, Response } from 'express';
import { getAuthUrl, getTokensFromCode, getUserInfo } from '../config/google';
import { google } from 'googleapis';
import { getAdminAuth, getAdminFirestore } from "../config/firebase";

import { createGmailService, getDaysAgoTimestamp } from '../services/gmailService';

const router = Router();

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

    // Generate Firebase custom token
    const auth = getAdminAuth();
    const firebaseToken = await auth.createCustomToken(userInfo.id!);

    console.log(`USER_INFO_ID`, userInfo.id);

    const redirectURL = `chrome-extension://${process.env.EXTENSION_ID}/auth-callback.html?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&firebase_token=${firebaseToken}`;

    console.log(`FIREBASE_TOKEN`, firebaseToken);
    // Create the user if not exists
    // Store the user info in the firebase database
    const db = getAdminFirestore();
    // Get userId of the authenticated user
    const userDoc = await db.collection('users').doc(userInfo.id!).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(userInfo.id!).set({
        achievements: [],
        friends: [],
        name: userInfo.name,
        xp: 0,
        streak: 0
      });
      // Generate a 5 letter referral code
      let inviteCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      // Check if referral code already exists
      const inviteDoc = await db.collection('inviteCode').doc(inviteCode).get();
      while (inviteDoc.exists) {
        // If exists, generate a new one (in practice, you might want a more robust method)
        inviteCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const referralDoc = await db.collection('referralCodes').doc(inviteCode).get();
        if (!referralDoc.exists) {
          break;
        }
      }
      await db.collection('inviteCode').doc(inviteCode).set({
        userId: userInfo.id!,
        createdAt: new Date()
      });
    }

    return res.redirect(redirectURL)
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.status(500).json({ error: "Authentication failed" });
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
    const auth = getAdminAuth();
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
 * Refresh Firebase ID token using refresh token
 */
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Exchange refresh token for new ID token using Firebase REST API
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    const data: any = await response.json();

    if (!data.id_token) {
      return res.status(400).json({ 
        error: 'Failed to refresh token',
        details: data
      });
    }

    return res.json({
      success: true,
      tokens: {
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
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
