import React, { useEffect, useState } from 'react';
import { careerApi } from '../services/api';
import { Map, CheckCircle2, Circle, Clock, Plus, Sparkles, BookOpen, ExternalLink, Calendar } from 'lucide-react';

export const CareerRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<any>({
    title: '90-Day Data Science & ML Placement Mastery',
    targetRole: 'Data Scientist / ML Engineer',
    durationDays: 90,
    progress: 42.5,
    tasks: [
      {
        id: 'task-1',
        month: 1, week: 1,
        title: 'Master Inferential Statistics & Hypothesis Testing',
        description: 'Study z-scores, p-values, t-tests, ANOVA, and A/B testing principles using SciPy and Python.',
        category: 'Mathematics & Stats',
        resources: ['Khan Academy Statistics', 'SciPy Stats Docs', 'A/B Testing Crash Course'],
        isCompleted: true,
        priority: 'HIGH',
      },
      {
        id: 'task-2',
        month: 1, week: 2,
        title: 'Advanced SQL Window Functions & Query Optimization',
        description: 'Practice PARTITION BY, LEAD/LAG, DENSE_RANK, CTEs, and query indexing on real e-commerce data.',
        category: 'Database & SQL',
        resources: ['LeetCode SQL Study Plan', 'PostgreSQL Query Optimization Guide'],
        isCompleted: true,
        priority: 'HIGH',
      },
      {
        id: 'task-3',
        month: 1, week: 3,
        title: 'Scikit-learn Feature Engineering & Model Evaluation',
        description: 'Implement Cross-Validation, GridSearch hyperparameter tuning, ROC-AUC curves, and Confusion Matrices.',
        category: 'Machine Learning',
        resources: ['Scikit-learn Official Docs', 'Kaggle Feature Engineering Course'],
        isCompleted: false,
        priority: 'HIGH',
      },
      {
        id: 'task-4',
        month: 1, week: 4,
        title: 'Statistical Modeling Mini-Project',
        description: 'Build a Jupyter Notebook analyzing customer churn probability with statistical confidence intervals.',
        category: 'Portfolio Project',
        resources: ['GitHub Template', 'Telco Churn Dataset'],
        isCompleted: false,
        priority: 'HIGH',
      },
      {
        id: 'task-5',
        month: 2, week: 5,
        title: 'FastAPI Microservice Development for ML Models',
        description: 'Wrap your trained Scikit-learn model inside a FastAPI REST endpoint with Pydantic request validation.',
        category: 'Backend & ML',
        resources: ['FastAPI Official Guide', 'Deploying ML Models with FastAPI'],
        isCompleted: false,
        priority: 'MEDIUM',
      },
      {
        id: 'task-6',
        month: 2, week: 6,
        title: 'Docker Containerization for ML Applications',
        description: 'Write Dockerfiles, build lightweight Python images, configure docker-compose for PostgreSQL + FastAPI.',
        category: 'DevOps & Containers',
        resources: ['Docker for Beginners', 'Containerizing FastAPI Apps'],
        isCompleted: false,
        priority: 'HIGH',
      },
    ],
  });
  const [activeMonth, setActiveMonth] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  useEffect(() => {
    async function loadRoadmapData() {
      try {
        const res: any = await careerApi.getRoadmap();
        if (res.roadmap) {
          setRoadmap(res.roadmap);
        }
      } catch (err) {
        console.warn('Using local fallback state for roadmap');
      }
    }
    loadRoadmapData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      await careerApi.toggleTaskComplete(taskId);
    } catch (e) {
      // Local state update
    }
    setRoadmap((prev: any) => {
      const updatedTasks = prev.tasks.map((t: any) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      const completedCount = updatedTasks.filter((t: any) => t.isCompleted).length;
      const newProgress = Math.round((completedCount / Math.max(1, updatedTasks.length)) * 100);
      return { ...prev, tasks: updatedTasks, progress: newProgress };
    });
  };

  const handleAddCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    const newTask = {
      id: 'custom-' + Date.now(),
      month: activeMonth,
      week: 4,
      title: customTitle,
      description: customDesc || 'Custom self-directed learning task.',
      category: 'Custom Goal',
      resources: ['Custom Resources'],
      isCompleted: false,
      priority: 'MEDIUM',
    };

    setRoadmap((prev: any) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    setCustomTitle('');
    setCustomDesc('');
    setShowAddModal(false);
  };

  const monthTasks = roadmap.tasks.filter((t: any) => t.month === activeMonth);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-400" /> Personalized 90-Day Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structured weekly roadmap designed to close your target skill gaps for <span className="text-indigo-400 font-semibold">{roadmap.targetRole}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="gradient-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Custom Task
        </button>
      </div>

      {/* Progress Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">ROADMAP PROGRESS</span>
          <div className="text-4xl font-extrabold font-outfit text-white mt-1">
            {roadmap.progress}% <span className="text-lg text-slate-400 font-normal">Completed</span>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            {roadmap.tasks.filter((t: any) => t.isCompleted).length} of {roadmap.tasks.length} milestones finished. Keep up the great pace!
          </p>
        </div>

        <div className="w-full md:w-64 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Overall Milestone</span>
            <span className="text-indigo-400">{roadmap.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${roadmap.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Month Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        {[1, 2, 3].map((month) => (
          <button
            key={month}
            onClick={() => setActiveMonth(month)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMonth === month
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Month {month} Goals
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {monthTasks.map((task: any, idx: number) => (
          <div
            key={task.id || idx}
            className={`p-6 rounded-2xl bg-slate-900 border transition-all shadow-lg ${
              task.isCompleted ? 'border-emerald-500/30 opacity-80' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Week {task.week}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{task.category}</span>
                  </div>

                  <h3 className={`text-sm font-bold text-slate-100 ${task.isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{task.description}</p>

                  {/* Resource Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Resources:
                    </span>
                    {task.resources.map((res: string, rIdx: number) => (
                      <span
                        key={rIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium flex items-center gap-1 hover:border-indigo-500/40 cursor-pointer"
                      >
                        {res} <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold font-outfit text-white mb-4">Add Custom Roadmap Task</h3>
            <form onSubmit={handleAddCustomTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Build A/B Testing Jupyter Notebook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description & Goals</label>
                <textarea
                  rows={3}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Describe goal and completion criteria..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 gradient-btn py-2.5 rounded-xl font-bold text-xs">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
