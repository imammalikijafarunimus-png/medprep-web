import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { IslamicModeProvider } from './context/IslamicModeContext';

// Layout & Components
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';

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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <IslamicModeProvider>
          <Router>
            <Routes>
              {/* 1. PUBLIC ROUTES */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 2. PROTECTED APP ROUTES */}
              <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
                
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route path="cbt" element={<CBTCenter />} />
                <Route path="cbt/read" element={<MateriViewer />} />
                <Route path="cbt/quiz" element={<MateriReader />} />
                
                <Route path="osce" element={<OSCEStation />} />
                <Route path="oscie" element={<OSCIECenter />} />
                <Route path="flashcards" element={<FlashcardDrill />} />
                
                <Route path="profile" element={<UserProfile />} />
                <Route path="admin" element={<AdminDashboard />} />
                
                <Route path="subscription" element={<Subscription />} />
                <Route path="trends" element={<TrendAnalysis />} />

              </Route>

              {/* 3. FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

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
          </Router>
        </IslamicModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;