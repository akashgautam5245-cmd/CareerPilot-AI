import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { SkillGapRoadmap } from '../../types';
import { Target, CheckCircle2, AlertCircle, Clock, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

export const SkillGapAnalyzer: React.FC = () => {
  const { addToast } = useNotification();
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SkillGapRoadmap | null>(null);

  const fetchSkillGap = async (role: string) => {
    setLoading(true);
    try {
      const res: any = await api.post('/skillgap/analyze', { targetRole: role });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      addToast('error', 'Skill Gap Analysis Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(targetRole);
  }, [targetRole]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-blue-500" /> Skill Gap & Career Roadmap Visualizer
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Compare your resume skills against target industry benchmarks and generate step-by-step learning roadmaps
          </p>
        </div>

        {/* Role Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">Target Role:</span>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-900 dark:text-white"
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="Cyber Security Engineer">Cyber Security Engineer</option>
          </select>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Matched vs Missing Skills Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Matched Skills ({data.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.matchedSkills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-900">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Missing Required Skills ({data.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.missingSkills.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-900">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Learning Roadmap */}
          <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" /> Customized Learning Roadmap
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Estimated time to complete: {data.estimatedLearningTimeWeeks} Weeks</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                {data.roadmap.length} Key Phases
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-500/30">
              {data.roadmap.map((item, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                  <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.phase}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600">
                        {item.priority} PRIORITY
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Estimated effort: {item.estimatedHours} Hours
                    </p>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-[11px] font-semibold text-gray-400 block mb-1">Target Skills to Learn:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skillsToLearn.map(sk => (
                          <span key={sk} className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
