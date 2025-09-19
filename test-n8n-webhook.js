// Test N8N Webhook Endpoint
// Run this in browser console to test the webhook directly

async function testN8NWebhook() {
  const testData = {
    resume_id: "a78b096f-d6a1-4718-9495-bdd8abfbd9f6",
    user_id: "mock-user-id",
    file_url: "https://sahcdkgvmvjzvvuzyilp.supabase.co/storage/v1/object/public/resumes/mock-user-id/1758208672844_Taha_Sadikot.pdf"
  };

  console.log('Testing N8N webhook with:', testData);

  try {
    const response = await fetch('https://n8n-k6lq.onrender.com/webhook/parse-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (responseText) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed JSON:', jsonResponse);
      } catch (e) {
        console.log('Response is not valid JSON');
      }
    } else {
      console.log('ISSUE: Empty response from N8N webhook');
    }
    
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testN8NWebhook();