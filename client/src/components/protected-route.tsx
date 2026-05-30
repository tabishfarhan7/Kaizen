import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to if we wanted to redirect them back later.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes inside an Outlet
  return <Outlet />;
};
