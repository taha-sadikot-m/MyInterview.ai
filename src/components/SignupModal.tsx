import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { VerificationCodeInput } from "@/components/VerificationCodeInput";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SignupStep = 'registration' | 'verification' | 'success';

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [step, setStep] = useState<SignupStep>('registration');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      console.log('🔄 Registration result:', result);
      
      if (result.success) {
        setSuccessMessage((result as any).message || 'Registration successful! Please check your email for verification code.');
        setStep('verification');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleVerificationSuccess = () => {
    setStep('success');
    setTimeout(() => {
      onClose();
      resetForm();
    }, 2000);
  };

  const handleVerificationCancel = () => {
    setStep('registration');
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setStep('registration');
    setError("");
    setSuccessMessage("");
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      {step === 'registration' && (
        <Card className="relative w-full max-w-md mx-4 card-shadow">
          <CardHeader className="text-center relative">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <CardTitle className="text-2xl font-bold gradient-text">
              Join Voice Vanguard Vault
            </CardTitle>
            <CardDescription>
              Create your account to start your speaking journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded">
                  {successMessage}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account 🚀'}
              </Button>
            </form>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={handleClose}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in instead
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'verification' && (
        <VerificationCodeInput
          email={formData.email}
          onSuccess={handleVerificationSuccess}
          onCancel={handleVerificationCancel}
        />
      )}

      {step === 'success' && (
        <Card className="relative w-full max-w-md mx-4 card-shadow">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Welcome to Voice Vanguard Vault!
            </h2>
            <p className="text-gray-600">
              Your account has been verified successfully. You can now start your speaking journey!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignupModal;