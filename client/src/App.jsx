import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import KycCapture from './features/kyc/KycCapture';
import Dashboard from './features/dashboard/Dashboard';
import ProtectedRoute from './common/components/ProtectedRoute';
import PublicRoute from './common/components/PublicRoute';

const NavBar = () => {
  const { token, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">KYC Platform</div>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/kyc" className="nav-link">Camera Tool</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={logout} className="nav-btn-logout">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <NavBar />
          <Routes>
            {/* Public Routes (Only accessible if logged OUT) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Protected Routes (Only accessible if logged IN) */}
            <Route path="/kyc" element={
              <ProtectedRoute>
                <KycCapture />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/kyc" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
