import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../common/utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await api.post('/auth/register', { name, email, password, confirmPassword });
    setToken(res.data.accessToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    api.post('/auth/logout').catch(console.error); 
    window.location.href = '/login';
  };

  if (loading) return <div>Loading Application State...</div>;

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
