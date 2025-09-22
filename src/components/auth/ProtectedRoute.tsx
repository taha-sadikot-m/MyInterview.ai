import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requires authentication, false = requires no authentication
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth) {
    // Route requires authentication
    if (!isAuthenticated) {
      // Store the attempted URL to redirect back after login
      return (
        <Navigate 
          to={redirectTo || '/login'} 
          state={{ from: location }} 
          replace 
        />
      );
    }
  } else {
    // Route should only be accessible when NOT authenticated (like login, register)
    if (isAuthenticated) {
      // If user is already authenticated, redirect to interview page
      const from = location.state?.from?.pathname || '/interview';
      return <Navigate to={from} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;