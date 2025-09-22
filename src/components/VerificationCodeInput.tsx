import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Shield, RotateCcw } from 'lucide-react';

interface VerificationCodeInputProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  email,
  onSuccess,
  onCancel
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { verifyEmailWithCode, resendVerificationCode } = useAuth();

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          const newCode = digits.split('');
          setCode(newCode);
          // Focus last input
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyEmailWithCode(email, verificationCode);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Verification failed');
        // Clear the code on error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await resendVerificationCode(email);
      
      if (result.success) {
        // Clear current code
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        // You might want to show a success message here
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      <div className="max-w-md mx-auto w-full relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
            Verify Your Email
          </h2>
          <div className="space-y-2">
            <p className="text-lg text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200">
              <Mail className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-blue-800">{email}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-black border-2 border-gray-300 focus:border-blue-500 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-blue-200"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl mb-6">
              <p className="text-red-800 text-center font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleVerify}
              disabled={isLoading || code.join('').length !== 6}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-lg font-bold disabled:opacity-50 hover:underline transition-colors"
              >
                <RotateCcw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Resending...' : "Didn't receive the code? Resend"}
              </button>
            </div>

            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-1 relative z-10">
          <p>The verification code expires in 15 minutes.</p>
          <p>Please check your spam folder if you don't see the email.</p>
        </div>
      </div>
    </div>
  );
};