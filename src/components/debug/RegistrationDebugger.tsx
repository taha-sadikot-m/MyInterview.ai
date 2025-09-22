import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegistrationDebugger: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('test123456');
  const [fullName, setFullName] = useState('Test User');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const log = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { timestamp, message, data }]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  const testSupabaseConnection = async () => {
    log('🧪 Testing Supabase connection...');
    
    try {
      // Test general connection with a simple query
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        log('❌ Supabase auth connection failed', error);
      } else {
        log('✅ Supabase auth connection successful');
      }
      
      // Test profiles table existence with raw query
      const { data: profilesData, error: profilesError } = await supabase
        .rpc('get_user_profile', {});
      
      if (profilesError) {
        log('❌ Profiles table/function not accessible', profilesError);
      } else {
        log('✅ Profiles table accessible via function');
      }
    } catch (error) {
      log('❌ Supabase connection error', error);
    }
  };

  const testRegistration = async () => {
    if (!email) {
      log('❌ Please enter an email address');
      return;
    }

    setLoading(true);
    setResults([]);
    
    try {
      // Step 1: Test Supabase connection
      await testSupabaseConnection();

      // Step 2: Test registration
      log('👤 Attempting user registration...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (signUpError) {
        log('❌ Registration failed', signUpError);
        return;
      }

      log('✅ Registration API call successful', {
        user_id: signUpData.user?.id,
        email: signUpData.user?.email,
        has_session: !!signUpData.session
      });

      // Step 3: Check if profile was created
      if (signUpData.user?.id) {
        log('🔍 Checking profile creation...');
        
        // Wait a moment for the trigger to execute
        setTimeout(async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', signUpData.user.id);

            if (profileError) {
              log('❌ Profile check failed', profileError);
            } else if (profileData && profileData.length > 0) {
              log('✅ Profile created successfully', profileData[0]);
            } else {
              log('❌ Profile not found - trigger may not be working');
            }
          } catch (error) {
            log('❌ Profile check error', error);
          }
        }, 2000);
      }

      // Step 4: Check auth session
      const { data: session } = await supabase.auth.getSession();
      log('🔐 Current session status', { 
        has_session: !!session.session,
        user_id: session.session?.user?.id 
      });

    } catch (error) {
      log('❌ Unexpected error during registration', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProfilesTable = async () => {
    log('🔍 Checking profiles table...');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (error) {
        log('❌ Failed to query profiles table', error);
      } else {
        log('✅ Profiles table accessible', { count: data.length, data });
      }
    } catch (error) {
      log('❌ Error accessing profiles table', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Registration Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testRegistration} disabled={loading}>
              {loading ? 'Testing...' : 'Test Registration'}
            </Button>
            <Button variant="outline" onClick={checkProfilesTable}>
              Check Profiles Table
            </Button>
            <Button variant="outline" onClick={testSupabaseConnection}>
              Test Connection
            </Button>
            <Button variant="outline" onClick={() => setResults([])}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Debug Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No results yet. Run a test above.</p>
            ) : (
              results.map((result, index) => (
                <Alert key={index}>
                  <AlertDescription>
                    <div className="font-mono text-xs">
                      <div className="font-bold">[{result.timestamp}] {result.message}</div>
                      {result.data && (
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationDebugger;