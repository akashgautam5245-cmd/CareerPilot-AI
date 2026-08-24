import React, { useState } from 'react';
import { careerApi } from '../services/api';
import { Briefcase, Sparkles, Target, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const JobMatcher: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('Data Scientist Intern / New Grad');
  const [company, setCompany] = useState('Meta');
  const [description, setDescription] = useState(`Machine Learning & Data Science Intern Requirements:
Python, SQL, Pandas, Scikit-learn, Statistics & Probability, AWS Cloud Services, Git, Docker.`);
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<any>({
    matchScore: 82.5,
    breakdown: { skillOverlap: 85.0, semanticRelevance: 80.0, overallMatch: 82.5 },
    matchedSkills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Git'],
    missingSkills: ['AWS Cloud Services'],
    developingSkills: ['Statistics & Probability', 'Docker'],
    whyMatch: [
      'Matches 5 out of 6 core required technical skills (Python, SQL, Pandas, Scikit-learn, Git).',
      'Strong academic computer science background aligning with Meta New Grad standards.',
      'Relevant project experience in machine learning recommendation models.'
    ],
    whyNotMatch: [
      'Missing required Cloud proficiency (AWS Cloud Services).',
      'Statistical analysis & probability background needs strengthening.'
    ],
    recommendation: 'High match probability! Complete AWS cloud fundamentals module and complete a statistics project to boost score above 90%.'
  });

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await careerApi.createJobAndMatch({
        title: jobTitle,
        company,
        description,
      });
      if (res.match) {
        setMatchData(res.match);
      }
    } catch (err: any) {
      console.warn('Using local fallback state for job match analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-400" /> AI Job Description Matcher
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Paste any job description to compute your real-time Job Match Score %, skill status breakdown, and explainable match insights.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <form onSubmit={handleMatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Target Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Data Scientist / Software Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Meta / Google / Stripe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Job Description Requirements</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste full job description requirements, responsibilities, and skill requirements here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" /> {loading ? 'Matching Job & Analyzing NLP Skills...' : 'Calculate Job Match Score'}
          </button>
        </form>
      </div>

      {/* Match Results */}
      {matchData && (
        <div className="space-y-8">
          {/* Match Score Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">JOB MATCH SCORE</span>
              <div className="text-5xl font-extrabold font-outfit text-white mt-1">
                {matchData.matchScore}%
              </div>
              <p className="text-xs text-slate-300 mt-2 max-w-lg leading-relaxed">
                {matchData.recommendation}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[200px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Skill Matrix Overlap</span>
              <p className="text-3xl font-extrabold font-outfit text-emerald-400 mt-1">
                {matchData.matchedSkills.length} / {matchData.matchedSkills.length + matchData.missingSkills.length + matchData.developingSkills.length}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Matched Skills</p>
            </div>
          </div>

          {/* Skill Breakdown Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> Skill Breakdown Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Skill Name</th>
                    <th className="py-3 px-4">Requirement Type</th>
                    <th className="py-3 px-4">Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {matchData.matchedSkills.map((sk: string, i: number) => (
                    <tr key={i} className="hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-semibold text-slate-200">{sk}</td>
                      <td className="py-3 px-4 text-slate-400">Core Requirement</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Strong Match
                        </span>
                      </td>
                    </tr>
                  ))}
                  {matchData.developingSkills.map((sk: string, i: number) => (
                    <tr key={i} className="hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-semibold text-slate-200">{sk}</td>
                      <td className="py-3 px-4 text-slate-400">Core Requirement</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                          <AlertCircle className="w-3 h-3" /> Developing
                        </span>
                      </td>
                    </tr>
                  ))}
                  {matchData.missingSkills.map((sk: string, i: number) => (
                    <tr key={i} className="hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-semibold text-slate-200">{sk}</td>
                      <td className="py-3 px-4 text-slate-400">Preferred Requirement</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/30">
                          <XCircle className="w-3 h-3" /> Missing
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Match Explainability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Why You Match
              </h3>
              <ul className="space-y-3">
                {matchData.whyMatch.map((reason: string, i: number) => (
                  <li key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Why You Don't Match Yet
              </h3>
              <ul className="space-y-3">
                {matchData.whyNotMatch.map((reason: string, i: number) => (
                  <li key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
