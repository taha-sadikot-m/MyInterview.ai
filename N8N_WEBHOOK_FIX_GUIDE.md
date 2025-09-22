# N8N Email Webhook Fix Guide

## Issue Summary
Your N8N webhook at `https://n8n-k6lq.onrender.com/webhook/send-email` is responding but the validation is failing. The webhook returns:
```json
{"success":false,"error":"Missing required fields: to, subject, and body are required","errorCode":"VALIDATION_ERROR"}
```

## Root Cause
The validation logic in your N8N workflow is not properly detecting the `to`, `subject`, and `body` fields in the incoming JSON payload.

## Solution Options

### Option 1: Fix Existing Workflow (Recommended)
1. Go to your N8N instance: https://n8n-k6lq.onrender.com
2. Find the webhook workflow with path `send-email`
3. Check the "Validate Input" node (the IF condition node)
4. Update the validation conditions to:
   - Left Value: `{{ $json.to }}` (not `={{ $json.to }}`)
   - Operator: "is not empty"
   - Repeat for `subject` and `body`

### Option 2: Create New Simplified Workflow
1. Import the `simple-email-workflow.json` file (created in this directory)
2. This workflow has no validation and should work immediately
3. Configure your SMTP credentials in the "Send Email" node

### Option 3: Debug the Current Workflow
1. In your N8N workflow, add a "Set" node after the webhook
2. Set it to log the incoming data: `{{ JSON.stringify($json) }}`
3. This will show you exactly what data the webhook receives

## Testing
Once you've implemented one of the solutions, test with:
```bash
node test-env-email.mjs
```

## Expected Working Payload
Your webhook should accept this exact format:
```json
{
  "to": "user@example.com",
  "subject": "Verify Your Email - Code: 123456",
  "body": "<html>...email content...</html>"
}
```

## Verification
After fixing, you should see:
- CORS headers properly set
- JSON response with `{"success": true, "messageId": "..."}`
- Email successfully sent via SMTP