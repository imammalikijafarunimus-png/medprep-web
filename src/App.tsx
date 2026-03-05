import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { IslamicModeProvider } from './context/IslamicModeContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Components
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CBTCenter from './pages/CBTCenter';
import MateriViewer from './pages/CBTReader';
import MateriReader from './pages/CBTQuiz';
import OSCEStation from './pages/OSCECenter';
import OSCIECenter from './pages/OSCIECenter';
import FlashcardDrill from './pages/FlashcardDrill';
import UserProfile from './pages/Profile';
import AdminDashboard from './pages/AdminPanel';
import Subscription from './pages/Subscription';
import TrendAnalysis from './pages/TrendAnalysis';
import UserManagement from './pages/UserManagement';

/**
 * Main Application Component
 * 
 * Routes are organized by access level:
 * 1. Public routes - No authentication required
 * 2. Protected routes - Authentication required (student+)
 * 3. Admin routes - Admin role required
 * 4. Superadmin routes - Superadmin role required
 */
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <IslamicModeProvider>
          <ErrorBoundary>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* ============================================
                      1. PUBLIC ROUTES
                      No authentication required
                      ============================================ */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* ============================================
                      2. PROTECTED APP ROUTES (student+)
                      Requires login, minimum role: student
                      ============================================ */}
                  <Route 
                    path="/app" 
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  >
                    {/* Default redirect to dashboard */}
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    
                    {/* General user routes */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="cbt" element={<CBTCenter />} />
                    <Route path="cbt/read" element={<MateriViewer />} />
                    <Route path="cbt/quiz" element={<MateriReader />} />
                    <Route path="osce" element={<OSCEStation />} />
                    <Route path="oscie" element={<OSCIECenter />} />
                    <Route path="flashcards" element={<FlashcardDrill />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="trends" element={<TrendAnalysis />} />
                    
                    {/* ============================================
                        3. ADMIN ROUTES (admin+)
                        Requires minimum role: admin
                        ============================================ */}
                    <Route 
                      path="admin" 
                      element={
                        <PrivateRoute requiredRole="admin">
                          <AdminDashboard />
                        </PrivateRoute>
                      } 
                    />
                    
                    {/* ============================================
                        4. SUPERADMIN ROUTES
                        Requires role: superadmin
                        ============================================ */}
                    <Route 
                      path="users" 
                      element={
                        <PrivateRoute requiredRole="superadmin">
                          <UserManagement />
                        </PrivateRoute>
                      } 
                    />
                  </Route>

                  {/* ============================================
                      FALLBACK
                      Redirect unknown routes to home
                      ============================================ */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* React Hot Toast - keep for backward compatibility */}
                <Toaster 
                  position="top-center" 
                  reverseOrder={false}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1e293b',
                      color: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    },
                    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                  }} 
                />
              </BrowserRouter>
            </ToastProvider>
          </ErrorBoundary>
        </IslamicModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;