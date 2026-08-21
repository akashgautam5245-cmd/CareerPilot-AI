import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Zap,
  ChevronRight,
  Brain,
  ListTodo,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../services/api';
import { Task, Problem } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);

  // Overview KPIs
  const stats = {
    totalTasks: 8,
    completed: 6,
    pending: 2,
    overdue: 1,
    problemsEncountered: 3,
    problemsSolved: 3,
    focusTime: '5h 45m',
    productivityPercentage: 82,
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [taskRes, probRes]: any = await Promise.all([
          api.get('/tasks').catch(() => null),
          api.get('/problems').catch(() => null),
        ]);
        if (taskRes?.tasks) setTasks(taskRes.tasks);
        if (probRes?.problems) setProblems(probRes.problems);
      } catch (err) {
        console.warn('Using local stats fallback for dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Recharts Data
  const priorityData = [
    { name: 'Critical', count: 2, color: '#ef4444' },
    { name: 'High', count: 3, color: '#f59e0b' },
    { name: 'Medium', count: 2, color: '#3b82f6' },
    { name: 'Low', count: 1, color: '#10b981' },
  ];

  const completionData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#3b82f6' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ];

  const productivityTrend = [
    { day: 'Mon', score: 75, focusHours: 4.5 },
    { day: 'Tue', score: 88, focusHours: 5.8 },
    { day: 'Wed', score: 71, focusHours: 4.2 },
    { day: 'Thu', score: 89, focusHours: 6.1 },
    { day: 'Fri', score: 85, focusHours: 5.5 },
    { day: 'Sat', score: 80, focusHours: 4.0 },
    { day: 'Sun', score: 92, focusHours: 6.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SolveFlow AI Engine Running</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Today's Work & Productivity Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, task prioritization scores, and AI root-cause blocker insights.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/create-task')}
            className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg"
          >
            <span>+ Create Task</span>
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400">Total Tasks</p>
          <p className="text-xl font-bold text-white mt-1">{stats.totalTasks}</p>
          <span className="text-[10px] text-slate-500">Scheduled today</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <p className="text-[11px] font-semibold text-emerald-400">Completed</p>
          <p className="text-xl font-bold text-emerald-300 mt-1">{stats.completed}</p>
          <span className="text-[10px] text-emerald-500">75% completed</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/10">
          <p className="text-[11px] font-semibold text-indigo-400">Pending</p>
          <p className="text-xl font-bold text-indigo-300 mt-1">{stats.pending}</p>
          <span className="text-[10px] text-indigo-500">In progress</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <p className="text-[11px] font-semibold text-rose-400">Overdue</p>
          <p className="text-xl font-bold text-rose-300 mt-1">{stats.overdue}</p>
          <span className="text-[10px] text-rose-500">Action required</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <p className="text-[11px] font-semibold text-amber-400">Problems</p>
          <p className="text-xl font-bold text-amber-300 mt-1">{stats.problemsEncountered}</p>
          <span className="text-[10px] text-amber-500">Blockers logged</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/10">
          <p className="text-[11px] font-semibold text-purple-400">Solved</p>
          <p className="text-xl font-bold text-purple-300 mt-1">{stats.problemsSolved}</p>
          <span className="text-[10px] text-purple-500">100% resolution</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/10">
          <p className="text-[11px] font-semibold text-cyan-400">Focus Time</p>
          <p className="text-xl font-bold text-cyan-300 mt-1">{stats.focusTime}</p>
          <span className="text-[10px] text-cyan-500">Active work</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
          <p className="text-[11px] font-semibold text-indigo-300">Productivity</p>
          <p className="text-xl font-extrabold text-white mt-1">{stats.productivityPercentage}%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+4% vs target</span>
        </div>
      </div>

      {/* Main Grid: Timeline + Charts + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Timeline & Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timeline Block */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Today's Task Timeline
                </h3>
                <p className="text-xs text-slate-400">Optimized schedule generated by AI Priority Engine</p>
              </div>
              <button onClick={() => navigate('/tasks')} className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                <span>View All Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    08:00 – 09:30
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Train ResNet-50 Model on PyTorch</h4>
                    <p className="text-[11px] text-slate-400">Machine Learning Coursework • Priority Score: 94/100</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  IN PROGRESS
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    09:45 – 11:15
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Integrate Root Cause Analysis Visualizer</h4>
                    <p className="text-[11px] text-slate-400">SolveFlow AI Web App • Priority Score: 86/100</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  COMPLETED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/30 flex items-center justify-between bg-rose-950/10">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                    11:30 – 12:15
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-rose-200">Fix PyTorch CUDA Dependency Error</h4>
                    <p className="text-[11px] text-rose-400">Technical & Code • Blocked Task</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/problems')}
                  className="text-[10px] font-bold px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                >
                  Analyze Blockage
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    14:00 – 15:00
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">Submit 5 AI Engineer Applications</h4>
                    <p className="text-[11px] text-slate-400">Career Prep • Priority Score: 78/100</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">TODO</span>
              </div>
            </div>
          </div>

          {/* Productivity Chart & Priority Distribution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Productivity Chart */}
            <div className="glass-card">
              <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Productivity & Focus Trend
              </h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivityTrend}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution Chart */}
            <div className="glass-card">
              <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Task Priority Distribution
              </h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical (2)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High (3)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Med (2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Recent Problems */}
        <div className="space-y-6">
          {/* AI Recommendation Cards */}
          <div className="glass-card bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border-indigo-500/30">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Productivity Insight</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "Complete your PyTorch Deep Learning model training task first because the deadline is tomorrow and loss optimization has high dependency on remaining evaluation steps."
            </p>
            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">AI Priority Score: <strong className="text-indigo-400">94/100</strong></span>
              <button onClick={() => navigate('/ai-assistant')} className="text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                <span>Ask Assistant</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Problems & Blockers */}
          <div className="glass-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Recent Problems & Blockers
              </h3>
              <button onClick={() => navigate('/problems')} className="text-[11px] text-indigo-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300">PyTorch CUDA Mismatch</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  CUDA kernel execution crash on GPU allocation step.
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Status: Investigating</span>
                  <button
                    onClick={() => navigate('/problems')}
                    className="text-indigo-400 font-semibold hover:underline"
                  >
                    AI RCA Available →
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-300">PostgreSQL Connection Leak</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">RESOLVED</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Pool leak fixed via global Prisma singleton.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
