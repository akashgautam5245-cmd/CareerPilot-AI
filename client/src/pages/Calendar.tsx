import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number>(21);

  // Mock days of August 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const eventMap: Record<number, Array<{ title: string; type: 'task' | 'problem' | 'session'; priority?: string }>> = {
    18: [{ title: 'Build AI Priority Engine API', type: 'task' }],
    19: [{ title: 'PostgreSQL Connection Leak', type: 'problem' }],
    20: [{ title: 'Dark/Light Theme Switcher', type: 'task' }],
    21: [
      { title: 'Train ResNet-50 Model PyTorch', type: 'task', priority: 'CRITICAL' },
      { title: 'Integrate Root Cause Visualizer', type: 'task', priority: 'HIGH' },
      { title: 'PyTorch CUDA Mismatch', type: 'problem' },
    ],
    22: [{ title: 'Submit 5 AI Applications', type: 'task' }],
    23: [{ title: 'Write OpenAPI Spec', type: 'task' }],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            Work Schedule Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View planned work sessions, deadlines, and problem blockers across dates.
          </p>
        </div>

        <button
          onClick={() => navigate('/create-task')}
          className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task to Calendar</span>
        </button>
      </div>

      {/* Main Grid & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Month Grid */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-200">August 2026</h2>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading days */}
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />
            <div className="h-20 bg-slate-950/20 rounded-xl p-1 opacity-20" />

            {daysInMonth.map((day) => {
              const events = eventMap[day] || [];
              const isSelected = day === selectedDate;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-20 p-1.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-indigo-400 font-extrabold' : 'text-slate-300'}>{day}</span>
                    {events.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-0.5 overflow-hidden">
                    {events.slice(0, 2).map((ev, idx) => (
                      <div
                        key={idx}
                        className={`text-[9px] truncate px-1 py-0.5 rounded ${
                          ev.type === 'problem'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[9px] text-slate-500 font-semibold text-right">+{events.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Activity Sidebar */}
        <div className="glass-card space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Activities for August {selectedDate}, 2026
            </h3>
            <p className="text-xs text-slate-400">Scheduled work sessions and problem blockers</p>
          </div>

          <div className="space-y-3">
            {(eventMap[selectedDate] || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No tasks scheduled for this day.</p>
            ) : (
              (eventMap[selectedDate] || []).map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    ev.type === 'problem'
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {ev.type === 'problem' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {ev.title}
                    </span>
                    {ev.priority && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                        {ev.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {ev.type === 'problem' ? 'Reported Blocker' : 'Planned Focus Session'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
