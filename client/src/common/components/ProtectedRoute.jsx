import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

// This is a "Wrapper" Component. It intercepts users.
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    // If the Context does not hold a token, instantly redirect them to login page.
    return <Navigate to="/login" replace />;
  }

  // If token exists, let them see the KYC Component
  return children;
};

export default ProtectedRoute;
