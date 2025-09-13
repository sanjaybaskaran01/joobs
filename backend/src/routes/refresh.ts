import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

const router = Router();

const XP_PER_APPLICATION = 10;

// --- Step 1: Fetch new emails since lastFetched ---
async function fetchNewEmails(userId: string): Promise<string[]> {
  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  let lastFetched: Date | null = null;
  if (userSnap.exists) {
    lastFetched = userSnap.data()?.lastFetched?.toDate?.() ?? null;
  }

  console.log(`Fetching emails for ${userId} since`, lastFetched);

  await userRef.set({ lastFetched: Timestamp.now() }, { merge: true });

  return [
    "Sender: GSRecruiting@oracle.com Subject: Continue to apply for the job 2026 | Americas | Chicago | Asset Management, Asset Marketing | Summer Analyst\nBody: Hi Sanjay Kumar, We saved a draft of your job application...",
    "Sender: salesforce@myworkday.com Subject: Great News! We’ve Received Your Application for the Summer 2026 Intern - Software Engineer Position\nBody: Hi Sanjay Kumar, You have officially applied for the Summer 2026 Intern...",
    "Sender: salesforce@myworkday.com Subject: Great News! We’ve Received Your Application for the Summer 2025 Intern - Software Engineer Position\nBody: Hi Sanjay Kumar, You have officially applied for the Summer 2025 Intern...",
    "Sender: salesforce@myworkday.com Subject: Great News! We’ve Received Your Application for the Summer 2024 Intern - Software Engineer Position\nBody: Hi Sanjay Kumar, You have officially applied for the Summer 2024 Intern...",
    "Sender: salesforce@myworkday.com Subject: Great News! We’ve Received Your Application for the Summer 2023 Intern - Software Engineer Position\nBody: Hi Sanjay Kumar, You have officially applied for the Summer 2023 Intern...",
    "Sender: abwalker@andrew.cmu.edu Subject: Re: Internship for Software Engineers_Summer 2026\nBody: A quick follow up..."
  ];
}

// --- Step 2: Parse email with Claude ---
async function parseEmail(emailText: string): Promise<{ company: string; position: string; status: string }> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.CLAUDE_API_KEY || "",
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 300,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `The email may or may not be a job application email. If it is, extract the company, position name, and application status from the email below.
Status must be one of: applied, OA, interview, offer, rejected, indeterminate.
Return JSON ONLY in the format: {"company": "...", "position": "...", "status": "..."}

Email:
${emailText}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text;

  try {
    return JSON.parse(content);
  } catch {
    return { company: "indeterminate", position: "indeterminate", status: "indeterminate" };
  }
}

// --- Step 3: Update jobApplications in Firestore ---
async function updateApplication(userId: string, parsed: { company: string; position: string; status: string }) {
  const db = getFirestore();
  const colRef = db.collection("jobApplications");

  const existingSnap = await colRef
    .where("userId", "==", userId)
    .where("company", "==", parsed.company)
    .where("position", "==", parsed.position)
    .limit(1)
    .get();

  if (existingSnap.empty) {
    await colRef.add({
      userId,
      company: parsed.company,
      position: parsed.position,
      status: parsed.status,
      applicationDate: new Date(),
      statusHistory: [{ status: parsed.status, date: new Date() }]
    });
    return true;
  } else {
    const docRef = existingSnap.docs[0].ref;
    const data = existingSnap.docs[0].data();

    await docRef.update({
      status: parsed.status,
      statusHistory: [...(data.statusHistory || []), { status: parsed.status, date: new Date() }]
    });
    return true;
  }
}

export type JobApplication = {
  userId: string;
  company: string;
  position: string;
  status: string;
  applicationDate: Date;
  statusHistory: { status: string; date: Date }[];
};

interface Achievement {
  name: string;
  description: string;
  xpReward: number;
}

// --- Step 4: Reprocess achievements ---
async function reprocessAchievements(userId: string) {
  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);
  const appsSnap = await db.collection("jobApplications").where("userId", "==", userId).get();
  const userSnap = await userRef.get();

  if (!userSnap.exists) return;

const achievementsSnap = await db.collection("achievements").get();
const ACHIEVEMENTS = achievementsSnap.docs.map(doc => doc.data() as Achievement);

  const userData = userSnap.data() || {};
  const unlocked: string[] = userData.achievements || [];
  let xp = userData.xp || 0;

const apps: JobApplication[] = appsSnap.docs.map(doc => {
  const data = doc.data();

  return {
    userId: data.userId,
    company: data.company,
    position: data.position,
    status: data.status,
    applicationDate:
      typeof data.applicationDate?.toDate === "function"
        ? data.applicationDate.toDate()
        : new Date(data.applicationDate),
    statusHistory: (data.statusHistory || []).map((h: any) => ({
      status: h.status,
      date:
        typeof h.date?.toDate === "function"
          ? h.date.toDate()
          : new Date(h.date),
    })),
  };
});  const totalApps = apps.length;
  const today = new Date().toDateString();

  const newAchievements: string[] = [];

  // Normalize application dates once
const appsWithDates: JobApplication[] = apps.map(app => ({
  ...app,
  applicationDate:
    typeof app.applicationDate?.toDate === "function"
      ? app.applicationDate.toDate()
      : new Date(app.applicationDate),
}));

// Build a date->count map for streaks
const dateCounts: Record<string, number> = {};
for (const app of appsWithDates) {
  const day = app.applicationDate.toDateString();
  dateCounts[day] = (dateCounts[day] || 0) + 1;
}

const sortedDates = Object.keys(dateCounts)
  .map(d => new Date(d))
  .sort((a, b) => a.getTime() - b.getTime());

for (const a of ACHIEVEMENTS) {
  if (unlocked.includes(a.name)) continue;

  let achieved = false;
  switch (a.name) {
    case "First Application":
      achieved = totalApps >= 1;
      break;

    case "Five in a Day":
      const todayCount = appsWithDates.filter(
        app => app.applicationDate.toDateString() === today
      ).length;
      achieved = todayCount >= 5;
      break;

    case "Ten Total":
      achieved = totalApps >= 10;
      break;

    case "Hundred Club":
      achieved = totalApps >= 100;
      break;

    case "Weekend Warrior":
      achieved = appsWithDates.some(app => {
        const d = app.applicationDate.getDay();
        return d === 0 || d === 6;
      });
      break;

    // --- Streak achievements ---
    case "Consistency is Key": // 3-day streak
      achieved = hasStreak(sortedDates, 3);
      break;
    case "Weekly Streak": // 7-day streak
      achieved = hasStreak(sortedDates, 7);
      break;
    case "Two-Week Hustle": // 14-day streak
      achieved = hasStreak(sortedDates, 14);
      break;
    case "Job Hunt Marathoner": // 30-day streak
      achieved = hasStreak(sortedDates, 30);
      break;

    // --- Application Quality/Progress ---
    case "First Response":
      achieved = appsWithDates.some(app => (app.statusHistory || []).length > 1);
      break;
    case "First Interview":
      achieved = appsWithDates.some(app => app.status === "interview");
      break;
    case "Technical Challenger":
      achieved = appsWithDates.some(app => app.status === "OA");
      break;
    case "Onsite Experience":
      achieved = appsWithDates.some(app =>
        app.status?.toLowerCase().includes("onsite")
      );
      break;
    case "Offer Received":
      achieved = appsWithDates.some(app => app.status === "offer");
      break;

    // --- Engagement/Behavior ---
    case "Early Bird":
      achieved = appsWithDates.some(app => {
        const hour = app.applicationDate.getHours();
        return hour < 8;
      });
      break;
    case "Night Owl":
      achieved = appsWithDates.some(app => {
        const hour = app.applicationDate.getHours();
        return hour >= 0 && hour < 5;
      });
      break;
  }

  if (achieved) {
    unlocked.push(a.name);
    xp += a.xpReward;
    newAchievements.push(a.name);
  }
}

  if (newAchievements.length > 0) {
    await userRef.set({ achievements: unlocked, xp }, { merge: true });
    console.log(`User ${userId} unlocked achievements:`, newAchievements);
  }
}

/**
 * Helper: check if there is a streak of N consecutive days
 */
function hasStreak(dates: Date[], length: number): boolean {
  if (dates.length < length) return false;

  // Convert to unique sorted days
  const days = [...new Set(dates.map(d => d.toDateString()))].map(d => new Date(d));
  days.sort((a, b) => a.getTime() - b.getTime());

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = days[i - 1];
    const curr = days[i];
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
      if (streak >= length) return true;
    } else {
      streak = 1;
    }
  }
  return false;
}


// --- API Route ---
router.post("/refresh/applications", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.uid;
    if (!userId) throw new Error("Missing userId from authMiddleware");

    const emails = await fetchNewEmails(userId);
    let updated = false;

    const db = getFirestore();
    const existingAppsSnap = await db.collection("jobApplications").where("userId", "==", userId).get();
    let originalAppCount = existingAppsSnap.size;

    for (const emailText of emails) {
      const parsed = await parseEmail(emailText);
      if (parsed.company !== "indeterminate" && parsed.status !== "indeterminate" && parsed.position !== "indeterminate" && parsed.company !== null && parsed.status !== null && parsed.position !== null) {
        const didUpdate = await updateApplication(userId, parsed);
        if (didUpdate) updated = true;
      }
    }

    const newAppsSnap = await db.collection("jobApplications").where("userId", "==", userId).get();
    let newAppCount = newAppsSnap.size;

    if (updated) {
      const appsAdded = newAppCount - originalAppCount;
      const xpGained = appsAdded * XP_PER_APPLICATION;
      if (xpGained > 0) {
        // Update user XP
        const userRef = db.collection("users").doc(userId);
        await userRef.set({ xp: FieldValue.increment(xpGained) }, { merge: true });
        console.log(`User ${userId} gained ${xpGained} XP for ${appsAdded} new applications.`);
      }
      await reprocessAchievements(userId);
    }

    return res.json({
      success: true,
      message: "Applications refreshed successfully",
      emailsProcessed: emails.length
    });
  } catch (err) {
    console.error("Error refreshing applications:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
