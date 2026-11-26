# Protected Examination Tools — Release Checklist

Repository: `rahulbachute/adypsoe-exam-portal`
Feature branch: `feature/protected-exam-tools`
PR: #1 (draft)

## Current state
- Local integration testing: PASSED (user-confirmed, 25 November 2026)
- Public GitHub Pages verification: PENDING
- Release approval: PENDING
- Merge and launch: NOT APPROVED

## Public-origin test procedure

Use the published portal origin (not localhost):
https://rahulbachute.github.io/adypsoe-exam-portal/

### A. Authorised account
- [ ] Sign in using an authorised account.
- [ ] Examination Tools page opens.
- [ ] Question Paper–Number Register card is visible for an account with the required permission.
- [ ] Open the register.
- [ ] Secure-session confirmation appears.
- [ ] Examination Type dropdown loads.
- [ ] Subject dropdown loads and subject codes are populated.
- [ ] Search/read existing register data works.
- [ ] Confirm no unexpected errors in browser console.

### B. Unauthorised account
- [ ] Sign in with a Google account that has no Firestore authorisation record.
- [ ] Access is denied.
- [ ] The register iframe is not loaded.
- [ ] Sign-out/recovery behaves correctly.

### C. Disabled account
- [ ] Test an account with `active: false`.
- [ ] Access is denied.
- [ ] The register iframe is not loaded.

### D. Tool permission denial
- [ ] Test an active account without `question-paper-register`, `*`, or `super_admin`.
- [ ] Register card is hidden.
- [ ] Direct navigation to `register.html` is denied.

### E. Backend checks
- [ ] Read/search register works.
- [ ] Status-update workflow works, if applicable.
- [ ] Direct Apps Script URL access without a valid Firebase ID token is denied.
- [ ] Backend rejects inactive or insufficiently permissioned users.
- [ ] Token/session failure does not expose register data.

### F. Number allocation
- [ ] Do not allocate a test number in the production register unless a safe, approved test procedure is agreed.
- [ ] If production allocation is tested, use an explicitly approved test record and verify the audit trail and cleanup procedure.
- [ ] Confirm existing numbering/history is preserved.

## Evidence
Record date, tester, account category (do not record passwords or tokens), result, and screenshots of outcomes. Redact personal data where needed.

## Release decision
Only after all applicable checks pass:
1. Complete final review of PR changes.
2. Remove Draft status.
3. Obtain explicit release approval.
4. Merge PR into `main`.
5. Verify GitHub Pages deployment.
6. Re-test the live portal and register from the public origin.
