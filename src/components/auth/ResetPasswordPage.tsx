import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPasswordWithCode } = useAuth(); // Updated to use new method
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidFlow, setIsValidFlow] = useState(true);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Check if we have the required data from forgot password flow
  useEffect(() => {
    const state = location.state as { 
      email?: string; 
      verificationCode?: string; 
      fromForgotPassword?: boolean 
    } | null;
    
    if (!state?.fromForgotPassword || !state?.email || !state?.verificationCode) {
      setIsValidFlow(false);
      setError('Invalid password reset session. Please start the password reset process again.');
    } else {
      setEmail(state.email);
      setVerificationCode(state.verificationCode);
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Use the new resetPasswordWithCode method
      const result = await resetPasswordWithCode(email, verificationCode, formData.password);
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Password updated!",
          description: "Your password has been successfully updated. Redirecting to login...",
        });
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.password && 
                     formData.confirmPassword && 
                     formData.password.length >= 6 &&
                     formData.password === formData.confirmPassword;

  if (!isValidFlow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 px-4 py-8 relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-rose-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5"></div>
          
          <CardHeader className="space-y-6 p-8 relative z-10">
            <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center text-lg text-gray-600 leading-relaxed">
              Please start the password reset process again
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 p-8 relative z-10">
            <div className="p-4 bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200">
              <p className="text-base text-red-800">
                This page can only be accessed after completing the email verification step.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 p-8 relative z-10">
            <Link to="/forgot-password" className="w-full">
              <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                Start Password Reset
              </Button>
            </Link>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 py-8 relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          
          <CardHeader className="space-y-6 p-8 relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
              Password Updated!
            </CardTitle>
            <CardDescription className="text-center text-lg text-gray-600 leading-relaxed">
              Your password has been successfully updated. Redirecting to login...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 p-8 relative z-10">
            <div className="p-4 bg-green-50/80 backdrop-blur-sm rounded-2xl border border-green-200">
              <p className="text-base text-green-800">
                You will be automatically redirected to the login page in a moment.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 p-8 relative z-10">
            <Button 
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/login', { replace: true })}
            >
              Go to Login Now
            </Button>
          </CardFooter>
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
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-center bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600 leading-relaxed">
            Email verified! Enter your new password below to complete the reset process
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6 relative z-10">
            {error && (
              <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold text-gray-800">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 hover:bg-blue-50 rounded-xl"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <p className="text-sm text-red-600 bg-red-50/80 backdrop-blur-sm rounded-xl p-2">Password must be at least 6 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-800">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 hover:bg-blue-50 rounded-xl"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 bg-red-50/80 backdrop-blur-sm rounded-xl p-2">Passwords do not match</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 p-6 relative z-10">
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>

            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;