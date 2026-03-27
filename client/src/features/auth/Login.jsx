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

  // Validate Email Live
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
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Login completely failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="card">
      <h2 className="page-title">Welcome Back</h2>
      <p className="page-subtitle">Please securely sign in to the KYC Platform to continue.</p>

      {error && <div className="alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            required 
            className={`form-input ${emailError ? 'input-error' : (email ? 'input-success' : '')}`}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="john@doe.com"
          />
          {emailError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: '500' }}>{emailError}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            required 
            className="form-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="********"
          />
        </div>
        <button type="submit" className={`btn btn-primary ${(isLoading || !isFormValid) ? 'btn-disabled' : ''}`} disabled={isLoading || !isFormValid}>
          {isLoading ? 'Authenticating...' : 'Secure Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create one here</Link>
      </p>
    </div>
  );
};

export default Login;
