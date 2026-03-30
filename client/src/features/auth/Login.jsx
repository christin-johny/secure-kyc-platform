import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setEmailError('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid structured email address.');
    } else {
      setEmailError('');
    }
  }, [email]);

  const isFormValid = email && password && !emailError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/kyc');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-10 w-full max-w-md mx-auto shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Welcome Back</h2>
      <p className="text-slate-400 mb-8 leading-relaxed">Sign in to the KYC Platform to continue.</p>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium mb-2 text-slate-400">Email Address</label>
          <input 
            type="email" 
            required 
            className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white focus:outline-none transition-all ${emailError ? 'border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/20' : (email ? 'border-emerald-500 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20')}`}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="john@doe.com"
          />
          {emailError && <p className="text-red-500 text-xs mt-2 font-medium">{emailError}</p>}
        </div>
        
        <div className="mb-8 text-left">
          <label className="block text-sm font-medium mb-2 text-slate-400">Password</label>
          <input 
            type="password" 
            required 
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          className={`inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${(!isLoading && isFormValid) ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5' : 'bg-indigo-600/50 text-white/50 cursor-not-allowed'}`}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Authenticating...' : 'Secure Login'}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-slate-400">
        Don't have an account? <Link to="/register" className="text-indigo-500 font-semibold no-underline hover:text-indigo-400 transition-colors">Create one here</Link>
      </p>
    </div>
  );
};

export default Login;
