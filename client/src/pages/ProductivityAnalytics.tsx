import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const ProductivityAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const summary = {
    totalTasks: 48,
    completedTasks: 39,
    completionRate: 81.2,
    avgDurationMins: 62,
    estVsActualRatio: 1.12,
    problemsSolved: 14,
    totalFocusHours: 42.5,
  };

  const weeklyTrend = [
    { day: 'Mon', completed: 6, overdue: 1, focusHours: 5.5, estMins: 300, actMins: 330 },
    { day: 'Tue', completed: 8, overdue: 0, focusHours: 6.2, estMins: 360, actMins: 380 },
    { day: 'Wed', completed: 5, overdue: 2, focusHours: 4.8, estMins: 280, actMins: 320 },
    { day: 'Thu', completed: 9, overdue: 0, focusHours: 7.0, estMins: 400, actMins: 410 },
    { day: 'Fri', completed: 7, overdue: 1, focusHours: 5.8, estMins: 320, actMins: 350 },
    { day: 'Sat', completed: 4, overdue: 0, focusHours: 4.0, estMins: 240, actMins: 240 },
    { day: 'Sun', completed: 6, overdue: 0, focusHours: 5.0, estMins: 300, actMins: 290 },
  ];

  const problemCategoryData = [
    { name: 'Environment & PyTorch', count: 6, color: '#8b5cf6' },
    { name: 'Database Connections', count: 4, color: '#3b82f6' },
    { name: 'UI & Vite HMR', count: 3, color: '#10b981' },
    { name: 'Career & Resume', count: 1, color: '#f59e0b' },
  ];

  const productiveHoursData = [
    { hour: '08 AM', score: 92 },
    { hour: '10 AM', score: 96 },
    { hour: '12 PM', score: 70 },
    { hour: '02 PM', score: 78 },
    { hour: '04 PM', score: 85 },
    { hour: '06 PM', score: 62 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Productivity Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data science breakdown of task duration estimation, completion velocity, and problem resolution metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                timeframe === t
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Completion Rate</span>
          <p className="text-2xl font-extrabold text-emerald-400">{summary.completionRate}%</p>
          <span className="text-[10px] text-emerald-500">39 / 48 Tasks</span>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Avg Task Duration</span>
          <p className="text-2xl font-extrabold text-white">{summary.avgDurationMins} <span className="text-xs font-normal text-slate-400">mins</span></p>
          <span className="text-[10px] text-slate-500">Per focus session</span>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Est vs Actual Ratio</span>
          <p className="text-2xl font-extrabold text-amber-400">{summary.estVsActualRatio}x</p>
          <span className="text-[10px] text-amber-500">+12% time overage</span>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Problems Solved</span>
          <p className="text-2xl font-extrabold text-purple-400">{summary.problemsSolved}</p>
          <span className="text-[10px] text-purple-500">Blockers resolved</span>
        </div>

        <div className="glass-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Total Focus Time</span>
          <p className="text-2xl font-extrabold text-cyan-400">{summary.totalFocusHours} <span className="text-xs font-normal text-slate-400">hrs</span></p>
          <span className="text-[10px] text-cyan-500">Logged this week</span>
        </div>

        <div className="glass-card p-4 space-y-1 bg-gradient-to-br from-indigo-950/30 to-purple-950/30">
          <span className="text-[11px] font-semibold text-indigo-300">Peak Focus Hour</span>
          <p className="text-2xl font-extrabold text-amber-400">10:00 AM</p>
          <span className="text-[10px] text-indigo-400">96% efficiency</span>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed vs Overdue Chart */}
        <div className="glass-card">
          <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Task Completion vs Overdue Velocity ({timeframe})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" name="Overdue Tasks" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estimated vs Actual Time Chart */}
        <div className="glass-card">
          <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Estimated vs Actual Time (Minutes)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="estMins" name="Estimated Time" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="actMins" name="Actual Time" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Problem Categories Pie Chart */}
        <div className="glass-card">
          <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            Most Common Problem Categories
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={problemCategoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {problemCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productive Hours Bar Chart */}
        <div className="glass-card">
          <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Most Productive Hours of the Day
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productiveHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="score" name="Focus Efficiency %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
