// Complete Registration & Email Debug Script
// Run this in browser console (F12) on http://localhost:8082

async function debugRegistrationAndEmail() {
  console.log('🔍 Starting comprehensive registration debug...');
  
  // Import Supabase client (this should work if the page is loaded)
  const SUPABASE_URL = 'https://sahcdkgvmvjzvvuzyilp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaGNka2d2bXZqenZ2dXp5aWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE0MDQsImV4cCI6MjA3MzAyNzQwNH0.qqnJLTmd5a0JKUhfW8fm5W9cuN_lK3czdvnszJxdrWA';
  
  const testEmail = `test+${Date.now()}@gmail.com`; // Use Gmail for better email delivery
  const testPassword = 'TestPassword123!';
  const testFullName = 'Test User Debug';
  
  console.log('📧 Testing with email:', testEmail);
  
  try {
    // Step 1: Check Auth Settings via API
    console.log('🔧 Checking Auth Settings...');
    
    const settingsResponse = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (settingsResponse.ok) {
      const settings = await settingsResponse.json();
      console.log('⚙️ Auth Settings:', settings);
      
      // Key settings to check
      console.log('📮 Email confirmation enabled:', settings.email_confirm);
      console.log('🔗 Site URL:', settings.site_url);
      console.log('📧 SMTP enabled:', settings.smtp_admin_email ? 'Yes' : 'No');
    } else {
      console.log('❌ Could not fetch auth settings');
    }
    
    // Step 2: Test registration
    console.log('👤 Testing registration...');
    
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
    console.log('📝 Signup Response Status:', signUpResponse.status);
    console.log('📝 Signup Response:', signUpData);
    
    if (signUpResponse.ok) {
      console.log('✅ Registration API call successful');
      
      if (signUpData.user) {
        console.log('👤 User created:', {
          id: signUpData.user.id,
          email: signUpData.user.email,
          email_confirmed_at: signUpData.user.email_confirmed_at,
          confirmation_sent_at: signUpData.user.confirmation_sent_at
        });
        
        if (signUpData.session) {
          console.log('🔐 Session created (email confirmation DISABLED)');
        } else {
          console.log('📧 Email confirmation required (session not created)');
        }
      }
      
      // Step 3: Check if profile was created
      setTimeout(async () => {
        console.log('🔍 Checking profile creation...');
        
        try {
          const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${signUpData.user?.id}`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          
          const profileData = await profileResponse.json();
          
          if (profileData && profileData.length > 0) {
            console.log('✅ Profile created successfully:', profileData[0]);
          } else {
            console.log('❌ Profile not found. Check triggers.');
          }
        } catch (error) {
          console.error('❌ Profile check failed:', error);
        }
      }, 2000);
      
    } else {
      console.log('❌ Registration failed:', signUpData);
    }
    
  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
}

// Instructions for user
console.log(`
🔧 REGISTRATION EMAIL DEBUG LOADED

1. Run debugRegistrationAndEmail() to test registration
2. Check the console output for auth settings
3. If email confirmation is enabled but no emails are sent:
   - Check Supabase Dashboard > Authentication > Settings
   - Verify SMTP configuration or use default Supabase emails
   - Check Site URL settings
   - Look at email templates

4. Common issues:
   - Email confirmation disabled (immediate login)
   - SMTP not configured (emails not sent)
   - Wrong Site URL (broken confirmation links)
   - Spam folder (check spam/junk)

Run: debugRegistrationAndEmail()
`);

window.debugRegistrationAndEmail = debugRegistrationAndEmail;