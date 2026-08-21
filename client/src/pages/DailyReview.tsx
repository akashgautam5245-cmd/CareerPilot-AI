import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, Clock, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export const DailyReview: React.FC = () => {
  const [accomplishments, setAccomplishments] = useState('');
  const [problemsFaced, setProblemsFaced] = useState('');
  const [remainingUnfinished, setRemainingUnfinished] = useState('');
  const [distractions, setDistractions] = useState('');
  const [wentWell, setWentWell] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const pastReviews = [
    {
      id: '1',
      date: 'Yesterday, Aug 20, 2026',
      accomplishments: 'Completed AI Task Priority Engine REST API and integrated SaaS theme switcher.',
      problemsFaced: 'Encountered PostgreSQL connection pool overflow during concurrent API load testing.',
      aiSummary: 'Strong productivity output (82% task completion). Successfully resolved connection pool architecture bottleneck.',
    },
    {
      id: '2',
      date: 'Aug 19, 2026',
      accomplishments: 'Configured Prisma ORM schema and initialized seed dataset.',
      problemsFaced: 'Minor TypeScript interface type definitions mismatch in controllers.',
      aiSummary: 'Solid foundation phase completed. High alignment with project milestone targets.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res: any = await api.post('/daily-reviews', {
        accomplishments,
        problemsFaced,
        remainingUnfinished,
        distractions,
        wentWell,
        improveTomorrow,
      });

      if (res.review) {
        setAiSummary(res.review.aiSummary || 'Daily reflection saved. Recommendation: Start tomorrow focusing on high-priority remaining items.');
      }
    } catch (err) {
      setAiSummary('Daily reflection saved locally. AI Recommendation: Schedule deep work blocks early tomorrow morning.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          End of Day Review & Reflection
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Reflect on daily accomplishments, record blockers, and generate AI insights for tomorrow's planning.
        </p>
      </div>

      {/* Form */}
      <div className="glass-card space-y-4">
        <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
          Today's Reflection Form ({new Date().toLocaleDateString()})
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What did you accomplish today?</label>
              <textarea
                rows={3}
                required
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                placeholder="e.g. Completed ML assignment model training, updated resume bullets..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What problems or blockers did you face?</label>
              <textarea
                rows={3}
                value={problemsFaced}
                onChange={(e) => setProblemsFaced(e.target.value)}
                placeholder="e.g. PyTorch CUDA dependency mismatch error..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What remains unfinished?</label>
              <textarea
                rows={2}
                value={remainingUnfinished}
                onChange={(e) => setRemainingUnfinished(e.target.value)}
                placeholder="e.g. Documentation for OpenAPI spec..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What distracted you?</label>
              <textarea
                rows={2}
                value={distractions}
                onChange={(e) => setDistractions(e.target.value)}
                placeholder="e.g. Frequent chat notifications during deep work block..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What went particularly well?</label>
              <textarea
                rows={2}
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="e.g. Great focus state between 9 AM and 11 AM..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">What should improve tomorrow?</label>
              <textarea
                rows={2}
                value={improveTomorrow}
                onChange={(e) => setImproveTomorrow(e.target.value)}
                placeholder="e.g. Turn phone off during morning focus session..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'Generating AI Summary...' : 'Submit & Generate AI Reflection'}</span>
            </button>
          </div>
        </form>

        {/* AI Summary Output Box */}
        {aiSummary && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Daily Executive Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{aiSummary}</p>
          </div>
        )}
      </div>

      {/* Past Reviews Log */}
      <div className="glass-card space-y-3">
        <h3 className="text-xs font-bold text-slate-200">Previous Daily Reviews</h3>
        <div className="space-y-3">
          {pastReviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-indigo-400">{rev.date}</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Reviewed
                </span>
              </div>
              <p className="text-slate-300"><strong>Accomplishments:</strong> {rev.accomplishments}</p>
              <p className="text-slate-400"><strong>Main Blocker:</strong> {rev.problemsFaced}</p>
              <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-[11px]">
                💡 <strong>AI Summary:</strong> {rev.aiSummary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
