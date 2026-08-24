import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Target, Brain, Map, Video, CheckCircle2, Star, ChevronRight, ShieldCheck, Zap, BarChart, Rocket } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-outfit text-white tracking-wide">CareerPilot</span>
              <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ai-capabilities" className="hover:text-white transition-colors">AI Capabilities</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link
              to="/register"
              className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-8 shadow-inner">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career & Placement Intelligence Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-outfit tracking-tight text-white leading-tight mb-6">
            Know Your Gap. Build Your Skills. <br />
            <span className="gradient-text">Get Career Ready.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Analyze your resume, discover missing technical skills, match yourself with dream jobs, follow personalized 90-day learning roadmaps, and practice interactive AI mock interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="w-full sm:w-auto gradient-btn px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/25"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-base font-semibold transition-all flex items-center justify-center gap-2"
            >
              Try AI Resume Analysis
            </Link>
          </div>

          {/* SaaS Preview Card Mockup */}
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-slate-800/40 to-slate-900 border border-slate-800 shadow-2xl">
            <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">CAREER READINESS SCORE</span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-4xl font-extrabold text-white font-outfit mb-2">78%</div>
                <p className="text-xs text-emerald-400 font-medium">Top 15% among college applicants</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">RESUME MATCH RATE</span>
                  <Target className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-4xl font-extrabold text-white font-outfit mb-2">82%</div>
                <p className="text-xs text-indigo-400 font-medium">Matched with Meta Data Science Intern</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">90-DAY ROADMAP</span>
                  <Map className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-4xl font-extrabold text-white font-outfit mb-2">42%</div>
                <p className="text-xs text-purple-400 font-medium">Month 1 Week 3 Tasks Completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-4">
              How CareerPilot AI Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              From uploading your initial resume to landing placement offers in 6 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload & Parse Resume', desc: 'Extract skills, projects, and metrics automatically from PDF or DOCX format.' },
              { step: '02', title: 'Analyze Target Job', desc: 'Paste any job description to calculate exact match score and skill gaps.' },
              { step: '03', title: 'Follow 90-Day Roadmap', desc: 'Master missing skills with weekly goals, resource links, and mini-projects.' },
              { step: '04', title: 'Build Recommended Projects', desc: 'Implement portfolio projects designed specifically to fill resume gaps.' },
              { step: '05', title: 'AI Mock Interviews', desc: 'Practice role-specific voice & text interview questions with instant feedback.' },
              { step: '06', title: 'Track Placement Progress', desc: 'Monitor your Career Readiness Score and application pipeline in real time.' },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative hover:border-indigo-500/40 transition-all">
                <span className="text-3xl font-extrabold font-outfit text-indigo-500/40 mb-3 block">{s.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities & Features */}
      <section id="ai-capabilities" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">INTELLIGENCE SUITE</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mt-2 mb-4">
              AI-Powered Career Intelligence
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Built with Scikit-learn NLP matching, LLM interview evaluations, and explainable data analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Job Match & Explainability', desc: 'Understand exactly why you match a job and get actionable steps to close gaps.' },
              { icon: Brain, title: 'Skill-Gap Engine', desc: 'Ranks missing skills by job market demand and target role importance.' },
              { icon: Map, title: 'Personalized 90-Day Roadmap', desc: 'Structured weekly tasks, resources, and assessments tailored to your current level.' },
              { icon: Code, title: 'Project Recommendation', desc: 'Generates real portfolio projects matching your specific missing skills.' },
              { icon: Video, title: 'AI Mock Interviewer', desc: 'Generates role-specific questions and evaluates technical correctness & clarity.' },
              { icon: BarChart, title: 'Career Readiness Gauge', desc: 'Composite readiness score calculated across 6 empirical performance pillars.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-outfit text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Everything you need to know about CareerPilot AI.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Is CareerPilot AI suitable for college students?', a: 'Yes! CareerPilot AI is specifically designed for college students, new grads, and job seekers looking for internships or early-career roles.' },
              { q: 'Does CareerPilot AI fabricate resume details?', a: 'No. CareerPilot AI parses your exact resume and provides truthful, data-backed recommendations without inventing experience or achievements.' },
              { q: 'How is the Job Match Score calculated?', a: 'The score combines TF-IDF text similarity and skill matrix overlap comparing your profile against required job skills.' },
              { q: 'Can I practice mock interviews for my target role?', a: 'Yes! The AI Mock Interview generates role-specific questions, evaluates technical correctness, and gives feedback on speech pace and structure.' }
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> {faq.q}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-outfit text-white mb-4">Start Your Placement Journey Today</h2>
          <p className="text-slate-400 text-sm mb-8">Join thousands of students building skills and landing target tech roles.</p>
          <Link to="/register" className="gradient-btn px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2 text-sm">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 mt-12">© 2026 CareerPilot AI. Know Your Gap. Build Your Skills. Get Career Ready.</p>
        </div>
      </footer>
    </div>
  );
};
