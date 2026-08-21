import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Tag, CheckCircle2, Copy, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export const KnowledgeBase: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadKB() {
      try {
        const res: any = await api.get('/knowledge-base', {
          params: { search, category: selectedCategory !== 'ALL' ? selectedCategory : undefined },
        });
        if (res.entries) setEntries(res.entries);
      } catch (err) {
        // Fallback knowledge base entries
        setEntries([
          {
            id: 'kb-1',
            title: 'PostgreSQL Prisma Connection Pool Leak Prevention in Express',
            category: 'Database & Backend',
            tags: ['PostgreSQL', 'Prisma', 'Express', 'Performance'],
            problemSummary: 'Express backend timing out under concurrent traffic due to multiple PrismaClient instantiations exhausting PostgreSQL connection limit.',
            rootCause: 'Instantiating new PrismaClient() in individual route handlers opens fresh connection pools until DB server limits are hit.',
            solution: 'Export single global Prisma instance from config/prisma.ts attached to global NodeJS object in development mode.',
            prevention: 'Always centralize database ORM clients in a single configuration file and import the instance across models.',
            usageCount: 14,
          },
          {
            id: 'kb-2',
            title: 'PyTorch CUDA 12.1 Driver Wheel Installation Fix',
            category: 'Technical & Environment',
            tags: ['PyTorch', 'CUDA', 'Python', 'Pip'],
            problemSummary: 'PyTorch script crashing on GPU allocation step with CUDA kernel availability failure.',
            rootCause: 'Default pip install torch command installed binary for CUDA 11.8 instead of system CUDA 12.2.',
            solution: 'Run pip install torch --index-url https://download.pytorch.org/whl/cu121 in fresh virtual environment.',
            prevention: 'Maintain a locked requirements file specifying explicit wheel index URLs.',
            usageCount: 8,
          },
        ]);
      }
    }
    loadKB();
  }, [search, selectedCategory]);

  const handleCopySolution = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Personal Problem-Solving Knowledge Base
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable repository of resolved technical blockers, root cause analyses, and step-by-step solutions.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search solutions e.g. 'Python dependency', 'Prisma pool'..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="Database & Backend">Database & Backend</option>
          <option value="Technical & Environment">Technical & Environment</option>
          <option value="UI & Frontend">UI & Frontend</option>
        </select>
      </div>

      {/* Knowledge Base Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="glass-card space-y-4 border-indigo-500/20 hover:border-indigo-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {entry.category}
                </span>
                <h2 className="text-sm font-bold text-white mt-1">{entry.title}</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Used {entry.usageCount} times</span>
            </div>

            {/* Structured Breakdown: Problem -> Root Cause -> Solution -> Prevention */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Problem & Root Cause:
                </span>
                <p className="text-slate-300">{entry.problemSummary}</p>
                <p className="text-slate-400 text-[11px]"><strong>Why it happened:</strong> {entry.rootCause}</p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Solution:
                  </span>
                  <button
                    onClick={() => handleCopySolution(entry.solution, entry.id)}
                    className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedId === entry.id ? 'Copied!' : 'Copy Fix'}
                  </button>
                </div>
                <p className="text-slate-200 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                  {entry.solution}
                </p>
                <p className="text-purple-300 text-[11px] pt-1">
                  <strong>Prevention:</strong> {entry.prevention}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {entry.tags.map((t: string, idx: number) => (
                <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
