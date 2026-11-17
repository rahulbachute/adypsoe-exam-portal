/**
 * ADYPSOE Protected Examination Tools – Apps Script backend scaffold.
 * Deploy as a Web App serving the HTMLService interface. Do not expose sheet IDs
 * or administrative functions to the browser.
 *
 * Script Properties required:
 *   USER_SHEET_ID
 *   GOOGLE_OAUTH_CLIENT_ID
 *
 * User sheet tab: AuthorisedUsers
 * Columns: Email | DisplayName | Role | Active | AllowedTools | CreatedAt | UpdatedAt
 *
 * AllowedTools is a comma-separated list, e.g. question-paper-register,tool-02
 */
const AUTH_CONFIG = Object.freeze({
  USER_SHEET_NAME: 'AuthorisedUsers',
  HEADERS: ['Email','DisplayName','Role','Active','AllowedTools','CreatedAt','UpdatedAt']
});

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ADYPSOE | Protected Examination Tools')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** Run once by the project owner after setting USER_SHEET_ID. */
function setupUserRegistry() {
  const id = PropertiesService.getScriptProperties().getProperty('USER_SHEET_ID');
  if (!id) throw new Error('Set USER_SHEET_ID in Script Properties first.');
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName(AUTH_CONFIG.USER_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(AUTH_CONFIG.USER_SHEET_NAME);
  const existing = sheet.getRange(1,1,1,Math.max(1,sheet.getLastColumn())).getValues()[0];
  AUTH_CONFIG.HEADERS.forEach((header,i) => {
    if (existing[i] !== header) sheet.getRange(1,i+1).setValue(header);
  });
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,AUTH_CONFIG.HEADERS.length).setFontWeight('bold');
  return 'User registry is ready. Add authorised users manually and restrict spreadsheet sharing.';
}

/**
 * Verify Google Identity Services ID token on the server.
 * Token is never trusted merely because the browser supplied an email address.
 */
function verifyGoogleIdentity_(idToken) {
  if (!idToken || typeof idToken !== 'string' || idToken.length > 10000) {
    throw new Error('Please sign in with Google.');
  }
  const clientId = PropertiesService.getScriptProperties().getProperty('GOOGLE_OAUTH_CLIENT_ID');
  if (!clientId) throw new Error('Google sign-in is not configured by the administrator.');
  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), {
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) throw new Error('Google sign-in could not be verified. Please sign in again.');
  const claims = JSON.parse(response.getContentText());
  const now = Math.floor(Date.now()/1000);
  if (claims.aud !== clientId || claims.iss !== 'https://accounts.google.com' ||
      claims.email_verified !== 'true' || Number(claims.exp) <= now || !claims.sub || !claims.email) {
    throw new Error('Google identity verification failed.');
  }
  return { email: String(claims.email).trim().toLowerCase(), name: String(claims.name || '') };
}

/** Resolve active user and tool-level permission from the private registry. */
function requireToolAccess_(idToken, toolId) {
  const identity = verifyGoogleIdentity_(idToken);
  const id = PropertiesService.getScriptProperties().getProperty('USER_SHEET_ID');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(AUTH_CONFIG.USER_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) throw new Error('No authorised users are configured.');
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const col = Object.fromEntries(headers.map((h,i)=>[String(h),i]));
  const row = values.find(r => String(r[col.Email] || '').trim().toLowerCase() === identity.email);
  if (!row || String(row[col.Active]).toLowerCase() !== 'true') {
    throw new Error('Your account is not authorised for the Examination Tools portal.');
  }
  const allowed = String(row[col.AllowedTools] || '').split(',').map(x=>x.trim()).filter(Boolean);
  if (toolId && !allowed.includes('*') && !allowed.includes(toolId)) {
    throw new Error('You do not have permission to access this examination tool.');
  }
  return {
    email: identity.email,
    displayName: String(row[col.DisplayName] || identity.name),
    role: String(row[col.Role] || 'user'),
    allowedTools: allowed
  };
}

/** Called by the HTMLService client through google.script.run. */
function getMyAccess(idToken) {
  const user = requireToolAccess_(idToken, null);
  return { ok:true, user:user };
}

/**
 * Example protected server function. Every tool function must call
 * requireToolAccess_ before reading or changing tool data.
 */
function openQuestionPaperRegister(idToken) {
  const user = requireToolAccess_(idToken, 'question-paper-register');
  // Integration point: call the existing register's server-side functions here.
  // Do not simply return its deployment URL or rely on a hidden client-side link.
  return {
    ok:false,
    message:'The register backend integration is pending. Existing register operations have not been changed.',
    user:{email:user.email,displayName:user.displayName}
  };
}
