const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.EMAIL_SERVICE_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your Email - Voice Vanguard Vault',
    html: `
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
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎤 Voice Vanguard Vault</h1>
          <p>Verify Your Email Address</p>
        </div>
        <div class="content">
          <h2>Hello ${name || 'there'}!</h2>
          <p>Thank you for registering with Voice Vanguard Vault. To complete your registration and start practicing your interview skills, please verify your email address.</p>
          
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
            ${verificationUrl}
          </p>
          
          <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't create an account with us, you can safely ignore this email.</p>
          
          <p>Best regards,<br>The Voice Vanguard Vault Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Voice Vanguard Vault. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${name || 'there'}!
      
      Thank you for registering with Voice Vanguard Vault. To complete your registration, please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours for security reasons.
      
      If you didn't create an account with us, you can safely ignore this email.
      
      Best regards,
      The Voice Vanguard Vault Team
    `
  }),

  
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your Password - Voice Vanguard Vault',
    html: `
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
          .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset</h1>
          <p>Voice Vanguard Vault</p>
        </div>
        <div class="content">
          <h2>Hello ${name || 'there'}!</h2>
          <p>We received a request to reset your password for your Voice Vanguard Vault account.</p>
          
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <p><strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.</p>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br>The Voice Vanguard Vault Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Voice Vanguard Vault. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${name || 'there'}!
      
      We received a request to reset your password for your Voice Vanguard Vault account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This password reset link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Best regards,
      The Voice Vanguard Vault Team
    `
  })
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Email Service', timestamp: new Date().toISOString() });
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { type, to, name, verificationUrl, resetUrl } = req.body;

    if (!type || !to) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: type and to' 
      });
    }

    let emailContent;
    
    switch (type) {
      case 'verification':
        if (!verificationUrl) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing verificationUrl for verification email' 
          });
        }
        emailContent = emailTemplates.verification(name, verificationUrl);
        break;
        
      case 'password-reset':
        if (!resetUrl) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing resetUrl for password reset email' 
          });
        }
        emailContent = emailTemplates.passwordReset(name, resetUrl);
        break;
        
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email type. Supported types: verification, password-reset' 
        });
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.VITE_EMAIL_FROM_NAME} <${process.env.VITE_EMAIL_FROM_ADDRESS}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    console.log(`📧 Sending ${type} email to: ${to}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`📧 Email Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📮 Email endpoint: http://localhost:${PORT}/api/send-email`);
  
  // Verify SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('⚠️  SMTP credentials not configured. Please update .env file');
  } else {
    console.log('✅ SMTP configuration found');
  }
});