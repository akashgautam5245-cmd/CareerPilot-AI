import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { ATSReport as ATSReportType } from '../../types';
import {
  Upload,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Download,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import jsPDF from 'jspdf';

export const ResumeUpload: React.FC = () => {
  const { addToast } = useNotification();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSReportType | null>({
    overallScore: 88,
    formattingScore: 92,
    keywordScore: 84,
    grammarScore: 95,
    sectionOrderScore: 90,
    softSkillsScore: 86,
    hardSkillsScore: 89,
    missingKeywords: ['Docker', 'CI/CD Pipelines', 'System Architecture', 'GraphQL', 'Unit Testing (Jest/Vitest)'],
    missingSkills: ['Kubernetes', 'Redis', 'Microservices', 'AWS Cloud Practitioner'],
    weakSections: ['Quantifiable Metrics in Bullet Points', 'Professional Summary Length'],
    suggestions: [
      'Include quantifiable metrics (e.g. "Reduced API latency by 35%") to experience bullet points.',
      'Add Docker and CI/CD Pipeline experience to stand out for senior full-stack roles.',
      'Ensure standard section headers like "Professional Experience" and "Technical Skills" are used.',
    ],
  });

  const [bulletsToEnhance, setBulletsToEnhance] = useState([
    'Built web application using React and Node.js for clients.',
    'Worked on database optimization and fixed software bugs.',
  ]);
  const [enhancedBullets, setEnhancedBullets] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        addToast('error', 'File Size Exceeded', 'Maximum allowed file size is 10 MB.');
        return;
      }
      setFile(selected);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      addToast('warning', 'No File Selected', 'Please select a PDF or DOCX file to analyze.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('title', file.name);

    try {
      const res: any = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data?.atsReport) {
        setAtsResult(res.data.atsReport);
        addToast('success', 'Analysis Complete!', 'Resume parsed and ATS report generated.');
      }
    } catch (err: any) {
      addToast('error', 'Analysis Error', err.message || 'Failed to analyze resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnhanceBullets = async () => {
    setIsEnhancing(true);
    try {
      const res: any = await api.post('/ai/enhance-bullets', {
        bullets: bulletsToEnhance,
        targetRole: 'Software Engineer',
      });
      if (res.success && res.data) {
        setEnhancedBullets(res.data);
        addToast('success', 'AI Enhancement Complete!', 'Bullet points upgraded with action verbs and metrics.');
      }
    } catch (err: any) {
      addToast('error', 'Enhancement Failed', err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const downloadPDFReport = () => {
    if (!atsResult) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('AI ATS Resume Analysis Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Overall ATS Score: ${atsResult.overallScore} / 100`, 14, 32);
    doc.text(`Formatting Score: ${atsResult.formattingScore} / 100`, 14, 40);
    doc.text(`Keyword Match Score: ${atsResult.keywordScore} / 100`, 14, 48);
    doc.text(`Grammar & Tone Score: ${atsResult.grammarScore} / 100`, 14, 56);

    doc.setFontSize(14);
    doc.text('Missing Keywords:', 14, 70);
    doc.setFontSize(10);
    atsResult.missingKeywords.forEach((kw, idx) => {
      doc.text(`• ${kw}`, 14, 78 + idx * 6);
    });

    let yPos = 78 + atsResult.missingKeywords.length * 6 + 10;
    doc.setFontSize(14);
    doc.text('AI Suggestions:', 14, yPos);
    doc.setFontSize(10);
    atsResult.suggestions.forEach((sug, idx) => {
      doc.text(`- ${sug}`, 14, yPos + 8 + idx * 6);
    });

    doc.save('ATS_Resume_Analysis_Report.pdf');
    addToast('success', 'Report Downloaded', 'PDF Analysis saved to your downloads.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-blue-500" /> ATS Resume Analyzer & Bullet Enhancer
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Upload PDF or DOCX (max 10MB) for instant 10-dimensional ATS scoring & AI rewrites
          </p>
        </div>
        {atsResult && (
          <button
            onClick={downloadPDFReport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download AI Report (PDF)
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div className="glass-panel p-8 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 text-center hover:border-blue-500 transition-colors">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              {file ? file.name : 'Drag & drop your resume file here'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports PDF and DOCX up to 10 MB</p>
          </div>
          <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} className="hidden" id="resume-input" />
          <div className="flex items-center justify-center gap-3">
            <label
              htmlFor="resume-input"
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Browse Files
            </label>
            <button
              onClick={handleUploadAndAnalyze}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue transition-all flex items-center gap-2"
            >
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isUploading ? 'Analyzing...' : 'Run ATS Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* ATS Results View */}
      {atsResult && (
        <div className="space-y-6">
          {/* Top Score Banner & Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 text-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall ATS Score</span>
              <div className="text-5xl font-black text-blue-600 dark:text-blue-400 my-2">
                {atsResult.overallScore}
                <span className="text-xl text-gray-400">/100</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Highly Compatible
              </span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span>Formatting & Layout</span>
                <span className="text-blue-500">{atsResult.formattingScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${atsResult.formattingScore}%` }} />
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Keyword Match</span>
                <span className="text-blue-500">{atsResult.keywordScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${atsResult.keywordScore}%` }} />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span>Grammar & Tone</span>
                <span className="text-blue-500">{atsResult.grammarScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${atsResult.grammarScore}%` }} />
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Section Ordering</span>
                <span className="text-blue-500">{atsResult.sectionOrderScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${atsResult.sectionOrderScore}%` }} />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span>Technical Skills</span>
                <span className="text-blue-500">{atsResult.hardSkillsScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${atsResult.hardSkillsScore}%` }} />
              </div>
              <div className="flex justify-between text-xs font-semibold pt-2">
                <span>Soft Skills</span>
                <span className="text-blue-500">{atsResult.softSkillsScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${atsResult.softSkillsScore}%` }} />
              </div>
            </div>
          </div>

          {/* Missing Keywords & Weak Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Missing Industry Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {atsResult.missingKeywords.map(kw => (
                  <span key={kw} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-900">
                    ⚠️ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> AI Suggestions for 95+ Score
              </h3>
              <ul className="space-y-2">
                {atsResult.suggestions.map((sug, idx) => (
                  <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI One-Click Bullet Rewriter */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-950/20 to-slate-900/40">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> One-Click AI Bullet Rewriter
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Transform generic resume points into high-impact metric statements</p>
              </div>
              <button
                onClick={handleEnhanceBullets}
                disabled={isEnhancing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg glow-blue transition-all flex items-center gap-2"
              >
                {isEnhancing ? 'Rewriting with AI...' : 'One-Click Rewrite'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Bullets */}
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <span className="text-xs font-semibold text-gray-400 block mb-2">Original Bullet Points:</span>
                <ul className="space-y-2 text-xs text-gray-300">
                  {bulletsToEnhance.map((b, i) => (
                    <li key={i} className="p-2 rounded-lg bg-gray-950 border border-gray-800">
                      "{b}"
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Improved Bullets */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/50">
                <span className="text-xs font-semibold text-blue-300 block mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Optimized Results:
                </span>
                {enhancedBullets.length > 0 ? (
                  <ul className="space-y-2 text-xs text-blue-100">
                    {enhancedBullets.map((eb, i) => (
                      <li key={i} className="p-2 rounded-lg bg-blue-900/40 border border-blue-800/60 font-medium">
                        "{eb}"
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic">Click "One-Click Rewrite" above to generate AI-enhanced bullets.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
