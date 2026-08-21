import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('solveflow_user');
    return saved ? JSON.parse(saved) : {
      id: 'demo-student-id',
      name: 'Alex Rivera',
      email: 'student@example.com',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      bio: 'AI & Data Science Student | SolveFlow AI User',
      focusHoursGoal: 6.5,
    };
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || 'demo-jwt-token');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      if (!token || token === 'demo-jwt-token') {
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await api.get('/auth/me');
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('solveflow_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Backend offline or token validation skipped in local mode');
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('solveflow_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err: any) {
      // Allow seamless student demo login even if server is offline
      if (email === 'student@example.com') {
        const demoUser = {
          id: 'demo-student-id',
          name: 'Alex Rivera',
          email: 'student@example.com',
          role: 'USER' as const,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          bio: 'AI & Data Science Student',
          focusHoursGoal: 6.5,
        };
        localStorage.setItem('token', 'demo-jwt-token');
        localStorage.setItem('solveflow_user', JSON.stringify(demoUser));
        setToken('demo-jwt-token');
        setUser(demoUser);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, bio?: string) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/register', { name, email, password, bio });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('solveflow_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err: any) {
      // Fallback register
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        role: 'USER' as const,
        bio: bio || 'AI & Data Science Enthusiast',
        focusHoursGoal: 6.0,
      };
      localStorage.setItem('token', 'demo-jwt-token');
      localStorage.setItem('solveflow_user', JSON.stringify(newUser));
      setToken('demo-jwt-token');
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('solveflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
