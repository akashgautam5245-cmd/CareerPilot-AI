import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Calendar,
  AlertTriangle,
  Bot,
  BarChart3,
  BookOpen,
  Sparkles,
  Search,
  User,
  Settings as SettingsIcon,
  LogOut,
  BrainCircuit,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Create Task', path: '/create-task', icon: PlusCircle },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Problem Solver', path: '/problems', icon: AlertTriangle, badge: 'AI' },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, badge: 'Pro' },
    { label: 'Productivity Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Daily Review', path: '/daily-review', icon: BookOpen },
    { label: 'Weekly Insights', path: '/weekly-insights', icon: Sparkles },
    { label: 'Knowledge Base', path: '/knowledge-base', icon: Search },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
            SolveFlow <span className="text-indigo-400 text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-medium">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Work & Problem Management</p>
        </div>
      </div>

      {/* Quick AI Action Card */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20">
        <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold mb-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Engine Status</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">Priority Scoring & Root Cause Diagnosis Active</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Student User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'student@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
