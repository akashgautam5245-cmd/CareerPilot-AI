import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Trophy,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const atsScore = 88;
  const resumeCompletion = 92;
  const profileCompletion = 85;

  const radarData = [
    { subject: 'TypeScript', A: 90, fullMark: 100 },
    { subject: 'React', A: 88, fullMark: 100 },
    { subject: 'Node.js', A: 84, fullMark: 100 },
    { subject: 'PostgreSQL', A: 80, fullMark: 100 },
    { subject: 'Docker', A: 65, fullMark: 100 },
    { subject: 'System Design', A: 70, fullMark: 100 },
  ];

  const trendData = [
    { date: 'Ver 1.0', score: 64 },
    { date: 'Ver 1.1', score: 72 },
    { date: 'Ver 1.2', score: 81 },
    { date: 'Ver 2.0 (Current)', score: 88 },
  ];

  const recentResumes = [
    { id: 'res_1', title: 'Software_Engineer_Resume_2026.pdf', score: 88, date: '2 hours ago', status: 'Analyzed' },
    { id: 'res_2', title: 'Frontend_Dev_Tailored.pdf', score: 82, date: '3 days ago', status: 'Analyzed' },
  ];

  const upcomingInterviews = [
    { company: 'Google', role: 'Frontend Engineer', type: 'Technical Round', date: 'Jul 31, 2026', time: '10:00 AM PST' },
    { company: 'Stripe', role: 'Full Stack Engineer', type: 'System Design', date: 'Aug 04, 2026', time: '02:30 PM PST' },
  ];

  const aiSuggestions = [
    'Include quantifiable metrics (e.g. "Reduced API latency by 35%") to your CloudTech experience section.',
    'Add Docker and CI/CD pipelines to target senior full-stack roles.',
    'Practice behavioral questions using the STAR framework before your Google technical interview.',
  ];

  const recommendedSkills = ['Docker', 'Kubernetes', 'Redis', 'GraphQL', 'AWS Lambda'];

  const recentActivities = [
    { text: 'Completed ATS Resume Analysis for "Software_Engineer_Resume_2026.pdf"', time: '2 hours ago', icon: FileCheck2, color: 'text-blue-500' },
    { text: 'Finished AI Mock Interview (Technical Round) with 86% overall score', time: 'Yesterday', icon: Trophy, color: 'text-amber-500' },
    { text: 'Updated Job Application status for Google to "INTERVIEWING"', time: '3 days ago', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl border border-blue-800/50">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" /> AI Career Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}! 👋
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Your resume is performing in the top <span className="text-emerald-400 font-bold">12%</span> of applicants for{' '}
              <span className="font-semibold text-blue-300">{user?.targetRole || 'Software Engineer'}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('resume-ats')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white shadow-lg glow-blue transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Upload New Resume
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold text-xs text-gray-200 border border-gray-700 transition-all flex items-center gap-2"
            >
              Start AI Mock Interview
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ATS Resume Score */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ATS Resume Score
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{atsScore}</span>
                <span className="text-sm text-gray-400">/ 100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +7 pts vs last version
            </span>
            <button onClick={() => onNavigate('resume-ats')} className="text-blue-500 font-medium hover:underline">
              View Report →
            </button>
          </div>
        </div>

        {/* Resume Completion % */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resume Completion
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{resumeCompletion}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: `${resumeCompletion}%` }} />
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Profile Completion
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{profileCompletion}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Add LinkedIn URL to hit 100%</span>
            <button onClick={() => onNavigate('profile')} className="text-indigo-500 font-medium hover:underline">
              Edit Profile →
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATS Score Improvement Trend Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">ATS Score History & Improvement</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Track your score evolution after AI bullet point rewrites</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                +24% Overall Improvement
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Suggestions Box */}
          <div className="glass-panel p-6 rounded-3xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> AI Actionable Suggestions
            </h3>
            <div className="space-y-2.5">
              {aiSuggestions.map((sug, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Resume Uploads Table */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Resume Uploads</h3>
              <button onClick={() => onNavigate('resume-ats')} className="text-xs text-blue-500 font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentResumes.map(res => (
                <div key={res.id} className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-gray-900 dark:text-white">{res.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{res.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-black text-sm text-blue-600 dark:text-blue-400">{res.score}/100</span>
                      <span className="block text-[10px] text-gray-400">ATS Score</span>
                    </div>
                    <button onClick={() => onNavigate('resume-ats')} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col wide) */}
        <div className="space-y-6">
          {/* Skill Progress Radar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">Skill Proficiency Radar</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Target: {user?.targetRole || 'Software Engineer'}</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar name="Proficiency" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Skills */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">Recommended Skills to Add</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {recommendedSkills.map(sk => (
                <span key={sk} className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                  + {sk}
                </span>
              ))}
            </div>
            <button onClick={() => onNavigate('skill-gap')} className="w-full mt-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors">
              Explore Skill Gap Roadmap
            </button>
          </div>

          {/* Upcoming Interview Schedule */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-500" /> Upcoming Interviews
            </h3>
            <div className="space-y-3">
              {upcomingInterviews.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{item.company}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.role}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
