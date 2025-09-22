import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VerificationCodeInput } from '@/components/VerificationCodeInput';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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
    if (!formData.fullName.trim()) {
      return 'Full name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!acceptTerms) {
      return 'You must accept the terms and conditions';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        // Show verification step
        setShowVerification(true);
        toast({
          title: "Account created successfully!",
          description: "Please check your email for verification instructions.",
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.fullName.trim() && 
                     formData.email.trim() && 
                     formData.password.length >= 6 && 
                     formData.password === formData.confirmPassword && 
                     acceptTerms;

  const handleVerificationSuccess = () => {
    setSuccess(true);
    toast({
      title: "Email verified successfully!",
      description: "Your account is now active. Welcome to Voice Vanguard Vault!",
    });
    setTimeout(() => {
      navigate('/interview');
    }, 2000);
  };

  const handleVerificationCancel = () => {
    setShowVerification(false);
  };

  // Show verification code input after successful registration
  if (showVerification) {
    return (
      <VerificationCodeInput
        email={formData.email}
        onSuccess={handleVerificationSuccess}
        onCancel={handleVerificationCancel}
      />
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 py-6 relative overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          
          <CardHeader className="space-y-4 p-6 relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-center bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
              Welcome Aboard!
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 leading-relaxed">
              Your account has been successfully created and verified
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4 p-6 relative z-10">
            <div className="p-4 bg-green-50/80 backdrop-blur-sm rounded-2xl border border-green-200">
              <p className="text-base text-green-800">
                You can now start practicing your interview skills and improve your performance.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 relative z-10">
            <Button 
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/interview')}
            >
              Start Interviewing
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-6 relative overflow-hidden">
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
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-center bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600 leading-relaxed">
            Join us to start practicing your interview skills
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
              <Label htmlFor="fullName" className="text-base font-semibold text-gray-800">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-gray-800">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold text-gray-800">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-800">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
            </div>

            <div className="flex items-center space-x-2 p-3 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={loading}
                className="border-2 border-blue-300"
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
                I accept the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </Label>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-base text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;