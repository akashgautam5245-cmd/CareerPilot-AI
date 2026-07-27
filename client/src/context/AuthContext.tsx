import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, targetRole?: string) => Promise<void>;
  googleLogin: (email: string, name: string, photo?: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await api.get('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.warn('Session expired or token invalid');
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res: any = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const { user: loggedUser, tokens } = res.data;
      localStorage.setItem('token', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setToken(tokens.accessToken);
      setUser(loggedUser);
    }
  };

  const signup = async (name: string, email: string, password: string, targetRole = 'Software Engineer') => {
    const res: any = await api.post('/auth/signup', { name, email, password, targetRole });
    if (res.success && res.data) {
      const { user: registeredUser, tokens } = res.data;
      localStorage.setItem('token', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setToken(tokens.accessToken);
      setUser(registeredUser);
    }
  };

  const googleLogin = async (email: string, name: string, photo?: string) => {
    const res: any = await api.post('/auth/google', { googleToken: 'mock_google_token', email, name, photo });
    if (res.success && res.data) {
      const { user: gUser, tokens } = res.data;
      localStorage.setItem('token', tokens.accessToken);
      setToken(tokens.accessToken);
      setUser(gUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
