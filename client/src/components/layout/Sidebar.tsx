import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Briefcase,
  Target,
  Map,
  Code,
  Video,
  Award,
  Bot,
  BookmarkCheck,
  TrendingUp,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Career Profile', path: '/profile', icon: UserCheck },
        { name: 'Resume Analyzer', path: '/resume', icon: FileText },
        { name: 'Job Matcher', path: '/job-matcher', icon: Briefcase },
      ],
    },
    {
      title: 'INTELLIGENCE & SKILLS',
      items: [
        { name: 'Skill Gap Engine', path: '/skill-gap', icon: Target },
        { name: '90-Day Roadmap', path: '/roadmap', icon: Map },
        { name: 'AI Projects', path: '/projects', icon: Code },
        { name: 'AI Mock Interview', path: '/interview/new', icon: Video },
        { name: 'Career Readiness', path: '/readiness', icon: Award },
        { name: 'AI Career Assistant', path: '/assistant', icon: Bot, badge: 'AI' },
      ],
    },
    {
      title: 'TRACKING & ANALYTICS',
      items: [
        { name: 'Saved Jobs & Tracker', path: '/jobs', icon: BookmarkCheck },
        { name: 'Progress Tracking', path: '/analytics', icon: TrendingUp },
        { name: 'Career Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-white font-outfit tracking-wide flex items-center gap-1.5">
                CareerPilot <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Placement Intelligence</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              85%
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Career Readiness</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
