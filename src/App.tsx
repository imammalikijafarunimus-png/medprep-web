import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { IslamicModeProvider } from './context/IslamicModeContext';

// Layout & Components
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute'; // Import dari komponen yang baru dibuat

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CBTCenter from './pages/CBTSelection';
import MateriViewer from './pages/MaterialViewer';
import MateriReader from './pages/MateriReader';
import OSCEStation from './pages/OSCEStation';
import FlashcardDrill from './pages/FlashcardDrill';
import UserProfile from './pages/Profile';
import AdminDashboard from './pages/AdminPanel';
import Subscription from './pages/Subscription';

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
                
                {/* Redirect /app ke /app/dashboard */}
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* CBT Routes */}
                <Route path="cbt" element={<CBTCenter />} />
                <Route path="cbt/read" element={<MateriViewer />} />
                <Route path="cbt/quiz" element={<MateriReader />} />
                
                {/* Skill & Drill Routes */}
                <Route path="osce" element={<OSCEStation />} />
                <Route path="flashcards" element={<FlashcardDrill />} />
                
                {/* User Routes */}
                <Route path="profile" element={<UserProfile />} />
                <Route path="admin" element={<AdminDashboard />} />
                
                {/* Subscription Routes */}
                <Route path="subscription" element={<Subscription />} />

              </Route>

              {/* 3. FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Notification */}
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