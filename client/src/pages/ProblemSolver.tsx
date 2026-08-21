import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  BrainCircuit,
} from 'lucide-react';
import { api } from '../services/api';
import { Problem } from '../types';

export const ProblemSolver: React.FC = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // New problem modal / form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('Technical & Environment');
  const [severity, setSeverity] = useState('HIGH');

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/problems', {
        params: {
          search,
          severity: selectedSeverity !== 'ALL' ? selectedSeverity : undefined,
          status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        },
      });
      if (res.problems) setProblems(res.problems);
    } catch (err) {
      console.warn('Using local fallback problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, selectedSeverity, selectedStatus]);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/problems', {
        title,
        description,
        categoryName,
        severity,
        status: 'OPEN',
      });
      if (res.problem) {
        setProblems([res.problem, ...problems]);
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-slate-900 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Root Cause Analysis System</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Problem Solver & Blockers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Diagnose technical blockers, analyze root causes, generate step-by-step solutions, and save to Knowledge Base.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems by title, symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="SOLUTION_FOUND">Solution Found</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.map((problem) => {
          const isResolved = problem.status === 'RESOLVED';
          const isCritical = problem.severity === 'CRITICAL';

          return (
            <div
              key={problem.id}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-200 space-y-3 ${
                isCritical
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : isResolved
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {problem.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {problem.categoryName}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">Attempts: <strong className="text-slate-200">{problem.attempts}</strong></span>
                  <span className={`font-bold ${isResolved ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {problem.status}
                  </span>
                </div>
              </div>

              <div>
                <h3
                  onClick={() => navigate(`/problems/${problem.id}`)}
                  className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer transition-colors"
                >
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{problem.description}</p>
              </div>

              {/* AI Best Solution Snippet if available */}
              {problem.aiBestSolution && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs space-y-1">
                  <div className="flex items-center space-x-1 text-indigo-300 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Recommended Solution:</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{problem.aiBestSolution}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Reported: {new Date(problem.date || problem.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => navigate(`/problems/${problem.id}`)}
                  className="gradient-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Analyze & View RCA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Problem Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Report New Problem / Blocker
            </h2>

            <form onSubmit={handleCreateProblem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. PyTorch RuntimeError CUDA kernel error"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description & Symptoms</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste error logs, exact stack trace, or failure symptoms..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Technical & Environment">Technical & Environment</option>
                    <option value="Database & Backend">Database & Backend</option>
                    <option value="UI & Frontend">UI & Frontend</option>
                    <option value="AI & Model Training">AI & Model Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Submit & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
