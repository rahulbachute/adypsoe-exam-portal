# Apps Script + Sheets authentication implementation

## Architecture decision
The public ADYPSOE examination information site remains on GitHub Pages. The restricted Examination Tools workspace is served by a separate Google Apps Script Web App using HTMLService. The browser calls server functions through google.script.run; every protected server function verifies the Google ID token and checks the private AuthorisedUsers sheet.

## Why the protected workspace is served by Apps Script
GitHub Pages is static hosting and cannot enforce server-side access. HTMLService keeps tool calls within the Apps Script server boundary and avoids treating a client-side login flag as proof of identity.

## Setup
1. Create a private Google Sheet owned by the institution. Create a tab named AuthorisedUsers with headers: Email, DisplayName, Role, Active, AllowedTools, CreatedAt, UpdatedAt.
2. Restrict the sheet to the designated administrator(s). Do not publish or share it with ordinary users.
3. Create an Apps Script project owned by the institution and add Code.gs and Index.html from this folder.
4. In Apps Script Project Settings → Script Properties, set USER_SHEET_ID and GOOGLE_OAUTH_CLIENT_ID.
5. Create a Google Cloud OAuth Web application client. Add the Apps Script / Google identity authorised origins as required by Google Identity Services; configure the exact Apps Script web app host and test in the deployed environment.
6. Replace the placeholder client ID in Index.html with the configured OAuth client ID. Never put a client secret in HTML or repository files.
7. Run setupUserRegistry() as the project owner.
8. Deploy the Apps Script project as a Web App. Review the execute-as and access settings carefully; test with institutional and approved external accounts. Do not assume Session.getActiveUser() is reliable for every deployment mode.
9. Add user rows only after verifying the person's Google account. Example: Role=exam_staff, Active=TRUE, AllowedTools=question-paper-register.
10. Link the deployed protected portal from the public website after tests pass.

## Security model
- The browser sends a Google ID token, not a user-supplied email or role.
- The server validates the token against Google's tokeninfo endpoint, checks audience, issuer, expiry and verified email.
- The server looks up the email in the private registry and checks Active and AllowedTools.
- Every tool operation must repeat the server-side authorisation check. Never rely on a hidden button or page.
- The AuthorisedUsers sheet is private and administrator-maintained. Do not add public endpoints for arbitrary user creation or role changes.
- Tokeninfo is used as an initial verification implementation. For production scale, consider cryptographic JWT verification/caching and a formal security review.

## Question Paper–Number Register integration
The existing register is not yet connected. Its existing Apps Script functions must be moved into or called from the protected project, or changed so every public entry point validates the same ID token and tool permission. Do not expose the old register URL as the only control. Preserve its allocation logic, audit log, status updates and existing spreadsheet.

## Current scaffold limitations
The Google Identity Services client ID placeholder must be replaced. The supplied HTML has sign-in disabled until configuration is completed. The code is a scaffold, not a deployed or security-audited production service. Test authorised, unauthorised, inactive, revoked, external Gmail, token expiry and direct endpoint attempts before launch.
