# N8N Email Verification Workflow Setup

## Overview
This N8N workflow replaces the local email service for sending verification emails. It uses Gmail integration and provides a webhook endpoint for the application to call.

## Setup Instructions

### 1. Import Workflow to N8N
1. Open your N8N instance
2. Go to **Workflows** → **Import from file**
3. Upload `email-verification-workflow.json`
4. The workflow will be imported with all nodes configured

### 2. Configure Gmail Credentials
1. In N8N, go to **Credentials**
2. Create new **Gmail OAuth2** credential
3. Follow Google OAuth setup:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add your N8N redirect URI
4. Name the credential `gmail-oauth-credentials`
5. Test the connection

### 3. Configure Webhook Settings
1. Open the imported workflow
2. Click on the **Webhook** node
3. Set the path to: `send-verification-email`
4. Set HTTP method to: `POST`
5. Note the webhook URL (will be something like: `https://your-n8n-instance.com/webhook/send-verification-email`)

### 4. Activate Workflow
1. Click **Save** to save the workflow
2. Click **Activate** to enable the webhook
3. Test the webhook endpoint

## Workflow Structure

### Nodes:
1. **Webhook** - Receives POST requests with email data
2. **Check Email Type** - Validates request type is 'verification'
3. **Prepare Email Data** - Formats email content and HTML template
4. **Send Gmail** - Sends email via Gmail API
5. **Success Response** - Returns success response
6. **Error Response** - Returns error for invalid requests
7. **Respond to Webhook** - Sends response back to caller

### Expected Request Format:
```json
{
  "type": "verification",
  "to": "user@example.com",
  "name": "User Name",
  "verificationUrl": "https://yourapp.com/auth/verify-email?token=xxx"
}
```

### Response Format:
```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "messageId": "gmail-message-id"
}
```

## Environment Variables to Update

After setting up the workflow, update your `.env` file:

```env
# Replace the email service URL with your N8N webhook URL
VITE_EMAIL_SERVICE_URL=https://your-n8n-instance.com/webhook/send-verification-email

# Remove these local email service variables (no longer needed)
# EMAIL_SERVICE_PORT=3001
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=taha.sadikot.m@gmail.com
# SMTP_PASSWORD=kabo elyo gzpg vbix
# SMTP_SECURE=false
```

## Testing the Workflow

You can test the workflow using curl:

```bash
curl -X POST https://your-n8n-instance.com/webhook/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "verification",
    "to": "test@example.com",
    "name": "Test User",
    "verificationUrl": "https://yourapp.com/auth/verify-email?token=test123"
  }'
```

## Troubleshooting

### Common Issues:
1. **Gmail Authentication Failed**
   - Check OAuth credentials are correct
   - Ensure Gmail API is enabled in Google Cloud Console
   - Verify redirect URI matches N8N settings

2. **Webhook Not Accessible**
   - Check N8N instance is publicly accessible
   - Verify workflow is activated
   - Check firewall/network settings

3. **Email Not Sending**
   - Check Gmail account has sufficient permissions
   - Verify email templates are rendering correctly
   - Check N8N execution logs for errors

## Security Notes

- Keep your N8N instance secure with proper authentication
- Use environment variables for sensitive data
- Regularly rotate OAuth credentials
- Monitor webhook usage for abuse

## Benefits Over Local Email Service

1. **Reliability** - N8N handles retries and error handling
2. **Scalability** - No local server dependencies
3. **Monitoring** - Built-in execution logs and monitoring
4. **Flexibility** - Easy to modify workflow without code changes
5. **Integration** - Can easily add other email providers or logic