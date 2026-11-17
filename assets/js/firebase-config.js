// Replace values with the Web App configuration from the institute-owned Firebase project.
// These identifiers are not passwords, but the project must have Authentication and Firestore
// configured with the security rules supplied in firestore.rules.
export const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_WEB_API_KEY",
  authDomain: "REPLACE_WITH_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_PROJECT_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID"
};