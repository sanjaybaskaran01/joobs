import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const router = Router();

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

  // Update lastFetched to now
  await userRef.set({ lastFetched: Timestamp.now() }, { merge: true });

  // Stub: return dummy emails
  return [
  "Sender: GSRecruiting@oracle.com Subject: Continue to apply for the job 2026 | Americas | Chicago | Asset Management, Asset Marketing | Summer Analyst\nBody: Hi Sanjay Kumar, We saved a draft of your job application for the job 2026 | Americas | Chicago | Asset Management, Asset Marketing | Summer Analyst. We invite you to complete and submit your job application.",
  "Sender: salesforce@myworkday.com Subject: Great News! We’ve Received Your Application for the Summer 2026 Intern - Software Engineer Position\nBody: Hi Sanjay Kumar, You have officially applied for the Summer 2026 Intern - Software Engineer opening at Salesforce, the world’s #1 agent-first enterprise. Thanks for showing interest in our one-of-a-kind community of innovators, customer success makers, and lifelong learners.",
  "Sender: abwalker@andrew.cmu.edu Subject: Re: Internship for Software Engineers_Summer 2026\nBody: A quick follow up: CPDC does not grade the course and your progress is likely to be left ungraded. Do not worry about that. I have access to the CPDC course and am able to see your completion rate based on which I will be grading that assignment: 90-100 - 10 points 80-90 - 9 points 70-80 - 8 points etc."
];
}

// --- Step 2: Parse email with Claude API ---
async function parseEmail(
  emailText: string
): Promise<{ company: string; position: string; status: string }> {
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
  console.log("Claude response data:", data);

  try {
    return JSON.parse(content);
  } catch {
    console.warn("Claude output not valid JSON:", content);
    return { company: "Unknown", status: "indeterminate" };
  }
}


// --- Step 3: Update jobApplications in Firestore ---
async function updateApplication(userId: string, parsed: { company: string; position: string; status: string }) {
  const db = getFirestore();
    const colRef = db.collection("jobApplications");

  // Check if record exists for this company
  const existingSnap = await colRef
    .where("userId", "==", userId)
    .where("company", "==", parsed.company)
    .where("position", "==", parsed.position)
    .limit(1)
    .get();

  if (existingSnap.empty) {
    // Create new application record
    await colRef.add({
      userId,
      company: parsed.company,
      position: parsed.position, // could be parsed later
      status: parsed.status,
      applicationDate: new Date(),
      statusHistory: [{ status: parsed.status, date: new Date() }]
    });
    console.log(`Created new application for ${parsed.company}`);
  } else {
    // Update existing application
    const docRef = existingSnap.docs[0].ref;
    const data = existingSnap.docs[0].data();

    await docRef.update({
      status: parsed.status,
      statusHistory: [
        ...(data.statusHistory || []),
        { status: parsed.status, date: new Date() }
      ]
    });
    console.log(`Updated application for ${parsed.company}`);
  }
}

// --- API Route ---
router.post("/refresh/applications", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.uid;
    if (!userId) throw new Error("Missing userId from authMiddleware");

    // Step 1: Fetch new emails
    const emails = await fetchNewEmails(userId);

    // Step 2: Parse and update for each email
    for (const emailText of emails) {
      const parsed = await parseEmail(emailText);
      if (parsed.company !== "indeterminate" && parsed.status !== "indeterminate" && parsed.position !== "indeterminate" &&
            parsed.company !== null && parsed.status !== null && parsed.position !== null) {
        await updateApplication(userId, parsed);
      }
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
