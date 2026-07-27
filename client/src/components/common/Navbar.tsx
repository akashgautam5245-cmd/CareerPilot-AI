import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, User as UserIcon, Shield, Sparkles, FileText, Menu, X } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg glow-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Antigravity AI
              </span>
              <span className="hidden sm:inline-block text-xs ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                Career Suite
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Theme Toggle, Notifications, User Badge & Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-dark-bg" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <span className="text-xs text-blue-500 font-medium">2 New</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 text-xs border border-blue-100 dark:border-blue-900/50">
                    <p className="font-medium text-blue-900 dark:text-blue-200">ATS Analysis Complete 🎉</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">Your Software Engineer resume scored 88/100.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 text-xs border border-indigo-100 dark:border-indigo-900/50">
                    <p className="font-medium text-indigo-900 dark:text-indigo-200">Upcoming Interview Alert ⏰</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">Google Technical Round in 3 days.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account Info */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-blue-500 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold flex items-center gap-1">
                    {user.name}
                    {user.role === 'ADMIN' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block">{user.targetRole || 'Student'}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
