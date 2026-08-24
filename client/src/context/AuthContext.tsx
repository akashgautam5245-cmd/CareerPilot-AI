import React, { createContext, useContext, useState, useEffect } from 'react';
import { careerApi } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  location?: string;
  education?: string;
  degree?: string;
  college?: string;
  gradYear?: number;
  targetRole?: string;
  preferredIndustry?: string;
  experienceLevel?: string;
  preferredJobType?: string;
  careerGoal?: string;
  careerProfile?: any;
  latestResume?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, targetRole?: string, experienceLevel?: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('careerpilot_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'demo-user-id',
          name: 'Alex Rivera',
          email: 'alex.rivera@careerpilot.ai',
          role: 'USER',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          bio: 'Final year CS & Data Science student looking for Data Scientist / ML Engineer roles.',
          targetRole: 'Data Scientist / ML Engineer',
          preferredIndustry: 'Artificial Intelligence & Tech',
          experienceLevel: 'Entry Level / Intern',
        };
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || 'demo-careerpilot-jwt');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      if (!token || token === 'demo-careerpilot-jwt') {
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await careerApi.getMe();
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('careerpilot_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Backend server connecting or using local state mode');
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res: any = await careerApi.login({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('careerpilot_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err: any) {
      if (email === 'alex.rivera@careerpilot.ai' || email === 'demo@careerpilot.ai') {
        const demoUser: User = {
          id: 'demo-user-id',
          name: 'Alex Rivera',
          email: 'alex.rivera@careerpilot.ai',
          role: 'USER',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          bio: 'Final year CS student at UC Berkeley.',
          targetRole: 'Data Scientist / ML Engineer',
          preferredIndustry: 'Artificial Intelligence & Tech',
          experienceLevel: 'Entry Level / Intern',
        };
        localStorage.setItem('token', 'demo-careerpilot-jwt');
        localStorage.setItem('careerpilot_user', JSON.stringify(demoUser));
        setToken('demo-careerpilot-jwt');
        setUser(demoUser);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, targetRole?: string, experienceLevel?: string) => {
    setIsLoading(true);
    try {
      const res: any = await careerApi.register({ name, email, password, targetRole, experienceLevel });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('careerpilot_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err: any) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name,
        email,
        role: 'USER',
        targetRole: targetRole || 'Software Engineer',
        experienceLevel: experienceLevel || 'Entry Level',
      };
      localStorage.setItem('token', 'demo-careerpilot-jwt');
      localStorage.setItem('careerpilot_user', JSON.stringify(newUser));
      setToken('demo-careerpilot-jwt');
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('careerpilot_user');
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
