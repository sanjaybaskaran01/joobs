import admin from "firebase-admin";
import { readFileSync } from "fs";
import dotenv from 'dotenv';
dotenv.config();

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
  console.log(process.env.FIREBASE_API_KEY)

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

  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn
  };
}

async function refreshIdToken(refreshToken: string) {
  const resp = await fetch(
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

  const data: any = await resp.json();

  if (!data.id_token) {
    throw new Error("Failed to refresh ID token: " + JSON.stringify(data));
  }

  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in
  };
}

// Run script
(async () => {
  try {
    const uid = "test-user-uid"; // 👈 change this to simulate different users
    const tokens = await getIdToken(uid);

    console.log("\n=== Firebase ID Token Generated ===");
    console.log("Paste this header in Postman:\n");
    console.log(`Authorization: Bearer ${tokens.idToken}\n`);
    
    console.log("Save this refresh token for when the ID token expires:");
    console.log(`Refresh Token: ${tokens.refreshToken}\n`);
    console.log(`Expires in: ${tokens.expiresIn} seconds\n`);

    // Example of how to refresh the token
    console.log("To refresh token when it expires, use:");
    console.log(`const newTokens = await refreshIdToken("${tokens.refreshToken}");\n`);
    
  } catch (err) {
    console.error("Error generating ID token:", err);
    process.exit(1);
  }
})();
