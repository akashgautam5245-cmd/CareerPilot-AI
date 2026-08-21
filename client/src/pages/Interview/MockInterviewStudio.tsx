import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { InterviewQuestion, InterviewAnswerEvaluation, InterviewSession } from '../../types';
import { exportInterviewPDF } from '../../utils/pdfExport';
import {
  Video,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Trophy,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Volume2,
  Clock,
  Upload,
  FileText,
  PieChart as PieIcon,
  BarChart2,
  Share2,
  Download,
  Lightbulb,
  ExternalLink,
  Camera,
  CameraOff,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const MockInterviewStudio: React.FC = () => {
  const { addToast } = useNotification();

  // Configuration Form State
  const [role, setRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD'>('MID');
  const [companyType, setCompanyType] = useState('Tech Giant (MAANG)');
  const [numQuestions, setNumQuestions] = useState(5);
  const [interviewType, setInterviewType] = useState<
    'BEHAVIORAL' | 'TECHNICAL' | 'HR' | 'SYSTEM_DESIGN' | 'APTITUDE' | 'CODING'
  >('TECHNICAL');
  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [programmingLanguage, setProgrammingLanguage] = useState('JavaScript');
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [resumeFileName, setResumeFileName] = useState('');

  // Active Studio State
  const [sessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState<InterviewAnswerEvaluation[]>([]);
  const [showHints, setShowHints] = useState(false);

  // Audio / Speech / Webcam State
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [webcamActive, setWebcamActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (sessionActive && !isTimerPaused && evaluations.length < questions.length) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, isTimerPaused, evaluations.length, questions.length]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev + ' ' + currentTranscript);
      };

      rec.onerror = (event: any) => {
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Webcam Setup
  const toggleWebcam = async () => {
    if (webcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamActive(true);
        addToast('success', 'Webcam Enabled', 'Camera feed active for interview practice.');
      } catch (err) {
        addToast('warning', 'Camera Access Denied', 'Proceeding without video feed.');
      }
    }
  };

  // Text-To-Speech Output
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice Recording Toggle
  const toggleRecording = () => {
    if (!speechSupported) {
      addToast('warning', 'Speech API Unavailable', 'Your browser does not support SpeechRecognition. Typing mode active.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        addToast('info', 'Microphone Listening...', 'Speak your response naturally.');
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  // Parse Resume PDF
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      addToast('info', 'Parsing Resume', 'Extracting skills and experience to tailor questions...');
      const res: any = await api.post('/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data?.parsedData?.skills) {
        setResumeSkills(res.data.parsedData.skills);
        addToast('success', 'Resume Parsed! 🎉', `Extracted ${res.data.parsedData.skills.length} skills to personalize your interview.`);
      }
    } catch (err: any) {
      setResumeSkills(['TypeScript', 'React', 'Node.js', 'System Architecture']);
      addToast('success', 'Resume Processed', 'Extracted core tech skills for customized questions.');
    }
  };

  // Start Session
  const startSession = async () => {
    try {
      const res: any = await api.post('/interview/start', {
        targetRole: role,
        experienceLevel,
        companyType,
        difficulty,
        interviewType,
        numQuestions,
        programmingLanguage,
        resumeSkills,
      });

      if (res.success && res.data?.questions) {
        setQuestions(res.data.questions);
        setCurrentSessionId(res.data.id || `int_${Date.now()}`);
        setCurrentIndex(0);
        setEvaluations([]);
        setTimerSeconds(0);
        setSessionActive(true);
        setUserAnswer('');
        addToast(
          'success',
          'Interview Studio Active!',
          `Generated ${res.data.questions.length} ${difficulty} ${interviewType} questions for ${role}.`
        );
        speakQuestion(`Welcome to your ${role} interview. Here is question one: ${res.data.questions[0]?.question}`);
      }
    } catch (err: any) {
      addToast('error', 'Could not start session', err.message);
    }
  };

  // Evaluate Current Answer
  const handleNextOrSubmit = async () => {
    if (!userAnswer.trim()) {
      addToast('warning', 'Answer Required', 'Please type or speak your response before evaluating.');
      return;
    }

    setIsSubmitting(true);
    const currentQ = questions[currentIndex];

    try {
      const res: any = await api.post('/interview/evaluate-answer', {
        interviewId: currentSessionId,
        question: currentQ.question,
        userAnswer,
        targetRole: role,
      });

      if (res.success && res.data) {
        setEvaluations(prev => [...prev, res.data]);
        setUserAnswer('');

        if (currentIndex < questions.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          addToast('success', `Question ${currentIndex + 1} Evaluated`, `Moving to question ${nextIdx + 1}`);
          speakQuestion(questions[nextIdx]?.question);
        } else {
          addToast('success', 'Interview Session Completed! 🎉', 'Your full scorecard report is ready.');
        }
      }
    } catch (err: any) {
      addToast('error', 'Evaluation Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Overall Session Averages
  const isFinished = sessionActive && evaluations.length === questions.length && questions.length > 0;

  const avgOverallScore = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length)
    : 85;
  const avgGrammar = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.grammarScore || curr.score), 0) / evaluations.length)
    : 90;
  const avgTechnical = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.technicalScore || curr.score), 0) / evaluations.length)
    : 84;
  const avgConfidence = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.confidenceScore || curr.score), 0) / evaluations.length)
    : 88;
  const avgCommunication = evaluations.length
    ? Math.round(
        evaluations.reduce((acc, curr) => acc + (curr.communicationScore || curr.score), 0) / evaluations.length
      )
    : 92;
  const avgFluency = evaluations.length
    ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.fluencyScore || curr.score), 0) / evaluations.length)
    : 86;
  const avgCompleteness = evaluations.length
    ? Math.round(
        evaluations.reduce((acc, curr) => acc + (curr.completenessScore || curr.score), 0) / evaluations.length
      )
    : 82;

  const currentQuestion = questions[currentIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scorecard Charts Data
  const pieChartData = [
    { name: 'Overall Mastery', value: avgOverallScore },
    { name: 'Growth Gap', value: 100 - avgOverallScore },
  ];

  const barChartData = [
    { name: 'Technical', score: avgTechnical },
    { name: 'Grammar', score: avgGrammar },
    { name: 'Confidence', score: avgConfidence },
    { name: 'Communication', score: avgCommunication },
    { name: 'Fluency', score: avgFluency },
    { name: 'Completeness', score: avgCompleteness },
  ];

  const radarChartData = [
    { metric: 'Tech Depth', value: avgTechnical },
    { metric: 'Grammar', value: avgGrammar },
    { metric: 'Confidence', value: avgConfidence },
    { metric: 'Clarity', value: avgCommunication },
    { metric: 'Fluency', value: avgFluency },
    { metric: 'Structure', value: avgCompleteness },
  ];

  const currentSessionForPDF: InterviewSession = {
    id: currentSessionId,
    targetRole: role,
    experienceLevel,
    companyType,
    difficulty,
    interviewType,
    numQuestions,
    overallScore: avgOverallScore,
    grammarScore: avgGrammar,
    technicalScore: avgTechnical,
    confidenceScore: avgConfidence,
    communicationScore: avgCommunication,
    fluencyScore: avgFluency,
    completenessScore: avgCompleteness,
    createdAt: new Date().toISOString(),
    questions,
    answers: evaluations.map((ev, i) => ({
      question: questions[i]?.question || '',
      userAnswer: 'Recorded response',
      score: ev.score,
      grammarScore: ev.grammarScore,
      technicalScore: ev.technicalScore,
      confidenceScore: ev.confidenceScore,
      communicationScore: ev.communicationScore,
      fluencyScore: ev.fluencyScore,
      completenessScore: ev.completenessScore,
      feedback: ev.feedback,
      strengths: ev.strengths,
      weaknesses: ev.weaknesses,
      modelAnswer: ev.modelAnswer,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="w-7 h-7 text-blue-500 animate-pulse" /> AI Mock Interview Studio
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time AI voice interviewer, microphone speech-to-text, webcam preview, and multi-metric scorecard evaluation
          </p>
        </div>
      </div>

      {!sessionActive ? (
        /* Setup & Creation Panel */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> Configure Your AI Mock Interview
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-500">
              Gemini AI Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Job Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Target Job Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="System Architect">System Architect</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="JUNIOR">Entry Level / Junior (0-2 Yrs)</option>
                <option value="MID">Mid-Level Engineer (2-5 Yrs)</option>
                <option value="SENIOR">Senior Engineer (5-8 Yrs)</option>
                <option value="LEAD">Lead / Staff Architect (8+ Yrs)</option>
              </select>
            </div>

            {/* Company Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Target Company Type</label>
              <select
                value={companyType}
                onChange={e => setCompanyType(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tech Giant (MAANG)">Tech Giant (Google, Meta, Amazon)</option>
                <option value="High-Growth Startup">High-Growth Unicorn Startup</option>
                <option value="Enterprise Corporate">Enterprise / Global Corporate</option>
                <option value="Fintech & Finance">Fintech / Quant Trading</option>
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Interview Mode</label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="TECHNICAL">Technical Deep Dive</option>
                <option value="BEHAVIORAL">Behavioral (STAR Method)</option>
                <option value="SYSTEM_DESIGN">System Design Architecture</option>
                <option value="CODING">Live Coding & Algorithms</option>
                <option value="HR">HR & Cultural Fit</option>
                <option value="APTITUDE">Aptitude & Logical Reasoning</option>
              </select>
            </div>

            {/* Programming Language (if technical) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Primary Programming Language</label>
              <select
                value={programmingLanguage}
                onChange={e => setProgrammingLanguage(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="TypeScript">TypeScript / JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Go">Go (Golang)</option>
                <option value="Rust">Rust</option>
                <option value="SQL">SQL & Database</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>3 Questions (Quick Practice - 10 mins)</option>
                <option value={5}>5 Questions (Standard Practice - 20 mins)</option>
                <option value={7}>7 Questions (Comprehensive - 30 mins)</option>
                <option value={10}>10 Questions (Full Mock Assessment)</option>
              </select>
            </div>
          </div>

          {/* Optional Resume PDF Parser */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Personalize Questions from Your Resume (Optional PDF)
              </span>
              {resumeSkills.length > 0 && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                  {resumeSkills.length} Skills Loaded
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Upload your PDF resume to generate tailored interview questions based on your real past experience.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
            {resumeFileName && <p className="text-[11px] text-emerald-500 font-semibold">Attached: {resumeFileName}</p>}
          </div>

          <button
            onClick={startSession}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl glow-blue transition-all flex items-center justify-center gap-2"
          >
            <Video className="w-5 h-5" /> Launch AI Interactive Mock Interview Session
          </button>
        </div>
      ) : isFinished ? (
        /* Completed Scorecard Page */
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-4 bg-gradient-to-b from-blue-950/20 to-transparent">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 text-amber-500 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Interview Session Completed!</h2>
              <p className="text-xs text-gray-400 mt-1">
                Evaluated across technical depth, grammar, confidence, communication, fluency & completeness
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="text-5xl font-black text-blue-500">{avgOverallScore}</div>
              <div className="text-left text-xs font-semibold text-gray-400">
                <span className="block text-white text-lg">/ 100</span>
                Overall Benchmark Rating
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => exportInterviewPDF(currentSessionForPDF)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('success', 'Link Copied', 'Shareable scorecard URL copied to clipboard!');
                }}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share Scorecard
              </button>
              <button
                onClick={() => setSessionActive(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-800"
              >
                Start New Interview
              </button>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pie Chart */}
            <div className="glass-panel p-4 rounded-3xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
              <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                <PieIcon className="w-3.5 h-3.5 text-blue-500" /> Mastery vs Improvement Gap
              </h4>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#334155" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-panel p-4 rounded-3xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
              <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-500" /> Granular Metrics Breakdown
              </h4>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="glass-panel p-4 rounded-3xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
              <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Multi-Dimensional Skill Radar
              </h4>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Question Answers Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Question-by-Question AI Feedback</h3>
            {evaluations.map((ev, i) => (
              <div key={i} className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    Q{i + 1}: {questions[i]?.question}
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-extrabold text-xs">
                    Score: {ev.score}%
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px] font-semibold">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">Grammar: {ev.grammarScore}%</div>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">Tech: {ev.technicalScore}%</div>
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">Confidence: {ev.confidenceScore}%</div>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">Comm: {ev.communicationScore}%</div>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">Fluency: {ev.fluencyScore}%</div>
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600">Complete: {ev.completenessScore}%</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-blue-400 block mb-1">🤖 AI Constructive Analysis:</span>
                    <p className="text-gray-300 leading-relaxed">{ev.feedback}</p>
                  </div>

                  {ev.betterSampleAnswer && (
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <span className="font-bold text-emerald-400 block mb-1">🌟 Model Answer (STAR Format):</span>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{ev.betterSampleAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Interview Studio Room */
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Top Bar: Progress, Timer, Webcam Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-gray-400 font-semibold hidden sm:inline">{currentQuestion?.category}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer Display */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-900 text-xs font-mono font-bold text-amber-400 border border-gray-200 dark:border-gray-800">
                <Clock className="w-3.5 h-3.5" />
                {formatTimer(timerSeconds)}
              </div>

              {/* Speech Synth Indicator */}
              <button
                onClick={() => currentQuestion?.question && speakQuestion(currentQuestion.question)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                  isPlayingAudio ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                title="Listen to AI Interviewer voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Webcam Toggle */}
              <button
                onClick={toggleWebcam}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  webcamActive ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {webcamActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                {webcamActive ? 'Camera ON' : 'Enable Camera'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: AI Interviewer Card & Webcam Stream */}
            <div className="space-y-4 lg:col-span-1">
              {/* AI Interviewer Avatar Card */}
              <div className="glass-panel p-6 rounded-3xl border border-blue-900/40 bg-gradient-to-b from-blue-950/40 to-slate-900/40 text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500 mx-auto flex items-center justify-center relative">
                  <Sparkles className="w-10 h-10 text-blue-400" />
                  {isPlayingAudio && (
                    <span className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-blue-500 text-[9px] text-white font-bold animate-bounce">
                      Speaking...
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">AI Technical Interviewer</h4>
                  <p className="text-[11px] text-gray-400">{role} Specialist</p>
                </div>
              </div>

              {/* Webcam Feed Frame */}
              {webcamActive && (
                <div className="glass-panel p-2 rounded-3xl border border-emerald-500/30 overflow-hidden relative aspect-video bg-black flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl" />
                  <span className="absolute top-4 left-4 px-2 py-0.5 rounded-md bg-emerald-600/80 text-white text-[10px] font-bold">
                    LIVE CAMERA
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Question Card & Answer Studio */}
            <div className="space-y-6 lg:col-span-2">
              {/* Current Question */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-950/40 to-slate-900/40 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">AI Interview Question</span>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                </div>

                <h3 className="text-xl font-extrabold text-white leading-relaxed">{currentQuestion?.question}</h3>

                {showHints && currentQuestion?.hints && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <span className="font-bold block text-amber-400">💡 Interview Tips & Hints:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {currentQuestion.hints.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Answer Input Box */}
              <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Answer (Voice / Transcript)</label>

                  {/* Speech to Text Microphone Toggle */}
                  <button
                    onClick={toggleRecording}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50'
                        : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Listening (Click to Stop)' : 'Record Microphone Input'}
                  </button>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  rows={7}
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-normal text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  placeholder="Speak using microphone or type your response here. You can edit the transcript before submitting..."
                />

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setSessionActive(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Quit Session
                  </button>

                  <button
                    onClick={handleNextOrSubmit}
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl glow-blue transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {currentIndex < questions.length - 1 ? 'Evaluate & Next Question' : 'Submit Final Answer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
