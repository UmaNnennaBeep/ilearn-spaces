Step-by-step: Deploy Google Apps Script and connect your site

1) Create the spreadsheet
- Go to Google Drive → New → Google Sheets
- Create a new sheet and name the tab (default `Sheet1`)
- Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/...`

2) Create the Apps Script project
- Open https://script.google.com and click **New project**
- Replace the default code with the contents of `append_to_sheet.gs`
- Update `SPREADSHEET_ID` (and optionally `SHEET_NAME`) with your spreadsheet's details
- Optionally set `SECRET_TOKEN` to a string (then add a hidden `token` input to your site forms with the same value)

3) Save and deploy as Web App
- Click **Deploy** → **New deployment**
- For **Select type**, choose **Web app**
- Fill **Description** (e.g., "Newsletter endpoint")
- Set **Execute as**: `Me`
- Set **Who has access**: `Anyone` or `Anyone, even anonymous` (note: `anyone, even anonymous` allows POSTs without Google sign-in)
- Click **Deploy** and authorize scopes if prompted
- Copy the **Web app URL** (it ends with `/exec`) — keep it safe

4) Wire your site
- In `script.js` replace the placeholder
  const WEB_APP_URL = 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL';
  with your Web app URL (the `/exec` one)

- If you set `SECRET_TOKEN` in the Apps Script, add this hidden input to the newsletter forms:
  <input type="hidden" name="token" value="YOUR_SECRET_TOKEN">

5) Test
- Open any site page and submit the footer form
- Check the spreadsheet to see the new row
- If nothing appears, open DevTools → Network and inspect the POST request and the response JSON from the Apps Script endpoint

Security notes
- Deploying with "Anyone, even anonymous" makes it public — to reduce spam:
  - Use the `SECRET_TOKEN` approach above.
  - Use reCAPTCHA v2/v3 on the form (more complex to integrate).
  - Use the honeypot field `hp` (already added) to filter simple bots.

Privacy / data handling
- Ensure you are transparent in your privacy policy about collecting emails.
- Use secure storage and give users a way to unsubscribe/remove their data.

If you want, I can: 
- Add the optional hidden `token` input to all footer forms and set up the Apps Script to check it
- Add basic server-side validation (this script already checks honeypot and token)
- Help you test the flow once you deploy and paste in the Web App URL
