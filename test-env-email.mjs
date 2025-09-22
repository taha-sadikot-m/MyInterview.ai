// Test the email service with the correct environment variable
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const EMAIL_SERVICE_URL = process.env.VITE_EMAIL_SERVICE_URL || process.env.VITE_N8N_EMAIL_WEBHOOK_URL || 'https://n8n-k6lq.onrender.com/webhook/send-email';

console.log('🧪 Testing email service with environment variables...');
console.log('📧 Resolved URL:', EMAIL_SERVICE_URL);
console.log('📧 VITE_EMAIL_SERVICE_URL:', process.env.VITE_EMAIL_SERVICE_URL);
console.log('📧 VITE_N8N_EMAIL_WEBHOOK_URL:', process.env.VITE_N8N_EMAIL_WEBHOOK_URL);

// Create verification email HTML template
const createVerificationEmailHTML = (name, code) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .verification-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎤 Voice Vanguard Vault</h1>
        <p>Verify Your Email Address</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        <p>Welcome to Voice Vanguard Vault! Please verify your email with this code:</p>
        
        <div class="code-box">
          <p><strong>Your Verification Code:</strong></p>
          <div class="verification-code">${code}</div>
        </div>
        
        <p>This code will expire in 15 minutes.</p>
      </div>
    </body>
    </html>
  `;
};

async function testEmailService() {
  try {
    console.log('\n📧 Testing email service...');
    
    const emailHTML = createVerificationEmailHTML('Test User', '123456');
    
    const payload = {
      to: 'test@example.com',
      subject: 'Verify Your Email - Code: 123456',
      body: emailHTML
    };
    
    console.log('📦 Payload:', {
      to: payload.to,
      subject: payload.subject,
      bodyLength: payload.body.length
    });

    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:8081'
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📡 Raw response:', responseText);

    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      return;
    }

    try {
      const result = JSON.parse(responseText);
      console.log('📡 Parsed response:', result);
      
      if (result.success === false) {
        console.error('❌ N8N workflow validation failed:', result.error);
        
        if (result.errorCode === 'VALIDATION_ERROR') {
          console.log('\n💡 The N8N workflow is rejecting our payload structure.');
          console.log('💡 This suggests the workflow needs to be updated or reconfigured.');
          console.log('💡 Check your N8N instance at https://n8n-k6lq.onrender.com');
        }
      } else {
        console.log('✅ Email service test successful!');
      }
    } catch (parseError) {
      console.log('📝 Response is not JSON, might be plain text success');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testEmailService();