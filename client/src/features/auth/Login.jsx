import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Custom Hook pulls functions from our global Context
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // On success, forcefully route user into the protected app
      navigate('/kyc'); 
    } catch (err) {
      // Safely navigate the error response object from Axios
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Login completely failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '10px' }}>Sign in to KYC Platform</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="john@doe.com"
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="********"
          />
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '10px' }}>
          Secure Login
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: '#2563eb' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
