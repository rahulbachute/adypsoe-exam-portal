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

## Question Paper–Number Register integration
- The portal checks Firebase sign-in, email verification, active authorisation and tool permission before loading the register iframe.
- The Apps Script backend independently validates the Firebase ID token using Firebase Identity Toolkit and reads the user's Firestore authorisation record. It checks active status, email consistency, role and required tool permission on every data operation.
- Do not trust an email address, role or UID sent as ordinary form data by the browser.
- The production Apps Script Web App URL is configured in `register.html`. The register should only be released after end-to-end tests, including direct-URL and unauthorised-user checks.
- Preserve existing register allocation, audit, status-update and Google Sheet workflows.
- The production spreadsheet should remain restricted; Apps Script execution access must be reviewed and tested.

## Verification status (25 November 2026)

### Local integration test — PASSED (user-confirmed)
Testing was completed through VS Code Live Server at `http://127.0.0.1:5500/`, with the portal login and Examination Tools navigation.

Verified successfully:
- Portal login with Firebase Google Authentication.
- Firestore authorisation gate.
- Portal-to-Apps-Script secure handshake.
- Firebase ID token delivery to the embedded register.
- Backend identity and permission verification.
- Secure session established.
- Examination Type dropdown loads.
- Subject dropdown loads and subject codes populate.
- User reports the register workflow is functioning correctly.

The sender validation was corrected to account for Google Apps Script's nested sandbox iframe structure. The portal validates the approved Apps Script sandbox origin and then binds the active session to the exact message source, origin and nonce.

### Remaining release verification — NOT YET COMPLETED
The successful test was local, not from the public GitHub Pages origin. Before release, test:
- Authorised account from the public Pages origin.
- Unauthorised account.
- Disabled account.
- Tool-level permission denial.
- Register read/search.
- New number allocation (only when safe to test against the approved production register).
- Status update.
- Direct Apps Script URL access and denial of unauthorised operations.
- Confirm deployed Firebase configuration, Firestore rules and Apps Script deployment are the intended production versions.

### Release state
- Firebase configuration and administrator authorisation record: configured.
- Production spreadsheet and Apps Script: configured.
- Production Web App URL: integrated in the feature branch.
- Local integration: **PASSED (user-confirmed)**.
- Public-origin production verification: **pending**.
- PR remains draft; do not merge or launch until remaining verification and release approval are complete.
