import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../common/utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token stored in localStorage when the app loads
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    // 1. Post to backend
    const res = await api.post('/auth/login', { email, password });
    // 2. Extract JWT access token
    const { accessToken } = res.data;
    // 3. Save to React state (which triggers our useEffect above)
    setToken(accessToken);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { accessToken } = res.data;
    setToken(accessToken);
  };

  const logout = () => {
    setToken(null);
    // Ping backend to clear httpOnly refresh cookie
    api.post('/auth/logout').catch(console.error); 
  };

  // Prevent components from rendering until token is read from memory
  if (loading) return <div>Loading Application State...</div>;

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
