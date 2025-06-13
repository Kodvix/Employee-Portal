import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 


const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px'
  }}>
    Loading...
  </div>
);


export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};


export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin()) {
    
    return <Navigate to="/employee-dashboard" replace />;
  }
  
  return children;
};


export const EmployeeProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmployee, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!isEmployee()) {
    
    return <Navigate to="/Admin-dashboard" replace />;
  }
  
  return children;
};


export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (isAuthenticated) {

    return <Navigate to={isAdmin() ? "/Admin-dashboard" : "/employee-dashboard"} replace />;
  }
  
  return children;
};