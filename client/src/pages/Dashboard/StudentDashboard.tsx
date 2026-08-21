import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  FileCheck2,
  Trophy,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Plus,
  Clock,
  Video,
  Award,
  BarChart2,
  CheckCircle2,
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
  const [interviewsCount, setInterviewsCount] = useState(2);
  const [avgScore, setAvgScore] = useState(85);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res: any = await api.get('/interview/interviews');
      if (res.success && res.data && res.data.length > 0) {
        setInterviewsCount(res.data.length);
        const total = res.data.reduce((acc: number, item: any) => acc + (item.overallScore || 80), 0);
        setAvgScore(Math.round(total / res.data.length));
      }
    } catch (err) {
      // Fallback to sample stats
    }
  };

  const radarData = [
    { subject: 'Technical Depth', A: 86 },
    { subject: 'Grammar & Clarity', A: 92 },
    { subject: 'Confidence', A: 88 },
    { subject: 'Communication', A: 90 },
    { subject: 'Fluency', A: 85 },
    { subject: 'Completeness', A: 84 },
  ];

  const trendData = [
    { date: 'Session 1', score: 72 },
    { date: 'Session 2', score: 78 },
    { date: 'Session 3', score: 82 },
    { date: 'Session 4', score: 86 },
    { date: 'Session 5 (Recent)', score: 90 },
  ];

  const upcomingInterviews = [
    { company: 'Google', role: 'Frontend Engineer', type: 'Technical Round', date: 'Aug 06, 2026', time: '10:00 AM PST' },
    { company: 'Stripe', role: 'Full Stack Engineer', type: 'System Design', date: 'Aug 10, 2026', time: '02:30 PM PST' },
  ];

  const aiSuggestions = [
    'Use the STAR method (Situation, Task, Action, Result) when responding to behavioral questions.',
    'Incorporate explicit metrics (e.g., "Reduced API response latency by 35%") during technical deep dives.',
    'Practice speaking out loud to improve speech-to-text fluency and articulation score.',
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl border border-blue-800/50">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Mock Interview & Career Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}! 👋
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Your mock interview performance ranks in the top <span className="text-emerald-400 font-bold">10%</span> for{' '}
              <span className="font-semibold text-blue-300">{user?.targetRole || 'Software Engineer'}</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg glow-blue transition-all flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Start AI Mock Interview
            </button>
            <button
              onClick={() => onNavigate('interview-history')}
              className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold text-xs text-gray-200 border border-gray-700 transition-all flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Past Scorecards
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Interviews */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Completed Interviews</span>
            <span className="text-3xl font-black text-gray-900 dark:text-white mt-1 block">{interviewsCount}</span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +2 this week
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Video className="w-6 h-6" />
          </div>
        </div>

        {/* Average Score */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Average AI Score</span>
            <span className="text-3xl font-black text-blue-500 mt-1 block">{avgScore} / 100</span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +8 pts improvement
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Technical Accuracy */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Technical Accuracy</span>
            <span className="text-3xl font-black text-purple-500 mt-1 block">88%</span>
            <span className="text-[11px] text-gray-400 block mt-1">System & Algorithms</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        {/* Practice Hours */}
        <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Practice Time</span>
            <span className="text-3xl font-black text-amber-500 mt-1 block">4.5 hrs</span>
            <span className="text-[11px] text-gray-400 block mt-1">Voice & Speech Practice</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Improvement Trend Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">AI Interview Score Trend</h3>
                <p className="text-xs text-gray-500">Track performance evolution across practice sessions</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
                +18% Growth Trajectory
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
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Actionable Suggestions Box */}
          <div className="glass-panel p-6 rounded-3xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Personalized AI Interview Tips
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((sug, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{sug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col wide) */}
        <div className="space-y-6">
          {/* Multi-Metric Skill Radar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">6-Metric Skill Radar</h3>
            <p className="text-xs text-gray-500 mb-4">Role: {user?.targetRole || 'Software Engineer'}</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                  <Radar name="Proficiency" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Interviews Schedule */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> Upcoming Practice Reminders
            </h3>
            <div className="space-y-2.5">
              {upcomingInterviews.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{item.company}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{item.role}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
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
