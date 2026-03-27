import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/kyc'); 
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="card">
      <h2 className="page-title">Create Account</h2>
      <p className="page-subtitle">Join the platform to securely submit your KYC details.</p>

      {error && <div className="alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Legal Name</label>
          <input 
            type="text" 
            required 
            className="form-input"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            required 
            className="form-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="john@doe.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Secure Password</label>
          <input 
            type="password" 
            required 
            className="form-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Required: 8+ characters"
          />
        </div>
        <button type="submit" className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`} disabled={isLoading}>
          {isLoading ? 'Creating Identity...' : 'Register Securely'}
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in here</Link>
      </p>
    </div>
  );
};

export default Register;
