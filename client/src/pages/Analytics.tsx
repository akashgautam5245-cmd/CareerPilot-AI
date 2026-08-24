import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart3, TrendingUp, Award, Target, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { careerApi } from '../services/api';

export const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await careerApi.getAnalytics();
      setAnalyticsData(res.analytics);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mockSkillProgress = [
    { month: 'May', SQL: 55, Python: 70, AWS: 10, Stats: 30 },
    { month: 'Jun', SQL: 65, Python: 78, AWS: 20, Stats: 35 },
    { month: 'Jul', SQL: 78, Python: 85, AWS: 35, Stats: 40 },
    { month: 'Aug', SQL: 85, Python: 90, AWS: 50, Stats: 45 },
  ];

  const mockInterviewTrend = [
    { session: 'Mock #1', score: 62 },
    { session: 'Mock #2', score: 70 },
    { session: 'Mock #3', score: 76.5 },
  ];

  const radarSkillData = [
    { subject: 'Python', A: 90, fullMark: 100 },
    { subject: 'SQL', A: 85, fullMark: 100 },
    { subject: 'Pandas', A: 80, fullMark: 100 },
    { subject: 'Scikit-learn', A: 75, fullMark: 100 },
    { subject: 'AWS', A: 35, fullMark: 100 },
    { subject: 'Statistics', A: 45, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-xs">
        Loading Career Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Performance Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
          Career Analytics & Progress Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Visual insights on skill growth, interview score progression, job application conversion, and roadmap velocity.
        </p>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Readiness Score', val: `${analyticsData?.readinessScore || 76}%`, change: '+12% this month', icon: Award, color: 'text-indigo-400' },
          { title: 'Resume Score', val: `${analyticsData?.resumeScore || 78}/100`, change: '+8 points', icon: FileText, color: 'text-purple-400' },
          { title: 'Avg Job Match', val: `${analyticsData?.avgJobMatch || 74.5}%`, change: '+15% match', icon: Target, color: 'text-pink-400' },
          { title: 'Roadmap Velocity', val: `${analyticsData?.roadmapProgress || 42.5}%`, change: 'On Track', icon: TrendingUp, color: 'text-emerald-400' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400">{m.title}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-white font-outfit mb-1">{m.val}</div>
              <span className="text-[11px] text-emerald-400 font-medium">{m.change}</span>
            </div>
          );
        })}
      </div>

      {/* Recharts Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Skill Improvement Over Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-outfit">Skill Growth Trend</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">MONTHLY PROFICIENCY</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSkillProgress}>
                <defs>
                  <linearGradient id="colorSql" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="SQL" stroke="#6366f1" fillOpacity={1} fill="url(#colorSql)" />
                <Area type="monotone" dataKey="Python" stroke="#ec4899" fillOpacity={1} fill="url(#colorPy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Interview Performance Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-outfit">Mock Interview Progression</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">OVERALL EVALUATION SCORE</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInterviewTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Radar Skill Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white font-outfit mb-4">Skill Radar Matrix</h3>
        <div className="h-72 w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarSkillData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
              <Radar name="Proficiency %" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
