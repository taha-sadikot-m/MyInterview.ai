import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the access_token and refresh_token from URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');

        console.log('🔗 Auth callback params:', { type, error, accessToken: !!accessToken });

        if (error) {
          setStatus('error');
          setMessage(`Authentication error: ${error}`);
          return;
        }

        if (type === 'signup' || type === 'email_confirm') {
          // Handle email confirmation
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            setStatus('error');
            setMessage('Failed to verify email confirmation');
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email confirmed successfully! You are now logged in.');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            // Try to set the session using the tokens from URL
            if (accessToken && refreshToken) {
              const { error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (setSessionError) {
                console.error('Set session error:', setSessionError);
                setStatus('error');
                setMessage('Failed to establish session');
                return;
              }

              setStatus('success');
              setMessage('Email confirmed successfully! You are now logged in.');
              
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Missing authentication tokens');
            }
          }
        } else {
          setStatus('error');
          setMessage('Invalid callback type');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during email verification');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              status === 'loading' ? 'bg-blue-600' :
              status === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {status === 'loading' && <Loader2 className="w-6 h-6 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
              {status === 'error' && <XCircle className="w-6 h-6 text-white" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600">
                Redirecting you to the dashboard...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;