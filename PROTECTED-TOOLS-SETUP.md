# ADYPSOE Protected Examination Tools – Setup and Security

## Architecture
- Public information pages remain on GitHub Pages.
- The Examination Tools workspace uses Firebase Authentication with Google sign-in.
- Access requires an active record at Firestore `authorisedUsers/{Firebase UID}`.
- The Firestore rules in `firestore.rules` permit a user to read only their own access record. Client-side writes are denied.
- The Administrator creates, disables and updates authorisation records through a trusted administrative process; never expose administrator credentials in this repository.

## Account policy
Use institutional Google accounts as the normal account type. An external Gmail account may be granted access only when the Administrator creates an active authorisation record for that account's Firebase UID. Do not rely on a client-side email-domain check as a security boundary. The current implementation uses explicit UID authorisation for every account, allowing institutional and specifically approved external accounts.

Suggested authorisation document:
```json
{
  "active": true,
  "role": "exam_staff",
  "displayName": "Authorised User",
  "allowedTools": ["question-paper-register"]
}
```
Create this document only from a trusted administrator account after the user has signed in once and their UID has been verified. Do not grant access based only on a typed email address.

## Firebase setup
1. Create or select an institute-owned Firebase project.
2. Register the GitHub Pages site as a Web App and copy its configuration into `assets/js/firebase-config.js`.
3. Enable Google as a sign-in provider in Firebase Authentication.
4. Add the exact GitHub Pages hostname to the authorised domains in Firebase Authentication.
5. Create the Firestore database and deploy `firestore.rules`.
6. Enable Firebase Authentication and Firestore billing/quotas and monitoring appropriate to institutional use.
7. Create authorisation documents only through a trusted administrative workflow.
8. Test with an unauthorised Google account, an authorised institutional account, an authorised external Gmail account, and a disabled account.

## Critical integration requirement for the Question Paper–Number Register
The login page and workspace gate do **not** by themselves secure the existing Google Apps Script register. A user could otherwise open its deployment URL directly. Before publishing the register tile:
- Modify the Apps Script backend to validate a cryptographically verified identity token and check the user's active tool permission on every read and write operation.
- Do not trust an email address, role or UID sent as ordinary form data by the browser.
- Do not expose the register's Apps Script deployment URL or enable the tile until backend verification is complete.
- Preserve existing register allocation, audit, status-update and Google Sheet workflows.
- Keep the existing Apps Script deployment and spreadsheet permissions restricted appropriately.

## Deployment status
This repository contains the frontend scaffold and Firestore rules only. Authentication is intentionally disabled until the institute-owned Firebase configuration is supplied. The register integration is intentionally pending until its Apps Script backend is updated and tested. Do not describe this scaffold as production-secure until those steps and direct-URL bypass tests pass.
