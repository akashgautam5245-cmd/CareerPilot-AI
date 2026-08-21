import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Tag,
  Calendar,
  FileText,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { Task } from '../types';

export const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const res: any = await api.get(`/tasks/${id}`);
        if (res.task) setTask(res.task);
      } catch (err) {
        // Fallback mock task details
        setTask({
          id: id || '1',
          userId: 'user-1',
          title: 'Train ResNet-50 Model on PyTorch',
          description: 'Execute fine-tuning on PyTorch framework and calculate validation accuracy, precision, and recall.',
          categoryName: 'AI & Research',
          projectName: 'Machine Learning Coursework',
          priority: 'CRITICAL',
          status: 'IN_PROGRESS',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          estimatedDuration: 120,
          actualDuration: 45,
          tags: ['PyTorch', 'Computer Vision', 'Deep Learning'],
          notes: 'Monitor GPU memory allocation during batch training.',
          aiPriorityScore: 94,
          aiRecommendation: 'Complete your Machine Learning project documentation first because the deadline is tomorrow and the task has a high dependency on remaining evaluation steps.',
          importanceScore: 5,
          difficultyScore: 4,
          dependencies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [id]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading task details...</div>;
  }

  if (!task) {
    return <div className="p-8 text-center text-rose-400">Task not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <button
          onClick={() => navigate(`/problems?taskId=${task.id}`)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-amber-500/20"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Report Problem / Blocker</span>
        </button>
      </div>

      {/* Main Task Header Card */}
      <div className="glass-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-2 mb-1">
              <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {task.projectName}
              </span>
              <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {task.categoryName}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white">{task.title}</h1>
          </div>

          {/* AI Priority Score Badge */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-3 rounded-2xl text-right">
            <div className="flex items-center space-x-1 justify-end text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span className="text-lg font-extrabold text-white">{task.aiPriorityScore}/100</span>
            </div>
            <p className="text-[10px] text-indigo-300 font-semibold mt-0.5">AI Priority Engine Score</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

        {/* AI Recommendation Box */}
        {task.aiRecommendation && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Recommendation Strategy</span>
            </div>
            <p className="text-xs text-slate-200 leading-normal">{task.aiRecommendation}</p>
          </div>
        )}

        {/* Meta Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400">Priority Level</p>
            <p className="text-xs font-bold text-indigo-400 mt-0.5">{task.priority}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400">Estimated Duration</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{task.estimatedDuration} minutes</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400">Importance Rating</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{task.importanceScore} / 5</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-semibold text-slate-400">Difficulty Rating</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{task.difficultyScore} / 5</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 text-xs pt-2">
          <Tag className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400 font-medium">Tags:</span>
          {task.tags.map((t, idx) => (
            <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Focus Timer Session Block */}
      <div className="glass-card bg-slate-900/80 border-indigo-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Focus Execution Timer
            </h3>
            <p className="text-xs text-slate-400">Track active focus time spent working on this task.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="font-mono text-2xl font-extrabold text-indigo-400 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800">
              {formatTimer(timerSeconds)}
            </div>

            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
