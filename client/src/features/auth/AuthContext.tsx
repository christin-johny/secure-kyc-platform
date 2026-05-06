import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../common/utils/api';

interface IAuthContext {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<void> => {
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
