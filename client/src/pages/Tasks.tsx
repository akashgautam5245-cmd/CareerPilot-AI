import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Sparkles,
  Zap,
  Tag,
  ArrowUpDown,
  CheckSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { Task } from '../types';

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('priority');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/tasks', {
        params: {
          search,
          status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
          priority: selectedPriority !== 'ALL' ? selectedPriority : undefined,
          sortBy,
        },
      });
      if (res.tasks) setTasks(res.tasks);
    } catch (err) {
      console.warn('Using local tasks list fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, selectedStatus, selectedPriority, sortBy]);

  const handleToggleComplete = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus as any } : t))
      );
    } catch (err) {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus as any } : t))
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } catch (err) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            My Tasks & Work Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize tasks, view AI priority scores, set deadlines, and track execution status.
          </p>
        </div>

        <button
          onClick={() => navigate('/create-task')}
          className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, tag, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none"
            >
              <option value="priority">AI Score</option>
              <option value="deadline">Deadline</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.status === 'COMPLETED';
          const isBlocked = task.status === 'BLOCKED';

          return (
            <div
              key={task.id}
              className={`glass-panel p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted
                  ? 'opacity-60 bg-slate-900/40 border-slate-800/60'
                  : isBlocked
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : 'hover:border-indigo-500/30'
              }`}
            >
              {/* Checkbox & Task Title */}
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleComplete(task.id, task.status)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-700 hover:border-indigo-500'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1 truncate">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <h3
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className={`text-sm font-bold cursor-pointer hover:text-indigo-400 transition-colors ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {task.projectName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 flex-wrap gap-2 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Est: {task.estimatedDuration}m
                    </span>

                    {task.deadline && (
                      <span className="text-amber-400 flex items-center gap-1 font-mono">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {task.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority & Actions */}
              <div className="flex items-center space-x-4 shrink-0 justify-between md:justify-end">
                {/* AI Priority Score Badge */}
                <div className="text-right">
                  <div className="inline-flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-indigo-300">
                      AI Score: {task.aiPriorityScore}/100
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Priority: {task.priority}</p>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
