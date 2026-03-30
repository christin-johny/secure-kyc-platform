import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      setNameError('');
      return;
    }
    const nameRegex = /^[A-Za-z][A-Za-z\s]{2,}$/;
    if (!nameRegex.test(name)) {
      setNameError('Enter the valid name');
    } else {
      setNameError('');
    }
  }, [name]);

  useEffect(() => {
    if (!email) {
      setEmailError('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  useEffect(() => {
    if (!confirmPassword) {
      setConfirmPasswordError('');
      return;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const isFormValid = name && email && password && confirmPassword && !nameError && !emailError && !confirmPasswordError && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please fix the validation errors before submitting.");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/kyc'); 
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-10 w-full max-w-md mx-auto shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Create Account</h2>
      <p className="text-slate-400 mb-8 leading-relaxed">Join the platform to submit your KYC details.</p>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium mb-2 text-slate-400">Full Name</label>
          <input 
            type="text" 
            required 
            className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white focus:outline-none transition-all ${nameError ? 'border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/20' : (name ? 'border-emerald-500 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20')}`}
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Doe"
          />
          {nameError && <p className="text-red-500 text-xs mt-2 font-medium">{nameError}</p>}
        </div>

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

        <div className="mb-6 text-left">
          <label className="block text-sm font-medium mb-2 text-slate-400">Secure Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white focus:outline-none transition-all pr-12 ${password && !isPasswordValid ? 'border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/20' : ''} ${isPasswordValid ? 'border-emerald-500 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'}`}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter a strong password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
          
          {password && !isPasswordValid && (
            <div className="bg-slate-900/60 p-4 rounded-xl mt-3 border border-slate-700">
              <p className="text-sm font-semibold text-slate-200 mb-2">Password Requirements:</p>
              <ul className="text-xs space-y-1.5">
                <li className={`flex items-center gap-2 transition-colors ${passwordCriteria.length ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
                  {passwordCriteria.length ? '✓' : '○'} At least 8 characters
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordCriteria.upper ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
                  {passwordCriteria.upper ? '✓' : '○'} One uppercase letter
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordCriteria.lower ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
                  {passwordCriteria.lower ? '✓' : '○'} One lowercase letter
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordCriteria.number ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
                  {passwordCriteria.number ? '✓' : '○'} One number
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordCriteria.special ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
                  {passwordCriteria.special ? '✓' : '○'} One special character (!@#$%)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-8 text-left">
          <label className="block text-sm font-medium mb-2 text-slate-400">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white focus:outline-none transition-all pr-12 ${confirmPasswordError ? 'border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/20' : (confirmPassword && !confirmPasswordError ? 'border-emerald-500 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-500/20' : 'border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20')}`}
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Type your password again"
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
          {confirmPasswordError && <p className="text-red-500 text-xs mt-2 font-medium">{confirmPasswordError}</p>}
        </div>
        
        <button 
          type="submit" 
          className={`inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${(!isLoading && isFormValid) ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5' : 'bg-indigo-600/50 text-white/50 cursor-not-allowed'}`}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Identity...
            </>
          ) : 'Register Securely'}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-indigo-500 font-semibold no-underline hover:text-indigo-400 transition-colors">Log in here</Link>
      </p>
    </div>
  );
};

export default Register;
