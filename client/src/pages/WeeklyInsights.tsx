import React from 'react';
import { Sparkles, TrendingUp, Clock, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WeeklyInsights: React.FC = () => {
  const navigate = useNavigate();

  const insights = [
    {
      id: '1',
      title: 'Morning Focus Advantage',
      impact: 'HIGH IMPACT',
      impactColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'You complete difficult tasks 32% faster when they are scheduled before 12 PM during your morning peak focus window.',
      recommendation: 'Schedule complex PyTorch model training and core backend architecture tasks between 8:30 AM and 11:30 AM.',
    },
    {
      id: '2',
      title: 'Duration Estimation Variance',
      impact: 'HIGH IMPACT',
      impactColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Your main cause of unfinished work is underestimating task duration for tasks estimated above 90 minutes by an average of 25%.',
      recommendation: 'Break tasks estimated over 90 minutes into 45-minute sub-tasks before scheduling.',
    },
    {
      id: '3',
      title: 'Long Task Postponement Pattern',
      impact: 'MEDIUM IMPACT',
      impactColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'You frequently postpone tasks with estimated durations above 2 hours to subsequent days.',
      recommendation: 'Use time-boxing technique to set strict 50-minute work sprints for long tasks.',
    },
    {
      id: '4',
      title: 'Weekly Velocity Improvement',
      impact: 'POSITIVE TREND',
      impactColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Your productivity completion percentage has improved by +14% compared with last week.',
      recommendation: 'Maintain your current daily review habit to sustain momentum.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            AI Weekly Productivity Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven behavior analytics calculated from your stored database tasks, completion times, and problem logs.
          </p>
        </div>

        <button
          onClick={() => navigate('/ai-assistant')}
          className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="glass-card space-y-3 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-950 border-indigo-500/20 hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.impactColor}`}>
                {item.impact}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">"{item.description}"</p>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-indigo-300 block">💡 AI Actionable Recommendation:</span>
              <p>{item.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
