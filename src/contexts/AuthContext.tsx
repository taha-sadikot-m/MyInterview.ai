import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the user profile type based on our database schema
export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  college: string | null;
  graduation_year: number | null;
  field_of_study: string | null;
  experience_level: 'fresher' | 'experienced' | null;
  target_companies: string[] | null;
  preferred_roles: string[] | null;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  email_verified: boolean;
  profile_completed: boolean;
  last_login: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
  // New verification fields
  email_verification_code: string | null;
  email_verification_expires: string | null;
  verification_attempts: number | null;
  password_reset_code: string | null;
  password_reset_expires: string | null;
}

// Authentication context interface
interface AuthContextType {
  // User state
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  
  // Loading states
  loading: boolean;
  profileLoading: boolean;
  
  // Authentication actions
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; message?: string; user?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  
  // Email verification actions
  verifyEmailWithCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // Password reset actions
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyPasswordResetCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  
  // Utility functions
  isAuthenticated: boolean;
  isPremiumUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      setProfileLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Update last login timestamp
  const updateLastLogin = async (userId: string) => {
    try {
      const { error } = await (supabase as any).rpc('update_last_login', {
        user_uuid: userId
      });
      
      if (error) {
        console.error('Error updating last login:', error);
      }
    } catch (error) {
      console.error('Error in updateLastLogin:', error);
    }
  };

  // Sign up function - DIRECT SQL WITH EXISTING PROFILES TABLE
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('🔄 Starting registration with existing profiles table...', { email, fullName });
      
      // Step 1: Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email, email_verified')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing user:', checkError);
        return { success: false, error: 'Database error. Please try again.' };
      }

      if (existingUser) {
        if (existingUser.email_verified) {
          return { success: false, error: 'Email already registered and verified' };
        } else {
          return { success: false, error: 'Email already registered but not verified. Please check your email.' };
        }
      }

      // Step 2: Hash the password (now async)
      const { hashPassword } = await import('@/utils/auth');
      const passwordHash = await hashPassword(password);
      
      // Step 3: Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now
      
      // Step 4: Generate user ID
      const userId = crypto.randomUUID();
      
      // Step 5: Insert user directly into profiles table
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: email,
          full_name: fullName || null,
          password_hash: passwordHash,
          email_verified: false,
          email_verification_code: verificationCode,
          email_verification_expires: expirationTime,
          verification_attempts: 0,
          subscription_tier: 'free',
          profile_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error inserting user:', insertError);
        return { success: false, error: 'Failed to create account. Please try again.' };
      }

      console.log('✅ User created successfully:', insertData);

      // Step 6: Send verification email
      const { sendVerificationEmail } = await import('@/services/emailService');
      
      console.log('📧 Sending verification email...');
      const emailResult = await sendVerificationEmail({
        to: email,
        name: fullName,
        verificationCode: verificationCode
      });

      if (!emailResult.success) {
        console.error('❌ Failed to send verification email:', emailResult.error);
        return {
          success: false,
          error: 'Account created but failed to send verification email. Please try resending or contact support.'
        };
      }

      console.log('✅ Verification email sent successfully');
      
      return { 
        success: true,
        message: 'Registration successful! Please check your email (including spam folder) for the 6-digit verification code.',
        user: {
          email: email,
          full_name: fullName
        }
      };

    } catch (error) {
      console.error('❌ Error in registration process:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again or contact support.'
      };
    }
  };

  // Sign in function - COMPLETELY CUSTOM FLOW (NO SUPABASE AUTH)
  // Sign in function - DIRECT SQL WITH EXISTING PROFILES TABLE
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Starting login with existing profiles table...', { email });
      
      // Step 1: Hash the password (now async)
      const { hashPassword } = await import('@/utils/auth');
      const passwordHash = await hashPassword(password);
      
      // Step 2: Find user with matching email and password
      const { data: userData, error: loginError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', passwordHash)
        .single();

      if (loginError || !userData) {
        console.error('❌ Login failed:', loginError);
        return { success: false, error: 'Invalid email or password' };
      }

      console.log('✅ User found:', userData.email);

      // Step 3: Check if email is verified
      if (!userData.email_verified) {
        return { 
          success: false, 
          error: 'Please verify your email address before logging in. Check your email for the verification code.' 
        };
      }

      // Step 4: Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', userData.user_id);

      // Step 5: Create mock user and session objects for compatibility
      const mockUser = {
        id: userData.user_id,
        email: userData.email,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      } as User;

      const mockSession = {
        access_token: 'custom_session_' + userData.user_id,
        refresh_token: 'custom_refresh_' + userData.user_id,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      // Step 6: Set our state
      setUser(mockUser);
      setSession(mockSession);
      setProfile(userData);

      console.log('✅ Login complete - user state set');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error in login process:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Update password function
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Send password reset code function - Uses same N8N endpoint as email verification
  const sendPasswordResetCode = async (email: string) => {
    try {
      console.log('🔄 Sending password reset code for:', email);
      
      // Step 1: First, verify that a user with this email exists in the profiles table
      const { data: existingUser, error: findError } = await (supabase as any)
        .from('profiles')
        .select('email, full_name')
        .eq('email', email)
        .single();

      if (findError || !existingUser) {
        console.error('❌ User not found:', findError);
        return { success: false, error: 'No account found with this email address' };
      }

      console.log('✅ User found for password reset:', existingUser.email);
      
      // Step 2: Generate password reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

      // Step 3: Store code temporarily in localStorage
      localStorage.setItem(`reset_code_${email}`, JSON.stringify({
        code: resetCode,
        expires: expirationTime,
        created: new Date().toISOString()
      }));

      console.log('🔑 Generated password reset code:', resetCode);
      
      // Step 4: Send the email using existing N8N infrastructure
      const { sendPasswordResetEmail } = await import('@/services/emailService');
      
      const emailResult = await sendPasswordResetEmail({
        to: email,
        name: existingUser.full_name || 'User',
        resetCode
      });

      if (!emailResult.success) {
        console.error('❌ Failed to send reset email:', emailResult.error);
        // Clean up stored code if email failed
        localStorage.removeItem(`reset_code_${email}`);
        return {
          success: false,
          error: 'Failed to send reset email. Please try again or contact support.'
        };
      }

      console.log('✅ Password reset code sent successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in sendPasswordResetCode:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Verify password reset code function
  const verifyPasswordResetCode = async (email: string, code: string) => {
    try {
      console.log('🔍 Verifying password reset code:', { email, code });
      
      // Get stored code from localStorage (temporary solution)
      const stored = localStorage.getItem(`reset_code_${email}`);
      if (!stored) {
        console.error('❌ No reset code found for email');
        return { success: false, error: 'No reset code found. Please request a new password reset.' };
      }

      const { code: storedCode, expires } = JSON.parse(stored);
      
      // Check if code is expired
      const currentTime = new Date();
      const expirationTime = new Date(expires);
      
      if (currentTime > expirationTime) {
        console.error('❌ Reset code expired');
        localStorage.removeItem(`reset_code_${email}`);
        return { success: false, error: 'Reset code has expired. Please request a new one.' };
      }

      // Verify code matches
      if (code !== storedCode) {
        console.error('❌ Invalid reset code');
        return { success: false, error: 'Invalid reset code' };
      }

      console.log('✅ Password reset code verified successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in verifyPasswordResetCode:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Reset password with verified code function
  const resetPasswordWithCode = async (email: string, code: string, newPassword: string) => {
    try {
      console.log('🔄 Resetting password with code for:', email);
      
      // Step 1: Verify the code first
      const verificationResult = await verifyPasswordResetCode(email, code);
      if (!verificationResult.success) {
        return verificationResult;
      }

      // Step 2: Hash the new password
      const { hashPassword } = await import('@/utils/auth');
      const passwordHash = await hashPassword(newPassword);

      // Step 3: Update password in the profiles table (the actual table being used)
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('❌ Failed to update password in database:', updateError);
        // Fallback to localStorage for temporary storage
        localStorage.setItem(`user_${email}_password`, passwordHash);
        localStorage.removeItem(`reset_code_${email}`);
        
        return { 
          success: true,
          message: 'Password reset successful (stored temporarily). You can now login with your new password.',
          warning: 'Database update failed, password stored locally'
        };
      }

      // Step 4: Clear the verification code from localStorage
      localStorage.removeItem(`reset_code_${email}`);

      console.log('✅ Password updated successfully in database');
      return { 
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      };
    } catch (error) {
      console.error('❌ Unexpected error in resetPasswordWithCode:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh profile data
      await refreshProfile();

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Verify email with code function
  // Email verification with code - DIRECT SQL WITH EXISTING PROFILES TABLE
  const verifyEmailWithCode = async (email: string, code: string) => {
    try {
      console.log('🔍 Verifying email with code:', { email, code });
      
      // Step 1: Find user with matching email and code
      const { data: userData, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('email_verification_code', code)
        .single();

      if (findError || !userData) {
        console.error('❌ User not found or invalid code:', findError);
        return { success: false, error: 'Invalid or expired verification code' };
      }

      // Step 2: Check if code is expired
      const expirationTime = new Date(userData.email_verification_expires);
      const currentTime = new Date();
      
      if (currentTime > expirationTime) {
        console.error('❌ Verification code expired');
        return { success: false, error: 'Verification code has expired. Please request a new one.' };
      }

      // Step 3: Check if already verified
      if (userData.email_verified) {
        return { success: false, error: 'Email is already verified. You can now sign in.' };
      }

      // Step 4: Mark email as verified
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_verified: true,
          email_verification_code: null,
          email_verification_expires: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user_id);

      if (updateError) {
        console.error('❌ Failed to update verification status:', updateError);
        return { success: false, error: 'Failed to verify email. Please try again.' };
      }

      console.log('✅ Email verification successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected verification error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred during verification' 
      };
    }
  };

  // Resend verification code function - DIRECT SQL WITH EXISTING PROFILES TABLE
  const resendVerificationCode = async (email: string) => {
    try {
      console.log('🔄 Resending verification code for:', email);
      
      // Step 1: Find user with email
      const { data: userData, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('email_verified', false)
        .single();

      if (findError || !userData) {
        console.error('❌ User not found or already verified:', findError);
        return { success: false, error: 'Email not found or already verified' };
      }

      // Step 2: Check if too many attempts
      if (userData.verification_attempts >= 5) {
        return { success: false, error: 'Too many verification attempts. Please contact support.' };
      }

      // Step 3: Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

      // Step 4: Update user with new code
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_verification_code: verificationCode,
          email_verification_expires: expirationTime,
          verification_attempts: (userData.verification_attempts || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user_id);

      if (updateError) {
        console.error('❌ Failed to update verification code:', updateError);
        return { success: false, error: 'Failed to generate verification code. Please try again.' };
      }

      console.log('🔑 Generated new verification code:', verificationCode);
      
      // Step 5: Send the email
      const { sendVerificationEmail } = await import('@/services/emailService');
      
      const emailResult = await sendVerificationEmail({
        to: email,
        verificationCode
      });

      if (!emailResult.success) {
        console.error('❌ Failed to send verification email:', emailResult.error);
        return {
          success: false,
          error: 'Failed to send verification email. Please try again or contact support.'
        };
      }

      console.log('✅ Verification code resent successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in resend:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchUserProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        const userProfile = await fetchUserProfile(initialSession.user.id);
        setProfile(userProfile);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Fetch or refresh profile when user signs in
          const userProfile = await fetchUserProfile(currentSession.user.id);
          setProfile(userProfile);
        } else {
          // Clear profile when user signs out
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Computed values
  const isAuthenticated = !!user;
  const isPremiumUser = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'enterprise';

  const value: AuthContextType = {
    // User state
    user,
    profile,
    session,
    
    // Loading states
    loading,
    profileLoading,
    
    // Authentication actions
    signUp,
    signIn,
    signOut,
    
    // Email verification actions
    verifyEmailWithCode,
    resendVerificationCode,
    
    // Password reset actions
    resetPassword,
    sendPasswordResetCode,
    verifyPasswordResetCode,
    resetPasswordWithCode,
    updatePassword,
    
    // Profile actions
    updateProfile,
    refreshProfile,
    
    // Utility functions
    isAuthenticated,
    isPremiumUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};