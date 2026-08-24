import React, { useState, useEffect } from 'react';
import { Sparkles, Code, Clock, ShieldCheck, CheckCircle2, PlayCircle, Layer, ArrowUpRight, Flame, Layers } from 'lucide-react';
import { careerApi } from '../services/api';

export const ProjectRecommendations: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await careerApi.getProjectRecommendations();
      setProjects(res.projects || []);
    } catch (err) {
      console.error('Failed to load project recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      setUpdatingId(projectId);
      await careerApi.updateProjectStatus(projectId, newStatus);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
            AI Recommended Portfolio Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Projects designed by AI to resolve your specific resume weaknesses and missing target role skills.
          </p>
        </div>

        <button
          onClick={fetchProjects}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Refresh Recommendations
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <Code className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Projects Generated Yet</h3>
          <p className="text-xs text-slate-400 mb-6">Click refresh to generate AI portfolio recommendations for your role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const skillsGained = Array.isArray(project.skillsGained)
              ? project.skillsGained
              : JSON.parse(project.skillsGained || '[]');

            const techStack = Array.isArray(project.techStack)
              ? project.techStack
              : JSON.parse(project.techStack || '[]');

            const features = Array.isArray(project.features)
              ? project.features
              : JSON.parse(project.features || '[]');

            const steps = Array.isArray(project.implementationSteps)
              ? project.implementationSteps
              : JSON.parse(project.implementationSteps || '[]');

            return (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 text-pink-400" /> {project.difficulty}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {project.estimatedDuration}
                      </span>
                      <select
                        value={project.status || 'NOT_STARTED'}
                        disabled={updatingId === project.id}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 bg-slate-950 border text-slate-200 focus:outline-none ${
                          project.status === 'COMPLETED'
                            ? 'border-emerald-500/40 text-emerald-400'
                            : project.status === 'IN_PROGRESS'
                            ? 'border-amber-500/40 text-amber-400'
                            : 'border-slate-800'
                        }`}
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white font-outfit mb-2">{project.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">{project.description}</p>

                  {/* Resume Impact Alert */}
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-6 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Resume Impact:</span>
                      <span className="text-[11px] text-slate-300">{project.resumeValue}</span>
                    </div>
                  </div>

                  {/* Problem Statement & Tech Stack */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Problem Statement
                      </span>
                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {project.problemStatement}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Key Features
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Implementation Roadmap
                      </span>
                      <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                        {steps.map((s: string, i: number) => (
                          <div key={i} className="text-[11px] text-slate-400 leading-snug">
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Skills Gained: {skillsGained.slice(0, 3).join(', ')}
                  </span>
                  <button
                    onClick={() => handleStatusChange(project.id, project.status === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {project.status === 'COMPLETED' ? 'Mark Incomplete' : 'Start Project'} <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
