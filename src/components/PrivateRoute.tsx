/**
 * Private Route Component with Role-Based Access Control
 * @module components/PrivateRoute
 * 
 * Enhanced version that supports:
 * - Authentication check (must be logged in)
 * - Role-based access control via Custom Claims
 * - Loading state with spinner
 * - Redirect to appropriate pages
 * 
 * CHANGES FROM PREVIOUS VERSION:
 * ❌ REMOVED: Simple pass/fail check
 * ✅ ADDED: requiredRole prop for role-based access
 * ✅ ADDED: Loading state with spinner
 * ✅ ADDED: Redirect to dashboard if role insufficient
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, hasMinimumRole } from '../types/auth';

// ============================================
// TYPES
// ============================================

interface PrivateRouteProps {
  /** Children to render if authorized (alternative to Outlet) */
  children?: React.ReactNode;
  /** Minimum role required to access this route (default: 'student') */
  requiredRole?: UserRole;
  /** Custom redirect path if not authenticated (default: '/login') */
  redirectTo?: string;
  /** Custom redirect path if role insufficient (default: '/app/dashboard') */
  insufficientRoleRedirect?: string;
}

// ============================================
// LOADING COMPONENT
// ============================================

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      <p className="text-slate-400 text-sm">Memuat...</p>
    </div>
  </div>
);

// ============================================
// PRIVATE ROUTE COMPONENT
// ============================================

/**
 * Private Route wrapper with role-based access control
 * 
 * @example
 * // Basic usage - requires login only
 * <Route element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 * 
 * @example
 * // Role-based route - requires admin role
 * <Route element={<PrivateRoute requiredRole="admin"><AdminPanel /></PrivateRoute>} />
 * 
 * @example
 * // Using with Outlet (for nested routes)
 * <Route element={<PrivateRoute requiredRole="superadmin" />}>
 *   <Route path="users" element={<UserManagement />} />
 * </Route>
 */
export default function PrivateRoute({ 
  children, 
  requiredRole = 'student',
  redirectTo = '/login',
  insufficientRoleRedirect = '/app/dashboard'
}: PrivateRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not logged in → redirect to login
  if (!currentUser) {
    // Save the attempted URL for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Logged in but insufficient role → redirect to dashboard
  if (!hasMinimumRole(currentUser.role, requiredRole)) {
    console.warn(
      `[PrivateRoute] Access denied for ${currentUser.email}. ` +
      `Required: ${requiredRole}, Have: ${currentUser.role}`
    );
    return <Navigate to={insufficientRoleRedirect} replace />;
  }

  // Authorized - render children or Outlet
  return children ? <>{children}</> : <Outlet />;
}

// ============================================
// ROLE-SPECIFIC ROUTE COMPONENTS
// ============================================

/**
 * Admin Route - Only accessible by admin and superadmin
 */
export function AdminRoute({ 
  children,
  redirectTo = '/login'
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <PrivateRoute requiredRole="admin" redirectTo={redirectTo}>
      {children}
    </PrivateRoute>
  );
}

/**
 * Superadmin Route - Only accessible by superadmin
 */
export function SuperAdminRoute({ 
  children,
  redirectTo = '/login'
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) {
  return (
    <PrivateRoute requiredRole="superadmin" redirectTo={redirectTo}>
      {children}
    </PrivateRoute>
  );
}