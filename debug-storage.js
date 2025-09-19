// Test Supabase Storage Configuration
// Copy and paste this entire code into your browser console (F12) while on your app page

async function testSupabaseStorage() {
  console.log('=== SUPABASE STORAGE DIAGNOSTIC ===');
  
  // Test 1: Check if supabase is available
  if (typeof supabase === 'undefined') {
    console.error('supabase is not available in global scope');
    return;
  }
  
  // Test 2: Check if supabase client is working
  try {
    const { data: testAuth, error: authError } = await supabase.auth.getSession();
    console.log('Auth test:', authError ? authError : 'OK');
  } catch (e) {
    console.error('Auth test failed:', e);
  }
  
  // Test 3: Try to list buckets with more details
  try {
    console.log('Testing bucket listing...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    console.log('List buckets result:', { data: buckets, error: listError });
    
    if (buckets && buckets.length > 0) {
      console.log('Found buckets:');
      buckets.forEach(bucket => {
        console.log(`- ${bucket.name} (public: ${bucket.public}, id: ${bucket.id})`);
      });
    }
  } catch (e) {
    console.error('List buckets failed:', e);
  }
  
  // Test 4: Try different bucket names
  console.log('Testing different bucket name variations...');
  const testBuckets = ['resumes', 'Resumes', 'RESUMES', 'resume', 'Resume'];
  
  for (const bucketName of testBuckets) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
      console.log(`Bucket "${bucketName}":`, error ? `ERROR - ${error.message}` : 'EXISTS');
    } catch (e) {
      console.log(`Bucket "${bucketName}": ERROR -`, e.message);
    }
  }
  
  // Test 5: Try to create bucket programmatically
  console.log('Attempting to create "resumes" bucket...');
  try {
    const { data, error } = await supabase.storage.createBucket('resumes', {
      public: true,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 10485760
    });
    console.log('Create bucket result:', { data, error });
  } catch (e) {
    console.error('Create bucket failed:', e);
  }
  
  // Test 6: Test a simple upload
  console.log('Testing file upload with a small test file...');
  try {
    // Create a small test file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(`test-${Date.now()}.txt`, testFile);
      
    console.log('Test upload result:', { data: uploadData, error: uploadError });
    
    // Clean up test file if upload succeeded
    if (uploadData) {
      await supabase.storage.from('resumes').remove([uploadData.path]);
      console.log('Test file cleaned up');
    }
  } catch (e) {
    console.error('Test upload failed:', e);
  }
  
  console.log('=== END DIAGNOSTIC ===');
  console.log('If bucket "resumes" shows ERROR, you need to create it manually in Supabase dashboard');
  console.log('Dashboard URL: https://app.supabase.com/project/sahcdkgvmvjzvvuzyilp/storage/buckets');
}

// Run the test
testSupabaseStorage();