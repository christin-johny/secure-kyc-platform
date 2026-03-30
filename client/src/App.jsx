import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import KycCapture from './features/kyc/KycCapture';
import Dashboard from './features/dashboard/Dashboard';
import ProtectedRoute from './common/components/ProtectedRoute';
import PublicRoute from './common/components/PublicRoute';
import { Toaster } from 'react-hot-toast';

const NavBar = () => {
  const { token, logout } = useAuth();
  
  return (
    <nav className="flex justify-between items-center px-6 md:px-8 py-4 md:py-5 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl mb-8 md:mb-12 shadow-xl">
      <Link to="/" className="text-xl md:text-2xl font-bold text-indigo-500 tracking-tight">KYC Platform</Link>
      <div className="flex gap-4 md:gap-6 items-center">
        {token ? (
          <>
            <Link to="/kyc" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Camera Tool</Link>
            <Link to="/dashboard" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Dashboard</Link>
            <button onClick={logout} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">Get Started</Link>
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
        <div className="max-w-6xl mx-auto px-4 py-8 animate-[slideUp_0.6s_ease-out_forwards]">
          <Toaster position="top-center" toastOptions={{ style: { background: 'rgba(31, 41, 55, 0.9)', color: '#f8fafc', border: '1px solid rgba(55, 65, 81, 0.6)' } }} />
          <NavBar />
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/kyc" element={<ProtectedRoute><KycCapture /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
