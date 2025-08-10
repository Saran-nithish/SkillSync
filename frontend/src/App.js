import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import { useAuthModal } from './hooks/useAuthModal';

// Pages
import Dashboard from './pages/Dashboard';
import Knowledge from './pages/Knowledge';
import Queries from './pages/Queries';
import Community from './pages/Community';
import AskAI from './pages/AskAI';
import Settings from './pages/Settings';

import './App.css';

// Layout component that includes header and navigation
const AppLayout = ({ children, authModal }) => {
  return (
    <div className="App">
      <Navigation authModal={authModal} />
      <Header authModal={authModal} />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      <AuthModal 
        isOpen={authModal.isAuthModalOpen} 
        initialMode={authModal.authModalMode}
        onClose={authModal.closeAuthModal}
      />
    </div>
  );
};

// Main App Component
function App() {
  const authModal = useAuthModal();
  
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes - Available to all users */}
              <Route path="/knowledge" element={
                <AppLayout authModal={authModal}>
                  <Knowledge authModal={authModal} />
                </AppLayout>
              } />
              <Route path="/queries" element={
                <AppLayout authModal={authModal}>
                  <Queries authModal={authModal} />
                </AppLayout>
              } />
              <Route path="/community" element={
                <AppLayout authModal={authModal}>
                  <Community authModal={authModal} />
                </AppLayout>
              } />
              
              {/* Protected Routes - Require authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout authModal={authModal}>
                    <Dashboard authModal={authModal} />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/ask-ai" element={
                <ProtectedRoute>
                  <AppLayout authModal={authModal}>
                    <AskAI />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout authModal={authModal}>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/knowledge" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App; 