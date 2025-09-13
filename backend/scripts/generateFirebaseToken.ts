// scripts/generateFirebaseToken.js
require("dotenv").config();
const { getAdminAuth, initializeFirebase } = require("../src/config/firebase");

async function generateCustomToken() {
  initializeFirebase();
  const customToken = await getAdminAuth().createCustomToken("test-user-123");
  console.log("Custom Token:", customToken);
}

generateCustomToken().catch((err) => {
  console.error("Error generating custom token:", err);
  process.exit(1);
});
