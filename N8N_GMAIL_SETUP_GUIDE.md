# N8N Gmail OAuth2 Setup Instructions

## Problem Fixed
The original N8N workflow was trying to use SMTP environment variables with the Gmail node, but Gmail node in N8N requires OAuth2 authentication through Google's API, not SMTP credentials.

## Key Changes Made

### 1. **Removed SMTP Environment Variables**
- Removed `SMTP_USER` and `SMTP_PASSWORD` from the workflow
- Gmail node doesn't use SMTP credentials directly

### 2. **Added Proper Gmail OAuth2 Configuration**
```json
"credentials": {
  "gmailOAuth2": {
    "id": "gmail-oauth-credentials",
    "name": "Gmail OAuth2 API"
  }
}
```

### 3. **Enhanced Error Handling**
- Added Gmail-specific error handling node
- Added error connection from Gmail node to error handler
- Better error messages and details

### 4. **Improved Configuration**
- Set `isBodyHtml: true` for HTML email support
- Added CORS headers for web application compatibility
- Added timestamp to success response

## Setup Instructions

### Step 1: Create Google Cloud Project & Enable Gmail API

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create New Project** or select existing one
3. **Enable Gmail API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

### Step 2: Create OAuth2 Credentials

1. **Go to "APIs & Services" → "Credentials"**
2. **Click "Create Credentials" → "OAuth 2.0 Client IDs"**
3. **Configure OAuth Consent Screen** (if not done):
   - User Type: External (for testing) or Internal (for organization)
   - Fill required fields (App name, User support email, etc.)
   - Add your domain to authorized domains
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`

4. **Create OAuth 2.0 Client ID**:
   - Application type: Web application
   - Name: "N8N Gmail Integration"
   - Authorized redirect URIs: Add your N8N instance callback URL
     ```
     https://your-n8n-instance.com/rest/oauth2-credential/callback
     ```

5. **Download JSON** or copy Client ID and Client Secret

### Step 3: Configure N8N Gmail OAuth2 Credentials

1. **In N8N, go to "Credentials"**
2. **Click "Add Credential"**
3. **Select "Gmail OAuth2 API"**
4. **Fill in the details**:
   - **Name**: `Gmail OAuth2 API` (must match the workflow)
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
   - **Scope**: `https://www.googleapis.com/auth/gmail.send`

5. **Click "Connect my account"**
6. **Authorize with Google** (will redirect to Google OAuth)
7. **Save the credential**

### Step 4: Import and Configure Workflow

1. **Import the fixed workflow** (`email-verification-workflow-fixed.json`)
2. **Verify Gmail node credentials**:
   - Click on "Send Gmail" node
   - Ensure it shows "Gmail OAuth2 API" credential is connected
   - If not, select the credential you created

3. **Test the webhook endpoint**:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "to": "test@example.com",
       "subject": "Test Email",
       "body": "<h1>Hello from N8N!</h1><p>This is a test email.</p>"
     }'
   ```

### Step 5: Update Your React App

Update your environment variables to point to the N8N webhook:

```env
# .env
VITE_N8N_EMAIL_WEBHOOK_URL=https://your-n8n-instance.com/webhook/send-email
```

## Troubleshooting

### Common Issues

1. **"Insufficient Permission" Error**
   - Ensure Gmail API is enabled in Google Cloud Console
   - Check OAuth2 scopes include `gmail.send`
   - Re-authorize the OAuth2 connection

2. **"Redirect URI Mismatch"**
   - Add your N8N callback URL to authorized redirect URIs in Google Cloud Console
   - Format: `https://your-n8n-instance.com/rest/oauth2-credential/callback`

3. **"Invalid Grant" Error**
   - OAuth2 token may have expired
   - Re-authorize the connection in N8N credentials

4. **"Daily Limit Exceeded"**
   - Gmail API has daily sending limits
   - For production, consider Google Workspace with higher limits

### Testing the Integration

1. **Test with Postman or curl**:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/send-email \
     -H "Content-Type: application/json" \
     -d '{
       "to": "your-email@gmail.com",
       "subject": "Verification Code: 123456",
       "body": "<h2>Your verification code is: <strong>123456</strong></h2><p>This code expires in 15 minutes.</p>"
     }'
   ```

2. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Email sent successfully via Gmail API",
     "messageId": "google-message-id",
     "recipient": "your-email@gmail.com",
     "sentAt": "2025-09-22T10:30:00.000Z"
   }
   ```

## Security Best Practices

1. **Use Environment Variables** for sensitive data in N8N
2. **Implement Rate Limiting** to prevent abuse
3. **Validate Input** thoroughly (already implemented in workflow)
4. **Monitor Usage** to stay within Gmail API limits
5. **Use HTTPS** for all webhook endpoints
6. **Regular Token Refresh** - N8N handles this automatically

## Production Considerations

1. **Gmail API Limits**:
   - Free: 1 billion quota units per day
   - Sending emails: ~100 quota units per email
   - For high volume, consider Google Workspace

2. **Error Handling**:
   - Implement retry logic for transient failures
   - Log errors for monitoring
   - Have fallback email service

3. **Monitoring**:
   - Set up alerts for failed email deliveries
   - Monitor OAuth2 token expiration
   - Track email delivery rates

Your N8N workflow is now properly configured to use Gmail OAuth2 API instead of SMTP credentials! 🚀