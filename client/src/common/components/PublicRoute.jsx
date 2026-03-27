import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  
  // If the user already has a token (is logged in), do NOT let them see Login/Register.
  // Instead, bounce them immediately into the protected app.
  if (token) {
    return <Navigate to="/kyc" replace />;
  }

  // If they don't have a token, they are allowed to see the public component.
  return children;
};

export default PublicRoute;
