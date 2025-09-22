// Debug what N8N is actually receiving
const EMAIL_SERVICE_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

async function debugN8NPayload() {
  console.log('🔍 Debugging N8N payload reception...');
  
  // Test with minimal payload first
  const minimalPayload = {
    to: 'test@example.com',
    subject: 'Test',
    body: 'Test'
  };
  
  console.log('\n1️⃣ Testing minimal payload...');
  console.log('📦 Payload:', JSON.stringify(minimalPayload, null, 2));
  
  try {
    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalPayload),
    });

    const responseText = await response.text();
    console.log('📡 Status:', response.status);
    console.log('📡 Response:', responseText);
    
    // Test with different content types
    console.log('\n2️⃣ Testing with form data...');
    const formData = new URLSearchParams();
    formData.append('to', 'test@example.com');
    formData.append('subject', 'Test');
    formData.append('body', 'Test');
    
    const formResponse = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const formResponseText = await formResponse.text();
    console.log('📡 Form Status:', formResponse.status);
    console.log('📡 Form Response:', formResponseText);
    
    // Test with stringified nested object
    console.log('\n3️⃣ Testing with nested data...');
    const nestedPayload = {
      data: {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test'
      }
    };
    
    const nestedResponse = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nestedPayload),
    });

    const nestedResponseText = await nestedResponse.text();
    console.log('📡 Nested Status:', nestedResponse.status);
    console.log('📡 Nested Response:', nestedResponseText);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugN8NPayload();