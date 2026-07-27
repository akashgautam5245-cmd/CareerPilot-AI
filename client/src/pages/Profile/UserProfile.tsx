import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User as UserIcon, Mail, Target, Briefcase, GraduationCap, Code, CheckCircle, Edit3 } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { addToast } = useNotification();
  const [name, setName] = useState(user?.name || 'Jane Student');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [bio, setBio] = useState('Enthusiastic computer science graduate passionate about full-stack web applications and AI.');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, name, targetRole, bio });
      }
      setIsSaving(false);
      addToast('success', 'Profile Updated!', 'Your account information has been saved.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-7 h-7 text-blue-500" /> Account & Profile Settings
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal details, target career role, skills, and education history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-white text-3xl font-bold ring-4 ring-blue-500/30">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name}</h3>
            <p className="text-xs text-blue-500 font-semibold mt-0.5">{targetRole}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{user?.email}</p>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            Verified Student Account
          </span>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-500" /> Edit Personal Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Target Desired Role</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-900 dark:text-white"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Professional Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
