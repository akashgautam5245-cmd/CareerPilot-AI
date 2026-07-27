import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileCheck2,
  FileEdit,
  Video,
  Target,
  Briefcase,
  Bot,
  User,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen = true }) => {
  const { user } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume-ats', label: 'ATS Resume Analyzer', icon: FileCheck2 },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileEdit },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: Video },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
    { id: 'job-tracker', label: 'Job Application Tracker', icon: Briefcase },
    { id: 'ai-chat', label: 'AI Career Coach', icon: Bot },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  if (user?.role === 'ADMIN') {
    navigationItems.push({ id: 'admin', label: 'Admin Portal', icon: Shield });
  }

  return (
    <aside
      className={`w-64 glass-panel border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between p-4 transition-all duration-200 min-h-[calc(100vh-4rem)] ${
        isOpen ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md glow-blue'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white opacity-80" />}
            </button>
          );
        })}
      </div>

      {/* Target Role Pill */}
      <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs">
        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
          Current Target Role
        </span>
        <p className="font-semibold text-gray-900 dark:text-blue-100 mt-0.5 truncate">
          {user?.targetRole || 'Software Engineer'}
        </p>
      </div>
    </aside>
  );
};
