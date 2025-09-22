// Test nodemailer import and function
const nodemailer = require('nodemailer');

console.log('Testing nodemailer...');
console.log('nodemailer object:', typeof nodemailer);
console.log('createTransport function:', typeof nodemailer.createTransport);

// Test creating transporter
try {
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@gmail.com',
      pass: 'testpass'
    }
  });
  
  console.log('✅ Transporter created successfully');
  console.log('Transporter type:', typeof testTransporter);
} catch (error) {
  console.error('❌ Error creating transporter:', error);
}