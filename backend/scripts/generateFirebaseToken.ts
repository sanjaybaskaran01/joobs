import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load service account JSON
const serviceAccount = JSON.parse(
  readFileSync("serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


async function getIdToken(uid: string) {
  // Create a custom token for the user
  const customToken = await admin.auth().createCustomToken(uid);

  // Exchange the custom token for an ID token
  const resp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );

  const data: any = await resp.json();

  if (!data.idToken) {
    throw new Error("Failed to generate ID token: " + JSON.stringify(data));
  }

  return data.idToken;
}

// Run script
(async () => {
  try {
    const uid = "test-user-uid"; // 👈 change this to simulate different users
    const idToken = await getIdToken(uid);

    console.log("\n=== Firebase ID Token Generated ===");
    console.log("Paste this header in Postman:\n");
    console.log(`Authorization: Bearer ${idToken}\n`);
  } catch (err) {
    console.error("Error generating ID token:", err);
    process.exit(1);
  }
})();
