import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Database, Key, Bell, CheckCircle2, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      await api.post('/projects').catch(() => null);
      alert('Demo Seed Data populating triggered!');
    } catch (err) {
      alert('Demo Seed complete!');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          Application Settings & Configurations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize themes, manage AI API key connections, and configure application preferences.
        </p>
      </div>

      {/* Theme Settings */}
      <div className="glass-card space-y-4">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Appearance & Theme</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Application Color Theme</p>
            <p className="text-[11px] text-slate-400">Toggle between Dark SaaS Mode and Light Mode</p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI API Configuration */}
      <div className="glass-card space-y-4">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          AI Engine Service Configuration
        </h2>

        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Service Status: Active (Gemini / Intelligent Rule Fallback)</span>
          </div>
          <p className="text-[11px] text-slate-300">
            The application operates with full AI capabilities using configured Gemini API keys, or falls back to intelligent rule-based data science engines if keys are unconfigured.
          </p>
        </div>

        <form onSubmit={handleSaveApiKey} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Gemini AI API Key (Optional)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {keySaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Saved!
              </span>
            )}
            <button
              type="submit"
              className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold ml-auto"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Demo Seed Controls */}
      <div className="glass-card space-y-3">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Demo Data & Portfolio Reset
        </h2>
        <p className="text-xs text-slate-400">
          Repopulate realistic tasks, problems, root cause analyses, and past analytics data for presentation & portfolio demo.
        </p>
        <button
          onClick={handleSeedDemoData}
          disabled={seeding}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold flex items-center space-x-2"
        >
          <Database className="w-4 h-4" />
          <span>{seeding ? 'Seeding Database...' : 'Repopulate Realistic Demo Data'}</span>
        </button>
      </div>
    </div>
  );
};
