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
  
  // Custom Live Error States
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

  // Validate Name 
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

  // Validate Email
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

  // Validate Password Dynamically
  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  // Validate Confirm Password
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
            className={`form-input ${nameError ? 'input-error' : (name ? 'input-success' : '')}`}
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. John Doe"
          />
          {nameError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: '500' }}>{nameError}</p>}
        </div>

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
          <label className="form-label">Secure Password</label>
          <input 
            type="password" 
            required 
            className={`form-input ${password && !isPasswordValid ? 'input-error' : ''} ${isPasswordValid ? 'input-success' : ''}`}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter a strong password"
          />
          
          {password && !isPasswordValid && (
            <div className="validation-box">
              <p className="validation-title">Password Requirements:</p>
              <ul className="validation-list">
                <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                  {passwordCriteria.length ? '✓' : '○'} At least 8 characters
                </li>
                <li className={passwordCriteria.upper ? 'valid' : 'invalid'}>
                  {passwordCriteria.upper ? '✓' : '○'} One uppercase letter
                </li>
                <li className={passwordCriteria.lower ? 'valid' : 'invalid'}>
                  {passwordCriteria.lower ? '✓' : '○'} One lowercase letter
                </li>
                <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                  {passwordCriteria.number ? '✓' : '○'} One number
                </li>
                <li className={passwordCriteria.special ? 'valid' : 'invalid'}>
                  {passwordCriteria.special ? '✓' : '○'} One special character (!@#$%)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input 
            type="password" 
            required 
            className={`form-input ${confirmPasswordError ? 'input-error' : (confirmPassword && !confirmPasswordError ? 'input-success' : '')}`}
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Type your password again"
          />
          {confirmPasswordError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: '500' }}>{confirmPasswordError}</p>}
        </div>
        
        <button type="submit" className={`btn btn-primary ${(isLoading || !isFormValid) ? 'btn-disabled' : ''}`} disabled={isLoading || !isFormValid}>
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
