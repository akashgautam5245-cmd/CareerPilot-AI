import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { InterviewSession } from '../../types';
import { exportInterviewPDF } from '../../utils/pdfExport';
import {
  History,
  Search,
  Trash2,
  Download,
  Eye,
  Award,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  X,
  ExternalLink,
  Share2,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
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

export const InterviewHistory: React.FC = () => {
  const { addToast } = useNotification();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res: any = await api.get('/interview/interviews');
      if (res.success && res.data) {
        setInterviews(res.data);
      }
    } catch (err: any) {
      addToast('error', 'Failed to load history', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this interview record?')) return;
    try {
      await api.delete(`/interview/${id}`);
      setInterviews(prev => prev.filter(item => item.id !== id));
      if (selectedSession?.id === id) setSelectedSession(null);
      addToast('success', 'Interview Removed', 'History record deleted successfully.');
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    }
  };

  const filteredInterviews = interviews.filter(item => {
    const matchesSearch =
      item.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.interviewType && item.interviewType.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || item.interviewType === filterType;
    return matchesSearch && matchesType;
  });

  const getScoreColor = (score: number = 0) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-red-500 bg-red-500/10 border-red-500/30';
  };

  // Scorecard Chart Data Helpers
  const getPieData = (session: InterviewSession) => {
    const score = session.overallScore || 80;
    return [
      { name: 'Mastered Score', value: score },
      { name: 'Improvement Gap', value: 100 - score },
    ];
  };

  const getBarData = (session: InterviewSession) => [
    { name: 'Technical', score: session.technicalScore || 84 },
    { name: 'Grammar', score: session.grammarScore || 90 },
    { name: 'Confidence', score: session.confidenceScore || 88 },
    { name: 'Communication', score: session.communicationScore || 92 },
    { name: 'Fluency', score: session.fluencyScore || 86 },
    { name: 'Completeness', score: session.completenessScore || 82 },
  ];

  const getRadarData = (session: InterviewSession) => [
    { metric: 'Tech Depth', value: session.technicalScore || 84 },
    { metric: 'Grammar', value: session.grammarScore || 90 },
    { metric: 'Confidence', value: session.confidenceScore || 88 },
    { metric: 'Clarity', value: session.communicationScore || 92 },
    { metric: 'Fluency', value: session.fluencyScore || 86 },
    { metric: 'Structure', value: session.completenessScore || 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-7 h-7 text-blue-500" /> AI Interview History & Scorecards
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review past mock interview performances, analyze multi-chart scorecards, and download PDF reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-xs">
            Total Sessions: {interviews.length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job role or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-900 dark:text-white w-full sm:w-auto"
          >
            <option value="ALL">All Types</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BEHAVIORAL">Behavioral</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="glass-panel p-6 rounded-3xl animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/2" />
              <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-gray-200 dark:border-gray-800">
          <History className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Interview History Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            You haven't completed any mock interviews matching your criteria yet. Launch a session to start tracking your performance!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInterviews.map(session => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full">
                    {session.interviewType || 'TECHNICAL'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {session.targetRole}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{session.difficulty || 'Intermediate'}</span>
                  </div>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center ${getScoreColor(
                    session.overallScore
                  )}`}
                >
                  <span className="text-lg font-black">{session.overallScore || 80}</span>
                  <span className="text-[9px] uppercase font-bold">Score</span>
                </div>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/60 text-center text-xs">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60">
                  <span className="block text-[10px] text-gray-400">Technical</span>
                  <span className="font-bold text-blue-500">{session.technicalScore || 84}%</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60">
                  <span className="block text-[10px] text-gray-400">Communication</span>
                  <span className="font-bold text-emerald-500">{session.communicationScore || 90}%</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900/60">
                  <span className="block text-[10px] text-gray-400">Confidence</span>
                  <span className="font-bold text-amber-500">{session.confidenceScore || 88}%</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-2">
                <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View Scorecard Report
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      exportInterviewPDF(session);
                      addToast('success', 'PDF Exported', 'Downloaded scorecard report.');
                    }}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => handleDelete(session.id, e)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete Interview"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Scorecard Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 bg-white dark:bg-gray-950 relative">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-extrabold text-xs tracking-wider">
                  {selectedSession.interviewType} INTERVIEW SCORECARD
                </span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {selectedSession.targetRole} Report
                </h2>
                <p className="text-xs text-gray-500">
                  Completed on {new Date(selectedSession.createdAt).toLocaleDateString()} • {selectedSession.difficulty} Level
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    exportInterviewPDF(selectedSession);
                    addToast('success', 'PDF Exported', 'Scorecard report saved.');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Download className="w-4 h-4" /> Export PDF Report
                </button>
              </div>
            </div>

            {/* Overall Score Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border-4 border-blue-500 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-blue-500">{selectedSession.overallScore || 85}</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400">/ 100</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Overall Performance Rating</h4>
                <p className="text-xs text-gray-500">Ready for tech industry benchmarking</p>
              </div>

              {/* Pie Chart: Score vs Gap */}
              <div className="glass-panel p-4 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-gray-400 mb-2">Mastery vs Gap Breakdown</h4>
                <div className="w-full h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData(selectedSession)}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#334155" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart: Skill Spider Matrix */}
              <div className="glass-panel p-4 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-gray-400 mb-2">Multi-Dimensional Skill Matrix</h4>
                <div className="w-full h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(selectedSession)}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bar Chart: Granular Scores */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Granular Metrics Analysis
              </h4>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBarData(selectedSession)}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Key Strengths
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                  <li>• High structural clarity and logical approach.</li>
                  <li>• Strong domain knowledge and terminology precision.</li>
                  <li>• Dynamic communication flow with minimal hesitation.</li>
                </ul>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Areas for Growth
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                  <li>• Incorporate explicit quantitative metrics (e.g. latency, throughput).</li>
                  <li>• Elaborate on alternative trade-offs considered.</li>
                  <li>• Address edge-case error recovery scenarios.</li>
                </ul>
              </div>
            </div>

            {/* Recommended Learning Resources */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Recommended Study & Practice Resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(selectedSession.recommendedResources || [
                  { title: 'System Architecture Guide', type: 'article', url: 'https://roadmap.sh' },
                  { title: 'STAR Method Interview Prep', type: 'course', url: 'https://leetcode.com' },
                  { title: 'Mock Coding Challenges', type: 'practice', url: 'https://github.com' },
                ]).map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-900 hover:bg-blue-500/10 border border-gray-200 dark:border-gray-800 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="block font-semibold text-gray-900 dark:text-white">{res.title}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{res.type}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
