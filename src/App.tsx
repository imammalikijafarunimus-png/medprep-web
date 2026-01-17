import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IslamicModeProvider } from './context/IslamicModeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';

// --- PAGES IMPORT ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Fitur Skill & Drill
import OSCEStation from './pages/OSCEStation';
import FlashcardDrill from './pages/FlashcardDrill';

// Fitur CBT Center (New Structure)
import CBTSelection from './pages/CBTSelection';   // Menu Pilih Sistem
import MaterialViewer from './pages/MaterialViewer'; // Baca Materi
import MateriReader from './pages/MateriReader';     // Latihan Soal (Quiz)

function App() {
  return (
    // 1. Provider Mode Islam (Global Context)
    <IslamicModeProvider>
      
      {/* 2. Provider Auth (Pembungkus Login/Register) */}
      <AuthProvider>
        
        <Router>
          <Routes>
            {/* =========================================
                1. PUBLIC ROUTES (Halaman Depan)
               ========================================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* =========================================
                2. APP ROUTES (Halaman Dalam / Protected)
               ========================================= */}
            <Route path="/app" element={<Layout />}>
              
              {/* Dashboard Utama */}
              <Route index element={<Dashboard />} />
              
              {/* --- CBT CENTER ROUTES (NEW) --- */}
              {/* 1. Menu Utama CBT (Pilih Sistem) */}
              <Route path="cbt" element={<CBTSelection />} />
              {/* 2. Mode Baca Materi (High Yield) */}
              <Route path="cbt/read" element={<MaterialViewer />} />
              {/* 3. Mode Latihan Soal (Quiz) */}
              <Route path="cbt/quiz" element={<MateriReader />} />
              
              {/* --- SKILL & DRILL ROUTES --- */}
              <Route path="osce" element={<OSCEStation />} />
              <Route path="flashcards" element={<FlashcardDrill />} />
              
              {/* --- USER ROUTES --- */}
              <Route path="profile" element={<Profile />} />

              {/* --- ADMIN ROUTE --- */}
              <Route path="admin" element={<AdminPanel />} />
              
            </Route>

            {/* =========================================
                3. FALLBACK (Jika Link Salah -> Ke Home)
               ========================================= */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>

      </AuthProvider>
    </IslamicModeProvider>
  );
}

export default App;