import React from 'react';
import { User as UserIcon, Mail, Award, CheckCircle2, AlertTriangle, Clock, Zap, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="glass-card flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Alex Rivera'}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PRO USER
            </span>
          </div>
          <p className="text-xs text-indigo-400 font-semibold">{user?.email || 'student@example.com'}</p>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {user?.bio || 'AI & Data Science Student | Full-Stack Developer | Building SolveFlow AI'}
          </p>
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Productivity Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card text-center p-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">39</p>
          <p className="text-[11px] text-slate-400">Total Tasks Completed</p>
        </div>

        <div className="glass-card text-center p-4">
          <AlertTriangle className="w-6 h-6 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">14</p>
          <p className="text-[11px] text-slate-400">Problems Diagnosed & Solved</p>
        </div>

        <div className="glass-card text-center p-4">
          <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">42.5 hrs</p>
          <p className="text-[11px] text-slate-400">Focus Hours Logged</p>
        </div>

        <div className="glass-card text-center p-4">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-amber-400">7 Days</p>
          <p className="text-[11px] text-slate-400">Current Work Streak</p>
        </div>
      </div>
    </div>
  );
};
