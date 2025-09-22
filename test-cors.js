// Test CORS configuration for N8N webhook
const EMAIL_SERVICE_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

async function testCORS() {
  console.log('🔧 Testing CORS configuration...');
  console.log('📧 URL:', EMAIL_SERVICE_URL);
  
  try {
    // First, test OPTIONS request (preflight)
    console.log('\n1️⃣ Testing OPTIONS preflight request...');
    const optionsResponse = await fetch(EMAIL_SERVICE_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('📡 OPTIONS Status:', optionsResponse.status);
    console.log('📡 OPTIONS Headers:');
    optionsResponse.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Check for CORS headers
    const allowOrigin = optionsResponse.headers.get('access-control-allow-origin');
    const allowMethods = optionsResponse.headers.get('access-control-allow-methods');
    const allowHeaders = optionsResponse.headers.get('access-control-allow-headers');
    
    console.log('\n🔍 CORS Analysis:');
    console.log('  Allow-Origin:', allowOrigin || 'MISSING');
    console.log('  Allow-Methods:', allowMethods || 'MISSING');
    console.log('  Allow-Headers:', allowHeaders || 'MISSING');
    
    if (!allowOrigin || (allowOrigin !== '*' && allowOrigin !== 'http://localhost:8081')) {
      console.log('❌ CORS Issue: Missing or incorrect Access-Control-Allow-Origin');
    }
    
    // Now test actual POST request
    console.log('\n2️⃣ Testing POST request...');
    const postResponse = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8081'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'CORS Test',
        body: 'Testing CORS configuration'
      })
    });
    
    console.log('📡 POST Status:', postResponse.status);
    console.log('📡 POST Headers:');
    postResponse.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    const responseText = await postResponse.text();
    console.log('📡 POST Response:', responseText);
    
    console.log('\n✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ CORS Test Failed:', error);
    console.error('❌ Error Type:', error.name);
    console.error('❌ Error Message:', error.message);
    
    if (error.message.includes('CORS')) {
      console.log('\n💡 CORS Resolution Steps:');
      console.log('1. In your N8N workflow, add a "Set" node before the webhook response');
      console.log('2. Set the following headers:');
      console.log('   - Access-Control-Allow-Origin: *');
      console.log('   - Access-Control-Allow-Methods: POST, OPTIONS');
      console.log('   - Access-Control-Allow-Headers: Content-Type, Authorization');
      console.log('3. Or update the webhook node to include CORS configuration');
    }
  }
}

testCORS();