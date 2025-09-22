// Test different payload structures for N8N
const EMAIL_SERVICE_URL = 'https://n8n-k6lq.onrender.com/webhook/send-email';

const testVariations = [
  {
    name: 'Flat structure',
    data: {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'Test content'
    }
  },
  {
    name: 'Nested structure',
    data: {
      email: {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'Test content'
      }
    }
  },
  {
    name: 'SMTP structure',
    data: {
      recipient: 'test@example.com',
      subject: 'Test Email',
      message: 'Test content'
    }
  },
  {
    name: 'Direct SMTP params',
    data: {
      from: 'noreply@voicevanguardvault.com',
      to: 'test@example.com',
      subject: 'Test Email',
      html: 'Test content'
    }
  },
  {
    name: 'Webhook data wrapper',
    data: {
      webhookData: {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'Test content'
      }
    }
  }
];

async function testAllVariations() {
  console.log('🧪 Testing multiple payload variations...');
  
  for (const variation of testVariations) {
    console.log(`\n🔄 Testing ${variation.name}:`);
    console.log('📦 Payload:', JSON.stringify(variation.data, null, 2));
    
    try {
      const response = await fetch(EMAIL_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(variation.data),
      });

      console.log('📡 Status:', response.status);
      const responseText = await response.text();
      
      try {
        const result = JSON.parse(responseText);
        console.log('📡 Response:', result);
        
        if (result.success !== false) {
          console.log('✅ SUCCESS! This format works!');
          return variation;
        }
      } catch (e) {
        console.log('📡 Raw response:', responseText);
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  return null;
}

testAllVariations().then(result => {
  if (result) {
    console.log('\n🎉 Found working format:', result.name);
    console.log('📋 Working payload structure:', JSON.stringify(result.data, null, 2));
  } else {
    console.log('\n❌ No working format found');
  }
});