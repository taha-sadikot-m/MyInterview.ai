// Test script to verify N8N email webhook integration
// Run this with: node test-email.js

const EMAIL_SERVICE_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

// Try different field name variations to see what the webhook expects
const testEmailDataVariations = [
  {
    name: 'Version 1 - Standard fields',
    data: {
      to: 'test@example.com',
      subject: 'Test Email from Voice Vanguard Vault',
      body: 'Test email body content'
    }
  },
  {
    name: 'Version 2 - HTML field',
    data: {
      to: 'test@example.com',
      subject: 'Test Email from Voice Vanguard Vault',
      html: 'Test email body content'
    }
  },
  {
    name: 'Version 3 - Text field',
    data: {
      to: 'test@example.com',
      subject: 'Test Email from Voice Vanguard Vault',
      text: 'Test email body content'
    }
  },
  {
    name: 'Version 4 - Message field',
    data: {
      to: 'test@example.com',
      subject: 'Test Email from Voice Vanguard Vault',
      message: 'Test email body content'
    }
  },
  {
    name: 'Version 5 - Content field',
    data: {
      to: 'test@example.com',
      subject: 'Test Email from Voice Vanguard Vault',
      content: 'Test email body content'
    }
  }
];

async function testEmailWebhook() {
  console.log('🧪 Testing N8N email webhook with different field variations...');
  console.log('📧 URL:', EMAIL_SERVICE_URL);

  for (const variation of testEmailDataVariations) {
    console.log(`\n🔄 Testing ${variation.name}:`);
    console.log('📦 Payload:', variation.data);

    try {
      const response = await fetch(EMAIL_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(variation.data),
      });

      console.log('📡 Response status:', response.status);
      const responseText = await response.text();
      console.log('📡 Raw response:', responseText);

      if (response.ok) {
        console.log('✅ This field combination works!');
        try {
          const result = JSON.parse(responseText);
          console.log('✅ Parsed response:', result);
          if (result.success !== false) {
            return { success: true, workingFormat: variation.data };
          }
        } catch (parseError) {
          console.log('📝 Plain text response - probably successful');
          return { success: true, workingFormat: variation.data };
        }
      } else {
        try {
          const result = JSON.parse(responseText);
          console.log('❌ Error response:', result);
        } catch (parseError) {
          console.log('❌ Error response (plain text):', responseText);
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error.message);
    }
  }

  return { success: false };
}

// Run the test
testEmailWebhook().then(result => {
  if (result.success) {
    console.log('\n🎉 Email webhook integration test PASSED');
    console.log('✅ Working format:', result.workingFormat);
  } else {
    console.log('\n💥 Email webhook integration test FAILED');
    console.log('❌ None of the field combinations worked');
  }
});