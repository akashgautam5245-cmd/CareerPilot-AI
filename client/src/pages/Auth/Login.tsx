import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onForgotPassword }) => {
  const { login, googleLogin } = useAuth();
  const { addToast } = useNotification();
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('success', 'Welcome Back!', 'Successfully logged into Antigravity AI Platform.');
    } catch (err: any) {
      addToast('error', 'Authentication Failed', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'admin') => {
    setLoading(true);
    const demoEmail = role === 'admin' ? 'admin@example.com' : 'student@example.com';
    const demoPass = role === 'admin' ? 'AdminPass123!' : 'Password123!';
    try {
      await login(demoEmail, demoPass);
      addToast('success', `Logged in as Demo ${role.toUpperCase()}`, 'Sample data loaded successfully.');
    } catch (err: any) {
      addToast('error', 'Demo Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 shadow-2xl relative z-10 border border-gray-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 mx-auto flex items-center justify-center text-white mb-3 shadow-lg glow-blue">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            AI Resume & Interview Coach
          </h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to optimize your resume and ace mock interviews</p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div className="mb-6 p-3 rounded-2xl bg-blue-950/60 border border-blue-800/60 text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-blue-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> One-Click Quick Demo Login
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium text-white transition-colors"
            >
              Demo Student
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-medium text-white transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-300">Password</label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-blue-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-sm shadow-lg glow-blue transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-dark-card text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => googleLogin('google.user@example.com', 'Alex Google User')}
          className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.41l3.99-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Google Login
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-400 font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
