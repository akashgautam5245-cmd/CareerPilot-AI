import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerApi } from '../services/api';
import {
  Award,
  FileText,
  Briefcase,
  Map,
  Video,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState<any>({
    overallScore: 78,
    breakdown: {
      technicalSkills: 82,
      projects: 70,
      resume: 78,
      interview: 76,
      dsa: 65,
      communication: 75,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res: any = await careerApi.getCareerReadiness();
        if (res.readiness) {
          setReadiness(res.readiness);
        }
      } catch (err) {
        console.warn('Using local fallback state for dashboard readiness metric');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const radarData = [
    { subject: 'Technical', A: readiness.breakdown.technicalSkills, fullMark: 100 },
    { subject: 'Projects', A: readiness.breakdown.projects, fullMark: 100 },
    { subject: 'Resume', A: readiness.breakdown.resume, fullMark: 100 },
    { subject: 'Interview', A: readiness.breakdown.interview, fullMark: 100 },
    { subject: 'DSA', A: readiness.breakdown.dsa, fullMark: 100 },
    { subject: 'Communication', A: readiness.breakdown.communication, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Career Placement Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            Welcome back, {user?.name || 'Alex'}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Targeting <span className="text-indigo-400 font-bold">{user?.targetRole || 'Data Scientist / ML Engineer'}</span>. Your placement readiness is currently at <span className="text-emerald-400 font-bold">78%</span>.
          </p>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Career Readiness', value: `${readiness.overallScore}%`, sub: 'Top 15% Rank', icon: Award, color: 'from-emerald-500 to-teal-500', link: '/readiness' },
          { label: 'Resume Score', value: '78 / 100', sub: 'Strong Formatting', icon: FileText, color: 'from-indigo-500 to-purple-500', link: '/resume' },
          { label: 'Avg Job Match', value: '82%', sub: 'Target: Meta / Google', icon: Briefcase, color: 'from-purple-500 to-pink-500', link: '/job-matcher' },
          { label: 'Roadmap Completion', value: '42%', sub: 'Month 1 Week 3 Complete', icon: Map, color: 'from-amber-500 to-orange-500', link: '/roadmap' },
          { label: 'Interview Score', value: '76 / 100', sub: 'Technical Q&A Pass', icon: Video, color: 'from-cyan-500 to-blue-500', link: '/interview/new' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] shadow-lg group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-outfit text-white mb-1 group-hover:text-indigo-400 transition-colors">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Readiness Radar & Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> Multi-Metric Readiness Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-1">Empirical scores across 6 core candidate pillars</p>
            </div>
            <Link to="/readiness" className="text-xs text-indigo-400 hover:underline font-medium flex items-center gap-1">
              View Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#cbd5e1' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Alex Rivera" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Actionable Priority Recommendation Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-xl">
            <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4 fill-indigo-400" /> AI Priority Focus
            </div>
            <h3 className="text-base font-bold text-white mb-2">Focus on Statistics & AWS Cloud</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Statistics is required by 8/10 target jobs but ranks at 45% on your profile. Completing this gap will boost your Meta Data Science match to 88%+.
            </p>
            <Link
              to="/skill-gap"
              className="w-full gradient-btn py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              Analyze Skill Gaps <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Top Skill Gaps Preview */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" /> Top Priority Skill Gaps
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Statistics & Probability', level: 45, status: 'WEAK', color: 'bg-orange-500' },
                { name: 'AWS Cloud Services', level: 20, status: 'MISSING', color: 'bg-red-500' },
                { name: 'Docker & Containerization', level: 50, status: 'DEVELOPING', color: 'bg-amber-500' },
              ].map((gap, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-200">{gap.name}</p>
                    <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className={`${gap.color} h-full`} style={{ width: `${gap.level}%` }} />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${gap.color}`}>
                    {gap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Checklist Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-400" /> Upcoming Roadmap Tasks
            </h2>
            <p className="text-xs text-slate-400 mt-1">Month 1: Statistics & SQL Mastery</p>
          </div>
          <Link to="/roadmap" className="text-xs text-indigo-400 font-medium hover:underline">
            View 90-Day Roadmap →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Master Inferential Statistics & Hypothesis Testing', week: 'W1', status: 'Completed', done: true },
            { title: 'Advanced SQL Window Functions & Query Optimization', week: 'W2', status: 'Completed', done: true },
            { title: 'Scikit-learn Feature Engineering & Model Evaluation', week: 'W3', status: 'In Progress', done: false },
          ].map((task, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${task.done ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{task.week} Task</span>
                <h4 className="text-xs font-semibold text-slate-200 mt-0.5">{task.title}</h4>
                <p className={`text-[10px] font-semibold mt-2 ${task.done ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {task.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
