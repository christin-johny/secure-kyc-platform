import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import KycCapture from './features/kyc/KycCapture';
import ProtectedRoute from './common/components/ProtectedRoute';

// An internal Nav component to access Context
const NavBar = () => {
  const { token, logout } = useAuth();
  
  return (
    <nav style={{ padding: '15px 30px', background: '#fff', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 'bold' }}>Company KYC Platform</h2>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {token ? (
          <>
            <Link to="/kyc" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 'bold' }}>KYC Tool</Link>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 'bold' }}>Login</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 'bold' }}>Register</Link>
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
        <div className="min-h-screen" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
          <NavBar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes Wrapper */}
            <Route path="/kyc" element={
              <ProtectedRoute>
                <KycCapture />
              </ProtectedRoute>
            } />
            
            {/* Catch all fallback */}
            <Route path="*" element={<Navigate to="/kyc" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
