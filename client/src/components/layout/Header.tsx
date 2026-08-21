import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Sparkles, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: '1',
      title: 'Task Overdue Warning',
      message: 'Python PyTorch CUDA dependency task is past due.',
      type: 'OVERDUE',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'AI Problem Analysis Ready',
      message: 'AI generated root cause diagnosis for PostgreSQL connection leak.',
      type: 'RECOMMENDATION',
      time: '1h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Daily Review Reminder',
      message: 'Time to submit your daily review accomplishments.',
      type: 'REVIEW',
      time: '3h ago',
      unread: false,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, problems, knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </form>

      {/* Right Top Actions */}
      <div className="flex items-center space-x-3">
        {/* "Plan My Day" Quick AI Button */}
        <button
          onClick={() => navigate('/ai-assistant')}
          className="gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Plan My Day</span>
        </button>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors relative border border-slate-700/50"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-4 ring-slate-900 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-200">Notifications Center</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  2 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/problems');
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.unread
                        ? 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-indigo-300 flex items-center gap-1">
                        {n.type === 'OVERDUE' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                        {n.type === 'RECOMMENDATION' && <Sparkles className="w-3 h-3 text-amber-400" />}
                        {n.type === 'REVIEW' && <Clock className="w-3 h-3 text-indigo-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
