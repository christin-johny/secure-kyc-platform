import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const PublicRoute = ({ children }) => {   
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/kyc" replace />;
  }

  return children;
};

export default PublicRoute;
