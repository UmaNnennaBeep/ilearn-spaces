/**
 * Google Apps Script (Web App)
 * Appends POSTed form data to a Google Sheet.
 * 
 * Usage:
 * - Create a Google Sheet and copy its ID into SPREADSHEET_ID
 * - Deploy the script as a Web App and set access to "Anyone, even anonymous" (or restrict as needed)
 * - Copy the Web App URL and paste into `script.js` as WEB_APP_URL
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- replace with your Sheet ID
const SHEET_NAME = 'Sheet1'; // name of sheet/tab to append to
const SECRET_TOKEN = ''; // OPTIONAL: set a string to require a token from the client (adds basic protection)

function doPost(e) {
  try {
    const params = e.parameter || {};
    const name = params.name || '';
    const email = params.email || '';
    const honeypot = params.hp || '';
    const page = params.page || '';
    const token = params.token || '';

    // Basic spam/honeypot check
    if (honeypot && honeypot.length > 0) {
      return ContentService.createTextOutput(JSON.stringify({status:'spam'})).setMimeType(ContentService.MimeType.JSON);
    }

    // Optional token check
    if (SECRET_TOKEN && token !== SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({status:'forbidden'})).setMimeType(ContentService.MimeType.JSON);
    }

    // Open sheet and append
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    sheet.appendRow([new Date(), name, email, page]);

    return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error', error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({status:'ok','message':'This endpoint accepts POST requests only.'})).setMimeType(ContentService.MimeType.JSON);
}