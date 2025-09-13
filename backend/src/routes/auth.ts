import { Router, Request, Response } from "express";
import { getAuthUrl, getTokensFromCode, getUserInfo } from "../config/google";
import { getAdminAuth, getAdminFirestore } from "../config/firebase"; // ✅ Use Admin SDK only
import { createCustomToken } from "../services/authService";

const router = Router();

/**
 * Step 1: Initiate Google OAuth flow
 */
router.get("/google", (req: Request, res: Response) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
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
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Authorization code is required" });
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

    // Get Firebase Admin Auth instance
    const auth = getAdminAuth();

    // Check if user exists in Firebase Auth, otherwise create
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(userInfo.email);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        firebaseUser = await auth.createUser({
          email: userInfo.email,
          displayName: userInfo.name,
          photoURL: userInfo.picture,
          emailVerified: true,
        });
        console.log(`✅ New user created: ${userInfo.email}`);
      } else {
        throw error;
      }
    }

    // Store OAuth tokens in Firestore
    const db = getAdminFirestore();
    await db.collection("users").doc(firebaseUser.uid).set(
      {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        googleTokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
        },
        lastLogin: new Date(),
        createdAt: firebaseUser.metadata.creationTime,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Create custom Firebase token
    const customToken = await createCustomToken(firebaseUser.uid);

    // Redirect to frontend with token (or return JSON)
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    res.redirect(`${frontendUrl}/auth/success?token=${customToken}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * Step 3: Get current user info
 */
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "No valid authorization token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
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
 * Step 4: Test endpoint for Firebase Auth
 */
router.get("/test-firebase-connection", async (_req, res) => {
  try {
    const auth = getAdminAuth();
    const userList = await auth.listUsers(1);
    res.json({
      message: "Connected to Firebase",
      sampleUser: userList.users[0] || null,
    });
  } catch (error: any) {
    console.error("Firebase connection failed:", error);
    res.status(500).json({
      error: "Firebase connection failed",
      details: error.message || error,
    });
  }
});


router.get("/test-firebase-applications", async (_req, res) => {
  try {
    const db = getAdminFirestore();

    // Query first 5 job applications
    const snapshot = await db.collection("jobApplications").limit(5).get();

    const jobApplications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      message: "Connected to Firebase Firestore",
      jobApplications,
    });
  } catch (error: any) {
    console.error("Firestore connection failed:", error);
    res.status(500).json({
      error: "Firestore connection failed",
      details: error.message || error,
    });
  }
});


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
