// Email Service Utilities
// This module handles sending emails through N8N generic email webhook

const EMAIL_SERVICE_URL = import.meta.env.VITE_EMAIL_SERVICE_URL || import.meta.env.VITE_N8N_EMAIL_WEBHOOK_URL || 'https://n8n-k6lq.onrender.com/webhook/send-email';

export interface EmailServiceResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  details?: string;
}

export interface VerificationEmailData {
  to: string;
  name?: string;
  verificationCode: string;
}

export interface PasswordResetEmailData {
  to: string;
  name?: string;
  resetCode: string;
}

// Create verification email HTML template
const createVerificationEmailHTML = (name: string, code: string): string => {
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
        .security-note { background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎤 Voice Vanguard Vault</h1>
        <p>Verify Your Email Address</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        <p>Welcome to Voice Vanguard Vault! To complete your registration, please verify your email address by entering the verification code below in the application.</p>
        
        <div class="code-box">
          <p><strong>Your Verification Code:</strong></p>
          <div class="verification-code">${code}</div>
        </div>
        
        <div class="security-note">
          <strong>🔒 Security Note:</strong> This code will expire in 15 minutes for your security. If you didn't request this verification, please ignore this email.
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div class="footer">
          <p>© 2024 Voice Vanguard Vault. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Create password reset email HTML template
const createPasswordResetEmailHTML = (name: string, code: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code-box { background: white; border: 2px dashed #f5576c; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .reset-code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 8px; font-family: monospace; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .security-note { background: #fef2f2; border-left: 4px solid #f87171; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Voice Vanguard Vault</h1>
        <p>Password Reset Request</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        <p>We received a request to reset your password. Use the reset code below to set a new password for your account.</p>
        
        <div class="code-box">
          <p><strong>Your Reset Code:</strong></p>
          <div class="reset-code">${code}</div>
        </div>
        
        <div class="security-note">
          <strong>⚠️ Important:</strong> This code will expire in 15 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </div>
        
        <p>For security reasons, never share this code with anyone. Our team will never ask for your reset code.</p>
        
        <div class="footer">
          <p>© 2024 Voice Vanguard Vault. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send verification email via N8N webhook
export const sendVerificationEmail = async (data: VerificationEmailData): Promise<EmailServiceResponse> => {
  try {
    console.log('📧 Sending verification email via N8N to:', data.to);
    console.log('🔑 Verification code:', data.verificationCode);
    console.log('🌐 N8N Webhook URL:', EMAIL_SERVICE_URL);
    
    const emailHTML = createVerificationEmailHTML(data.name || 'User', data.verificationCode);
    
    const payload = {
      to: data.to,
      subject: `Verify Your Email - Code: ${data.verificationCode}`,
      body: emailHTML
    };
    
    console.log('📦 Sending payload to N8N:', {
      to: payload.to,
      subject: payload.subject,
      bodyLength: payload.body.length
    });

    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 N8N Response status:', response.status);
    console.log('📡 N8N Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📡 N8N Raw response:', responseText);

    if (!response.ok) {
      console.error('❌ N8N webhook error - Status:', response.status);
      console.error('❌ N8N webhook error - Response:', responseText);
      return {
        success: false,
        error: `N8N webhook failed with status ${response.status}: ${responseText}`,
        details: `URL: ${EMAIL_SERVICE_URL}, Status: ${response.status}`
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse N8N response as JSON:', parseError);
      console.error('❌ Raw response was:', responseText);
      return {
        success: false,
        error: 'N8N returned invalid JSON response',
        details: responseText
      };
    }
    
    console.log('✅ N8N webhook parsed response:', result);
    
    if (result.success === false) {
      console.error('❌ N8N workflow failed:', result.error);
      
      // Handle specific validation error - this indicates the webhook is working but expects different field structure
      if (result.errorCode === 'VALIDATION_ERROR' && result.error?.includes('Missing required fields')) {
        console.log('🔧 N8N webhook validation error detected. This may indicate the workflow needs to be updated.');
        console.log('💡 Suggested actions:');
        console.log('   1. Check the N8N workflow configuration');
        console.log('   2. Verify the webhook validation logic');
        console.log('   3. Import the latest workflow from smtp-email-workflow-fixed.json');
        
        return {
          success: false,
          error: 'N8N webhook validation failed - workflow may need to be updated',
          details: `Original error: ${result.error}. Check N8N workflow configuration.`
        };
      }
      
      return {
        success: false,
        error: result.error || 'N8N workflow returned failure',
        details: JSON.stringify(result)
      };
    }

    console.log('✅ Verification email sent successfully via N8N');
    return {
      success: true,
      messageId: result.messageId,
      message: result.message || 'Verification email sent via N8N workflow'
    };
  } catch (error: any) {
    console.error('❌ Error calling N8N webhook:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return {
      success: false,
      error: error?.message || 'Network error calling N8N webhook',
      details: `URL: ${EMAIL_SERVICE_URL}, Error: ${error?.name || 'Unknown'}`
    };
  }
};

// Send password reset email via N8N webhook
export const sendPasswordResetEmail = async (data: PasswordResetEmailData): Promise<EmailServiceResponse> => {
  try {
    console.log('📧 Sending password reset email via N8N to:', data.to);
    console.log('🔑 Reset code:', data.resetCode);
    
    const emailHTML = createPasswordResetEmailHTML(data.name || 'User', data.resetCode);

    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.to,
        subject: `Password Reset - Code: ${data.resetCode}`,
        body: emailHTML
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ N8N webhook error:', errorText);
      return {
        success: false,
        error: `N8N webhook failed with status ${response.status}: ${errorText}`,
      };
    }

    const result = await response.json();
    console.log('✅ N8N webhook response:', result);
    
    if (result.success === false) {
      return {
        success: false,
        error: result.error || 'N8N workflow returned failure',
      };
    }

    console.log('✅ Password reset email sent successfully via N8N');
    return {
      success: true,
      messageId: result.messageId,
      message: result.message || 'Password reset email sent via N8N workflow'
    };
  } catch (error: any) {
    console.error('❌ Error calling N8N webhook:', error);
    return {
      success: false,
      error: error?.message || 'Network error calling N8N webhook',
    };
  }
};