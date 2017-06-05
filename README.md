Telstra Dev: SMS
---
Send SMS via the Telstra API

This is an as-is `HTML/JS/PHP 5.6+` appplication that could easily be re-configured to use any server-side language in place of `PHP` (e.g. `Node`, `Python`). It is yet to be styled.

It currently requires a Google account for authentication and to access a user's Google Drive. It allows for a bulk SMS to be sent via the dev.telstra.com API to contacts from any Google Spreadsheet (with appropriate headings i.e. **\*name\***, **phone|mobile**).

#### To get running:

**1. Create an account and request an SMS API key from dev.telstra.com**

**2\. In `api/auth/` rename `credentials-default.json` to `credentials.json` and update e.g.**
```json
{
	"users": [
		"{{user1@email}}",
		"{{user2@email}}"
	],
	"telstra": {
		"key": "{{YOUR API KEY}}",
		"secret": "{{YOUR API SECRET}}"
	}
}
```
*Note: `*.json` has been secured via `.htaccess` for Apache, other servers should implement equivalent rules*

**3\. Create a new project via the [Google Console](https://console.developers.google.com)**
- enable both the Google Sheets and Drive API. 
- create new credentials and include your origin and redirect URLs (i.e. your local/server app directory)
- make a note of the `Client ID` (this can be used publicly)

**4\. In `_src/js/module/user.js` update the `clientID` property with your own Google client ID, e.g:**
```js
props: {
    clientID: "{{YOUR GOOGLE CLIENT ID}}",
```
**5. Open the app in your browser**



#### To edit using the npm build-system provided you can follow the steps below:

**1\. Install global scripts:**
```sh
npm install -g autoprefixer
npm install -g browser-sync
npm install -g cssmin
npm install -g node-notifier
npm install -g node-sass
npm install -g postcss-cli
npm install -g watch
```

**2\. Update `package.json -> config -> url -> {username}` to your local workspace**

**3\. Run locally (it will ask for your username from above):**
```
npm run dev
```