import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage: React.FC = () => {
  const { sendPasswordResetCode } = useAuth(); // Updated to use new method
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      // Use the new sendPasswordResetCode method
      const result = await sendPasswordResetCode(email);
      
      if (result.success) {
        setStep('verification');
        toast({
          title: "Verification code sent!",
          description: "Please check your email for the verification code.",
        });
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Only allow single digit
    const digit = value.slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    
    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // If current input is empty and backspace is pressed, go to previous input
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement verifyPasswordResetCode method in AuthContext
      // For now, simulate success and navigate to reset password
      navigate('/reset-password', { 
        state: { 
          email, 
          verificationCode,
          fromForgotPassword: true 
        } 
      });
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use the new sendPasswordResetCode method for resending
      const result = await sendPasswordResetCode(email);
      
      if (result.success) {
        toast({
          title: "Code resent!",
          description: "A new verification code has been sent to your email.",
        });
        setCode(['', '', '', '', '', '']);
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 px-4 py-8 relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
          
          <CardHeader className="space-y-4 p-6 relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-center bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 leading-relaxed">
              We sent a verification code to{' '}
              <div className="mt-2 p-3 bg-purple-50/80 backdrop-blur-sm rounded-2xl border border-purple-200">
                <strong className="text-purple-800">{email}</strong>
              </div>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleCodeSubmit}>
            <CardContent className="space-y-6 p-6 relative z-10">
              {error && (
                <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800 text-center block">
                  6-Digit Verification Code
                </Label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 p-6 relative z-10">
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                disabled={code.join('').length !== 6 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-base font-semibold text-purple-600 hover:text-purple-800 hover:bg-purple-50/80 rounded-2xl transition-all duration-300"
                onClick={resendCode}
                disabled={loading}
              >
                Resend Code
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setStep('email')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Email
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        <CardHeader className="space-y-4 p-6 relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-center bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600 leading-relaxed">
            Enter your email address and we'll send you a verification code to reset your password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleEmailSubmit}>
          <CardContent className="space-y-4 p-6 relative z-10">
            {error && (
              <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-gray-800">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="pl-10 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 p-6 relative z-10">
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              disabled={!email.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending verification code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>

            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;