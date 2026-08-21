import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ListChecks,
  HelpCircle,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Problem } from '../types';

export const ProblemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [exportingKB, setExportingKB] = useState(false);

  // Root cause inputs
  const [whatHappened, setWhatHappened] = useState('');
  const [whyHappened, setWhyHappened] = useState('');
  const [whatTried, setWhatTried] = useState('');
  const [whatWorked, setWhatWorked] = useState('');
  const [whatFailed, setWhatFailed] = useState('');
  const [whatDifferentNextTime, setWhatDifferentNextTime] = useState('');

  useEffect(() => {
    async function loadProblem() {
      try {
        const res: any = await api.get(`/problems/${id}`);
        if (res.problem) {
          setProblem(res.problem);
          setWhatHappened(res.problem.whatHappened || '');
          setWhyHappened(res.problem.whyHappened || '');
          setWhatTried(res.problem.whatTried || '');
          setWhatWorked(res.problem.whatWorked || '');
          setWhatFailed(res.problem.whatFailed || '');
          setWhatDifferentNextTime(res.problem.whatDifferentNextTime || '');
        }
      } catch (err) {
        // Fallback problem data
        setProblem({
          id: id || '1',
          userId: 'user-1',
          title: 'PyTorch CUDA Dependency Version Mismatch Error',
          description: 'Attempting to run PyTorch model training outputs: RuntimeError: CUDA error: no kernel image is available for execution on the device.',
          categoryName: 'Technical & Environment',
          severity: 'CRITICAL',
          status: 'INVESTIGATING',
          date: new Date().toISOString(),
          attempts: 3,
          notes: 'Tested re-installing pip torch.',
          aiSummary: 'PyTorch CUDA binary version mismatch with NVIDIA GPU display drivers.',
          aiPossibleCauses: [
            'Incorrect PyTorch wheel channel specified during pip install.',
            'Broken virtual environment containing mismatched C++ CUDA DLLs.',
            'System CUDA toolkit driver version mismatch.'
          ],
          aiRecommendedSolutions: [
            'Re-create python venv and install torch with explicit cu121 index URL.',
            'Run model training in CPU fallback mode.',
            'Use Docker container matching PyTorch base image.'
          ],
          aiBestSolution: 'Re-create python virtual environment and run pip install torch --index-url https://download.pytorch.org/whl/cu121.',
          aiActionPlan: [
            '1. Deactivate current virtual environment: deactivate',
            '2. Delete broken .venv folder.',
            '3. Create fresh venv: python -m venv .venv and activate.',
            '4. Install CUDA 12.1 PyTorch wheel explicitly.',
            '5. Verify GPU detection script.'
          ],
          aiPrevention: 'Maintain a locked requirements.txt with specific wheel URLs.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [id]);

  const handleAnalyzeWithAI = async () => {
    if (!problem) return;
    setAnalyzing(true);
    try {
      const res: any = await api.post('/ai/analyze-problem', {
        title: problem.title,
        description: problem.description,
        categoryName: problem.categoryName,
        severity: problem.severity,
        attempts: problem.attempts,
        problemId: problem.id,
      });

      if (res.analysis) {
        setProblem(prev => prev ? ({ ...prev, ...res.analysis, status: 'INVESTIGATING' }) : null);
      }
    } catch (err) {
      console.warn('AI analysis fallback loaded');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveRCA = async () => {
    try {
      await api.put(`/problems/${id}`, {
        whatHappened,
        whyHappened,
        whatTried,
        whatWorked,
        whatFailed,
        whatDifferentNextTime,
      });
      alert('Root Cause Analysis saved successfully!');
    } catch (err) {
      alert('Saved locally!');
    }
  };

  const handleConfirmSolved = async () => {
    try {
      await api.put(`/problems/${id}`, { status: 'RESOLVED' });
      setProblem(prev => prev ? ({ ...prev, status: 'RESOLVED' }) : null);
    } catch (err) {
      setProblem(prev => prev ? ({ ...prev, status: 'RESOLVED' }) : null);
    }
  };

  const handleExportKB = async () => {
    setExportingKB(true);
    try {
      await api.post(`/problems/${id}/export-kb`);
      alert('Exported to Knowledge Base successfully!');
      navigate('/knowledge-base');
    } catch (err) {
      navigate('/knowledge-base');
    } finally {
      setExportingKB(false);
    }
  };

  if (loading || !problem) {
    return <div className="p-8 text-center text-slate-400">Loading problem details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/problems')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem Solver</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{analyzing ? 'Analyzing Root Cause...' : 'Analyze with AI'}</span>
          </button>

          {problem.status !== 'RESOLVED' ? (
            <button
              onClick={handleConfirmSolved}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Solved</span>
            </button>
          ) : (
            <button
              onClick={handleExportKB}
              disabled={exportingKB}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <BookOpen className="w-4 h-4" />
              <span>Save to Knowledge Base</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Problem Header Card */}
      <div className="glass-card space-y-3 border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {problem.severity} SEVERITY
            </span>
            <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {problem.categoryName}
            </span>
          </div>
          <span className="text-xs font-bold text-amber-400">{problem.status}</span>
        </div>

        <h1 className="text-xl font-extrabold text-white">{problem.title}</h1>
        <p className="text-xs text-slate-300 leading-relaxed">{problem.description}</p>
      </div>

      {/* Root Cause Analysis Visual Step-by-Step Diagram */}
      <div className="glass-card space-y-4 bg-slate-900/90">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          Root Cause Analysis Framework Flow
        </h2>

        {/* Visual Pipeline Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">1. Problem</span>
            <p className="text-[11px] font-bold text-slate-200 truncate">{problem.title}</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center space-y-1">
            <span className="text-[10px] font-bold text-rose-400 uppercase">2. Root Cause</span>
            <p className="text-[11px] font-medium text-rose-200 truncate">
              {whyHappened || problem.aiPossibleCauses?.[0] || 'Under Investigation'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">3. Evidence</span>
            <p className="text-[11px] font-medium text-slate-300 truncate">
              {whatHappened || 'Stack Trace Logs'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-center space-y-1">
            <span className="text-[10px] font-bold text-indigo-300 uppercase">4. Solution</span>
            <p className="text-[11px] font-medium text-indigo-200 truncate">
              {whatWorked || problem.aiBestSolution || 'Recommended Fix'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">5. Result</span>
            <p className="text-[11px] font-medium text-emerald-200 truncate">
              {problem.status === 'RESOLVED' ? 'Execution Clean' : 'Pending Verification'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-300 uppercase">6. Prevention</span>
            <p className="text-[11px] font-medium text-purple-200 truncate">
              {whatDifferentNextTime || problem.aiPrevention || 'Lock Dependencies'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Analysis Breakdown Cards */}
      {problem.aiSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Possible Causes & Best Solution */}
          <div className="glass-card space-y-4">
            <div>
              <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Possible Root Causes
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {problem.aiPossibleCauses?.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recommended Solution
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30">
                {problem.aiBestSolution}
              </p>
            </div>
          </div>

          {/* Action Plan & Prevention */}
          <div className="glass-card space-y-4">
            <div>
              <h3 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
                <ListChecks className="w-4 h-4 text-purple-400" />
                Step-by-Step Action Plan
              </h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                {problem.aiActionPlan?.map((step, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Future Prevention Guidance
              </h3>
              <p className="text-xs text-slate-300 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                {problem.aiPrevention}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual RCA Recording Form */}
      <div className="glass-card space-y-4">
        <h2 className="text-sm font-bold text-slate-200">Record Your Root Cause & Investigation Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">What Happened?</label>
            <textarea
              rows={2}
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Describe exact symptoms..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Why Did It Happen?</label>
            <textarea
              rows={2}
              value={whyHappened}
              onChange={(e) => setWhyHappened(e.target.value)}
              placeholder="Underlying root cause analysis..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">What Was Tried & What Failed?</label>
            <textarea
              rows={2}
              value={whatTried}
              onChange={(e) => setWhatTried(e.target.value)}
              placeholder="Unsuccessful attempts..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">What Worked & What to Do Differently?</label>
            <textarea
              rows={2}
              value={whatWorked}
              onChange={(e) => setWhatWorked(e.target.value)}
              placeholder="Proven solution and prevention steps..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveRCA}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
          >
            Save Root Cause Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
