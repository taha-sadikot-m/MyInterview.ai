// Quick Supabase Email Configuration Test
// Run this in browser console at http://localhost:8082

async function checkSupabaseEmailConfig() {
  console.log('🔍 Checking Supabase Email Configuration...');
  
  const SUPABASE_URL = 'https://sahcdkgvmvjzvvuzyilp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaGNka2d2bXZqenZ2dXp5aWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTE0MDQsImV4cCI6MjA3MzAyNzQwNH0.qqnJLTmd5a0JKUhfW8fm5W9cuN_lK3czdvnszJxdrWA';
  
  try {
    // Check auth settings
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      const settings = await response.json();
      console.log('⚙️ Auth Settings:', settings);
      
      console.log('\n📧 EMAIL CONFIGURATION:');
      console.log('Email confirmation enabled:', settings.email_confirm);
      console.log('Site URL:', settings.site_url);
      console.log('SMTP configured:', settings.smtp_admin_email ? 'Yes' : 'Using Supabase default');
      console.log('Auto confirmation disabled:', settings.disable_signup);
      
      // Check specific email settings
      if (settings.email_confirm) {
        console.log('✅ Email confirmation is enabled');
        if (!settings.smtp_admin_email) {
          console.log('📮 Using Supabase default email service');
          console.log('💡 TIP: Check your Supabase project email limits and delivery');
        } else {
          console.log('📧 Custom SMTP configured:', settings.smtp_admin_email);
        }
      } else {
        console.log('❌ Email confirmation is DISABLED');
        console.log('💡 TIP: Enable email confirmation in Auth settings');
      }
      
      // Site URL check
      const currentOrigin = window.location.origin;
      if (settings.site_url === currentOrigin) {
        console.log('✅ Site URL matches current origin');
      } else {
        console.log('⚠️ Site URL mismatch:');
        console.log('  Expected:', currentOrigin);
        console.log('  Configured:', settings.site_url);
      }
      
    } else {
      console.log('❌ Could not fetch auth settings');
    }
  } catch (error) {
    console.error('❌ Error checking configuration:', error);
  }
}

// Auto-run the check
console.log('🔧 Supabase Email Config Checker loaded. Running automatically...');
checkSupabaseEmailConfig();