// Detailed debugging test for N8N email webhook
const EMAIL_SERVICE_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

async function debugWebhook() {
  console.log('🔍 Debugging N8N webhook with detailed logging...');
  
  // Test with exact field structure from the workflow
  const testData = {
    to: 'test@example.com',
    subject: 'Test Email from Voice Vanguard Vault',
    body: 'Test email body content'
  };

  console.log('📦 Sending payload:', JSON.stringify(testData, null, 2));
  console.log('📧 URL:', EMAIL_SERVICE_URL);

  try {
    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData),
    });

    console.log('\n📡 Response status:', response.status);
    console.log('📡 Response headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const responseText = await response.text();
    console.log('\n📡 Raw response text:');
    console.log(responseText);

    try {
      const result = JSON.parse(responseText);
      console.log('\n📡 Parsed response object:');
      console.log(JSON.stringify(result, null, 2));

      // Check if the error mentions specific field issues
      if (result.error) {
        console.log('\n🔍 Error analysis:');
        console.log('Error message:', result.error);
        if (result.errorCode) {
          console.log('Error code:', result.errorCode);
        }
      }
    } catch (parseError) {
      console.log('\n❌ Could not parse response as JSON:', parseError.message);
    }

    // Test if the webhook URL is even reachable with a simple GET request
    console.log('\n🔍 Testing webhook URL accessibility...');
    try {
      const getResponse = await fetch(EMAIL_SERVICE_URL, { method: 'GET' });
      console.log('GET response status:', getResponse.status);
      const getText = await getResponse.text();
      console.log('GET response body:', getText);
    } catch (getError) {
      console.log('GET request failed:', getError.message);
    }

  } catch (error) {
    console.error('\n❌ Network error:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
  }
}

debugWebhook();