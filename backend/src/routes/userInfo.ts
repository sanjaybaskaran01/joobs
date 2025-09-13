// Helper to get YYYY-MM-DD string from Date
function toDayString(date: Date): string {
  return date.toISOString().split("T")[0];
}
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import {
  createGmailService,
  getDaysAgoTimestamp,
} from "../services/gmailService";

const router = Router();

// --- API Route ---
router.post(
  "/user_chart",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");

      const db = getFirestore();
      const existingAppsSnap = await db
        .collection("jobApplications")
        .where("userId", "==", userId)
        .get();

      // Extract and sort application dates
      const appDates: Date[] = existingAppsSnap.docs
        .map((doc) => {
          const data = doc.data();
          if (
            data.applicationDate &&
            typeof data.applicationDate.toDate === "function"
          ) {
            return data.applicationDate.toDate();
          } else if (data.applicationDate) {
            return new Date(data.applicationDate);
          } else {
            return null;
          }
        })
        .filter((d): d is Date => d !== null)
        .sort((a, b) => a.getTime() - b.getTime());

      // Build cumulative arrays for x (dates) and y (cumulative counts)
      const x: string[] = [];
      const y: number[] = [];
      let cumulative = 0;
      let lastDate = null;
      for (const date of appDates) {
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
        if (lastDate !== dateStr) {
          cumulative = y.length > 0 ? y[y.length - 1] + 1 : 1;
          x.push(dateStr);
          y.push(cumulative);
          lastDate = dateStr;
        } else {
          // If multiple apps on same day, increment last y
          y[y.length - 1]++;
        }
      }

      // Store as { x: [...], y: [...] }
      const userRef = db.collection("users").doc(userId);
      await userRef.set({ user_chart: { x, y } }, { merge: true });
      console.log("Updated user_chart for user:", x, y);

      res.json({ x, y });
    } catch (error) {
      console.error("Error in /refresh/user_chart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Get a friend's user_chart by name ---
router.get(
  "/friend_user_chart",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const friendName = req.query.friendName as string;
      if (!friendName)
        return res
          .status(400)
          .json({ error: "Missing friendName query parameter" });
      const db = getFirestore();
      const friendSnap = await db
        .collection("users")
        .where("name", "==", friendName)
        .limit(1)
        .get();
      if (friendSnap.empty)
        return res.status(404).json({ error: "Friend not found" });
      const friendData = friendSnap.docs[0].data();
      const user_chart = friendData?.user_chart || { x: [], y: [] };
      return res.json({ x: user_chart.x, y: user_chart.y });
    } catch (error) {
      console.error("Error in /friend_user_chart:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Get friends info ---
router.get("/friends", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.uid;
    if (!userId) throw new Error("Missing userId from authMiddleware");

    const db = getFirestore();
    // Assume user's document has a 'friends' array of userIds
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    const friendIds: string[] = userData?.friends || [];

    if (!friendIds.length) {
      return res.json({ friends: [] });
    }

    // Fetch all friends' info by document ID
    const friends: { name: string; xp: number; streak: number }[] = [];
    for (const fid of friendIds) {
      const friendDoc = await db.collection("users").doc(fid).get();
      if (friendDoc.exists) {
        const d = friendDoc.data();
        friends.push({
          name: d?.name || "",
          xp: d?.xp || 0,
          streak: d?.streak || 0,
        });
      }
    }
    res.json({ friends });
  } catch (error) {
    console.error("Error in /friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- API Route: Get user's details (xp and invite_code) ---
router.get(
  "/user_details",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");

      const db = getFirestore();
      const userSnap = await db.collection("users").doc(userId).get();
      const data = userSnap.exists ? userSnap.data() : null;

      const xp = data?.xp || 0;
      const invite_code = data?.invite_code || "";

      res.json({ xp, invite_code });
    } catch (error) {
      console.error("Error in /user_details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Get user's achievements with completion status ---
router.get(
  "/achievements",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");
      const db = getFirestore();
      // Get all achievements
      const achievementsSnap = await db.collection("achievements").get();
      const allAchievements = achievementsSnap.docs.map((doc) => doc.data());
      // Get user's unlocked achievements
      const userSnap = await db.collection("users").doc(userId).get();
      const userAchievements: string[] = userSnap.exists
        ? userSnap.data()?.achievements || []
        : [];

      const achievements = allAchievements.map((a) => ({
        description: a.description || "",
        xp: a.xpReward || 0,
        completed: userAchievements.includes(a.name),
      }));

      res.json({ achievements });
    } catch (error) {
      console.error("Error in /achievements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Calculate and store current streak ---
router.post(
  "/jobs_applied_dates",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");

      const db = getFirestore();
      const appsSnap = await db
        .collection("jobApplications")
        .where("userId", "==", userId)
        .get();

      // Convert docs to Date[] (sorted ascending)
      const appDates: Date[] = appsSnap.docs
        .map((doc) => {
          const data = doc.data();
          if (
            data.applicationDate &&
            typeof data.applicationDate.toDate === "function"
          ) {
            return data.applicationDate.toDate();
          } else if (data.applicationDate) {
            return new Date(data.applicationDate);
          } else {
            return null;
          }
        })
        .filter((d): d is Date => d !== null)
        .sort((a, b) => a.getTime() - b.getTime());

      // Build unique YYYY-MM-DD date strings (ascending)
      const uniqueDates: string[] = Array.from(
        new Set(appDates.map((d) => toDayString(d)))
      ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      console.log("Unique application dates for streak calculation:", uniqueDates);

      // Calculate streak based on unique days, counting consecutive days ending today
      let streak = 0;
      if (uniqueDates.length > 0) {
        // Sort descending to check from today backwards
        const uniqueDesc = [...uniqueDates].sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        const todayStr = toDayString(new Date());
        let dayCursor = todayStr;
        let i = 0;
        while (i < uniqueDesc.length) {
          if (uniqueDesc[i] === dayCursor) {
            streak++;
            const prev = new Date(dayCursor);
            prev.setDate(prev.getDate() - 1);
            dayCursor = toDayString(prev);
            i++;
          } else {
            break;
          }
        }
      }

      // Store streak in user's Firestore document
      const userRef = db.collection("users").doc(userId);
      await userRef.set({ currentStreak: streak }, { merge: true });

      res.json({ dates: uniqueDates, currentStreak: streak });
    } catch (error) {
      console.error("Error in /jobs_applied_dates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Get user's application statuses ---
router.get(
  "/application_status",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");
      const db = getFirestore();
      const appsSnap = await db
        .collection("jobApplications")
        .where("userId", "==", userId)
        .get();
      const applications = appsSnap.docs.map((doc) => {
        const data = doc.data();
        // Get last statusHistory entry
        let lastUpdated = "";
        if (
          Array.isArray(data.statusHistory) &&
          data.statusHistory.length > 0
        ) {
          const last = data.statusHistory[data.statusHistory.length - 1];
          if (last.date && typeof last.date.toDate === "function") {
            lastUpdated = last.date.toDate().toISOString();
          } else if (last.date) {
            lastUpdated = new Date(last.date).toISOString();
          }
        }
        return {
          icon: "",
          company_name: data.company || "",
          last_updated: lastUpdated,
          status: data.status || "",
          email_url: "",
        };
      });
      res.json({ applications });
    } catch (error) {
      console.error("Error in /application_status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- API Route: Add a friend by invite code ---
router.post(
  "/add_friend",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;
      if (!userId) throw new Error("Missing userId from authMiddleware");
      const { invite_code } = req.body;
      if (!invite_code)
        return res.status(400).json({ error: "Missing invite_code in body" });

      const db = getFirestore();
      // Find invite code document
      const inviteDoc = await db
        .collection("inviteCode")
        .doc(invite_code)
        .get();
      if (!inviteDoc.exists)
        return res.status(404).json({ error: "Invalid invite code" });
      const friendUserId = inviteDoc.data()?.userId;
      if (!friendUserId)
        return res.status(404).json({ error: "Invite code missing userId" });

      // Add friendUserId to user's friends array (if not already present)
      const userRef = db.collection("users").doc(userId);
      await userRef.set(
        { friends: FieldValue.arrayUnion(friendUserId) },
        { merge: true }
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error in /add_friend:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
