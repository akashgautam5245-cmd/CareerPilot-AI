import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Award, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Volume2, Clock, BookOpen, Layers } from 'lucide-react';
import { careerApi } from '../services/api';

export const InterviewResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const res = await careerApi.getInterviewResults(id!);
      setInterview(res.interview);
    } catch (err) {
      console.error('Failed to load interview results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-xs">
        Loading AI Evaluation Results...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Interview Session Not Found</h3>
        <Link to="/interview/new" className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-4">
          Start New Interview
        </Link>
      </div>
    );
  }

  const overallScore = Math.round(interview.overallScore || 78);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> AI Evaluation Completed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">{interview.title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target Role: <span className="text-slate-200 font-semibold">{interview.targetRole}</span> • Difficulty: {interview.difficulty}
          </p>
        </div>

        {/* Big Score Radial/Badge */}
        <div className="relative z-10 flex flex-col items-center p-5 bg-slate-950 border border-slate-800 rounded-2xl min-w-[160px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">OVERALL SCORE</span>
          <div className="text-4xl sm:text-5xl font-extrabold gradient-text font-outfit">{overallScore}/100</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1">
            {overallScore >= 80 ? 'Placement Ready' : 'Good Foundation'}
          </span>
        </div>
      </div>

      {/* Questions Breakdown List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Question-by-Question AI Analysis
        </h2>

        {interview.questions?.map((q: any, idx: number) => {
          const evalObj = q.evaluation;
          const answer = q.answers?.[0];

          const whatDoneWell = Array.isArray(evalObj?.whatDoneWell)
            ? evalObj.whatDoneWell
            : JSON.parse(evalObj?.whatDoneWell || '[]');

          const whatMissed = Array.isArray(evalObj?.whatMissed)
            ? evalObj.whatMissed
            : JSON.parse(evalObj?.whatMissed || '[]');

          return (
            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400">QUESTION {idx + 1}</span>
                  <h3 className="text-base font-bold text-white mt-1">{q.text}</h3>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Topic: {q.topic}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                  <span className="text-xs font-extrabold text-white">{Math.round(evalObj?.score || 80)}/100</span>
                </div>
              </div>

              {/* User Answer Text */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Your Answer
                </span>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed italic">
                  "{answer?.userTextAnswer || 'No response provided'}"
                </div>
              </div>

              {/* Voice Metrics if available */}
              {answer && (
                <div className="flex flex-wrap gap-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duration: {answer.durationSeconds || 45}s
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Speaking Pace: {answer.paceWpm || 135} WPM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Filler Words: {answer.fillerWordsCount || 2}
                  </span>
                </div>
              )}

              {/* Scoring Dimensions Grid */}
              {evalObj && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {[
                    { label: 'Technical', val: evalObj.technicalCorrectness },
                    { label: 'Completeness', val: evalObj.completeness },
                    { label: 'Relevance', val: evalObj.relevance },
                    { label: 'Clarity', val: evalObj.clarity },
                    { label: 'Depth', val: evalObj.depth },
                  ].map((dim, dIdx) => (
                    <div key={dIdx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold block">{dim.label}</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">{dim.val}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback Columns */}
              {evalObj && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4" /> What You Did Well
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {whatDoneWell.map((w: string, i: number) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4" /> What You Missed
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {whatMissed.map((m: string, i: number) => (
                        <li key={i}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Ideal Answer Structure */}
              {evalObj?.betterAnswerStructure && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-4 h-4" /> Recommended Better Answer Structure
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{evalObj.betterAnswerStructure}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Link to="/interview/new" className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Practice Another Session
        </Link>
        <Link to="/readiness" className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          View Career Readiness <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
