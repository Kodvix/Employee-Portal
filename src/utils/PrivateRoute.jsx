import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Check if user is authenticated and has required role
  const hasAccess = isAuthenticated && 
    (!requiredRole || userRole?.toUpperCase() === requiredRole.toUpperCase());

  // If not authenticated or doesn't have required role, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If role doesn't match, redirect to appropriate dashboard
  if (requiredRole && userRole?.toUpperCase() !== requiredRole.toUpperCase()) {
    const redirectPath = userRole?.toUpperCase() === 'ADMIN' ? '/Admin-dashboard' : '/employee-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;