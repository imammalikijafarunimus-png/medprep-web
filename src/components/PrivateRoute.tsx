import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path ini benar jika file ada di src/components

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser } = useAuth();

  // Jika user belum login, lempar ke /login
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
}