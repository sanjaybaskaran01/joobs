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
  "/refresh/user_chart",
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
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
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
      await userRef.set({ cumulativeApplications: { x, y } }, { merge: true });
      console.log("Updated cumulativeApplications for user:", x, y);

      res.json({ success: true });
    } catch (error) {
      console.error("Error in /refresh/user_chart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
