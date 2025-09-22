import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Missing verification token');
          return;
        }

        console.log('🔍 Verifying email with token:', token);

        // Call our custom verification function
        const { data, error } = await supabase.rpc('verify_email_token', { token });

        if (error) {
          console.error('❌ Verification error:', error);
          setStatus('error');
          setMessage('Failed to verify email');
          return;
        }

        if (data && data.length > 0) {
          const result = data[0];
          
          if (result.success) {
            console.log('✅ Email verified successfully');
            setStatus('success');
            setMessage(result.message);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            console.log('❌ Verification failed:', result.message);
            if (result.message.includes('expired')) {
              setStatus('expired');
            } else {
              setStatus('error');
            }
            setMessage(result.message);
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification response');
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during verification');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    try {
      console.log('📧 Resending verification email to:', email);
      
      const { data, error } = await supabase.rpc('resend_verification_token', { 
        user_email: email 
      });

      if (error) {
        console.error('❌ Resend error:', error);
        alert('Failed to resend verification email');
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        
        if (result.success) {
          // Send the new verification email
          const { sendVerificationEmail, generateVerificationUrl } = await import('@/services/emailService');
          
          const verificationUrl = generateVerificationUrl(result.token);
          
          const emailResult = await sendVerificationEmail({
            to: email,
            verificationUrl
          });

          if (emailResult.success) {
            alert('Verification email sent successfully!');
          } else {
            alert('Failed to send verification email');
          }
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error('❌ Resend error:', error);
      alert('An error occurred while resending verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              status === 'loading' ? 'bg-blue-600' :
              status === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {status === 'loading' && <Loader2 className="w-6 h-6 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
              {(status === 'error' || status === 'expired') && <XCircle className="w-6 h-6 text-white" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'expired' && 'Link Expired'}
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
                Redirecting you to login page...
              </p>
            </div>
          )}
          
          {(status === 'error' || status === 'expired') && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              
              {status === 'expired' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter your email to receive a new verification link:
                  </p>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <Button onClick={handleResendVerification} className="w-full">
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Create New Account
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;