// Debug Registration Test
// This file can be run in browser console to test registration

async function testRegistration() {
  console.log('🧪 Testing Registration Flow...');
  
  // Test Supabase connection
  const SUPABASE_URL = 'https://sahcdkgvmvjzvvuzyilp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaGNka2d2bXZqenZ2dXp5aWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE0MDQsImV4cCI6MjA3MzAyNzQwNH0.qqnJLTmd5a0JKUhfW8fm5W9cuN_lK3czdvnszJxdrWA';
  
  console.log('📡 Supabase URL:', SUPABASE_URL);
  console.log('🔑 Anon Key:', SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  
  // Test if we can connect to Supabase
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    console.log('🌐 Supabase connection status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Successfully connected to Supabase');
    } else {
      console.log('❌ Failed to connect to Supabase');
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
  
  // Test sign up with a test email
  const testEmail = `test+${Date.now()}@example.com`;
  const testPassword = 'test123456';
  const testFullName = 'Test User';
  
  console.log('👤 Testing signup with:', testEmail);
  
  try {
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: {
          full_name: testFullName
        }
      })
    });
    
    const signUpData = await signUpResponse.json();
    console.log('📝 Signup response status:', signUpResponse.status);
    console.log('📝 Signup response data:', signUpData);
    
    if (signUpResponse.status === 200) {
      console.log('✅ Signup API call successful');
      
      if (signUpData.user) {
        console.log('👤 User created with ID:', signUpData.user.id);
        console.log('📧 Email confirmation required:', !signUpData.session);
      }
    } else {
      console.log('❌ Signup failed:', signUpData.error || signUpData.msg);
    }
    
    // Check if profile was created
    setTimeout(async () => {
      console.log('🔍 Checking if profile was created...');
      
      try {
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${signUpData.user?.id}`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        
        const profileData = await profileResponse.json();
        console.log('👤 Profile check response:', profileData);
        
        if (profileData.length > 0) {
          console.log('✅ Profile created successfully');
        } else {
          console.log('❌ Profile not found - trigger may not be working');
        }
      } catch (error) {
        console.error('❌ Profile check error:', error);
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Signup error:', error);
  }
}

// Check browser console for this log
console.log('🔧 Registration debug script loaded. Run testRegistration() to test.');