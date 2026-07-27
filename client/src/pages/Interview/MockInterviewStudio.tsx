import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { InterviewQuestion, InterviewAnswerEvaluation } from '../../types';
import { Video, Mic, Send, Sparkles, Trophy, CheckCircle, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';

export const MockInterviewStudio: React.FC = () => {
  const { addToast } = useNotification();
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [interviewType, setInterviewType] = useState<'BEHAVIORAL' | 'TECHNICAL' | 'HR' | 'SYSTEM_DESIGN'>('TECHNICAL');

  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState<InterviewAnswerEvaluation[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startSession = async () => {
    try {
      const res: any = await api.post('/interview/start', {
        targetRole: role,
        difficulty,
        interviewType,
      });
      if (res.success && res.data?.questions) {
        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setEvaluations([]);
        setSessionActive(true);
        addToast('success', 'Interview Started!', `Generated 5 ${difficulty} ${interviewType} questions.`);
      }
    } catch (err: any) {
      addToast('error', 'Could not start interview', err.message);
    }
  };

  const handleNextOrSubmit = async () => {
    if (!userAnswer.trim()) {
      addToast('warning', 'Answer Required', 'Please enter your response before submitting.');
      return;
    }

    setIsSubmitting(true);
    const currentQ = questions[currentIndex];

    try {
      const res: any = await api.post('/interview/evaluate-answer', {
        interviewId: 'int_session',
        question: currentQ.question,
        userAnswer,
        targetRole: role,
      });

      if (res.success && res.data) {
        setEvaluations(prev => [...prev, res.data]);
        setUserAnswer('');

        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          addToast('success', 'Answer Evaluated', 'Moving to question ' + (currentIndex + 2));
        } else {
          addToast('success', 'Interview Completed! 🎉', 'Your complete score report is ready.');
        }
      }
    } catch (err: any) {
      addToast('error', 'Evaluation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isFinished = sessionActive && evaluations.length === questions.length && questions.length > 0;

  const avgOverallScore = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Video className="w-7 h-7 text-blue-500" /> AI Mock Interview Studio
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Real-time AI voice/text mock interviews with confidence, grammar, communication & technical scoring
        </p>
      </div>

      {!sessionActive ? (
        /* Configuration Form */
        <div className="max-w-2xl glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" /> Configure Your AI Interview Session
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Target Job Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="System Architect">System Architect</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={e => setInterviewType(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <option value="TECHNICAL">Technical Deep Dive</option>
                  <option value="BEHAVIORAL">Behavioral (STAR)</option>
                  <option value="SYSTEM_DESIGN">System Design</option>
                  <option value="HR">HR & Cultural Fit</option>
                </select>
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl glow-blue transition-all flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" /> Begin AI Mock Interview Session
            </button>
          </div>
        </div>
      ) : isFinished ? (
        /* Final Score Report */
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 mx-auto flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Interview Session Completed!</h2>
            <div className="text-5xl font-black text-blue-500 my-3">{avgOverallScore} / 100</div>
            <p className="text-xs text-gray-400">Average Performance Rating for {role}</p>

            <button
              onClick={() => setSessionActive(false)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Start New Interview
            </button>
          </div>

          <div className="space-y-4">
            {evaluations.map((ev, i) => (
              <div key={i} className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  Q{i + 1}: {questions[i]?.question}
                </h4>
                <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold block text-gray-500 mb-1">Your Answer:</span>
                  {evaluations[i]?.feedback ? 'Answer recorded' : ''}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">Overall: {ev.score}%</div>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">Technical: {ev.technicalScore}%</div>
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">Confidence: {ev.confidenceScore}%</div>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">Communication: {ev.communicationScore}%</div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200">
                  <span className="font-semibold text-blue-300 block mb-1">AI Feedback:</span>
                  {ev.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Question & Answer Studio */
        <div className="space-y-6">
          {/* Question Box */}
          <div className="glass-panel p-6 rounded-3xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-950/30 to-slate-900/40">
            <div className="flex justify-between items-center mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-gray-400 font-medium">{currentQuestion?.category}</span>
            </div>

            <h3 className="text-lg font-extrabold text-white leading-relaxed">{currentQuestion?.question}</h3>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400">💡 Hints:</span>
              {currentQuestion?.hints.map((h, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-gray-800 text-gray-300">
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Answer Input Box */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Response</label>
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setUserAnswer('In my previous project, I solved this by implementing asynchronous processing and caching...');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {isRecording ? 'Listening (Voice input)...' : 'Use Speech-to-Text'}
              </button>
            </div>

            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
              placeholder="Type your response here or click Speech-to-Text..."
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setSessionActive(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Quit Session
              </button>
              <button
                onClick={handleNextOrSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg glow-blue transition-all flex items-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {currentIndex < questions.length - 1 ? 'Evaluate & Next Question' : 'Submit Final Answer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
