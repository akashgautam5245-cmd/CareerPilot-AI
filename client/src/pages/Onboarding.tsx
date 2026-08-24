import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, User, Briefcase, GraduationCap, MapPin, Plus, X } from 'lucide-react';
import { careerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || 'B.S. in Computer Science',
    gradYear: user?.gradYear || 2026,
    location: user?.location || 'San Francisco, CA',
    targetRole: user?.targetRole || 'Data Scientist / ML Engineer',
    preferredIndustry: user?.preferredIndustry || 'Artificial Intelligence & Tech',
    experienceLevel: user?.experienceLevel || 'Entry Level / Intern',
    preferredJobType: user?.preferredJobType || 'Full-time',
    careerGoal: user?.careerGoal || 'I want to become a Data Scientist and land a target tech internship within 6 months.',
  });

  const [skills, setSkills] = useState<string[]>(['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Git']);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedRoles = [
    'Data Scientist',
    'Data Analyst',
    'ML Engineer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
  ];

  const popularSkills = [
    'Python', 'SQL', 'Pandas', 'Scikit-learn', 'PyTorch', 'FastAPI',
    'React', 'TypeScript', 'Node.js', 'Docker', 'AWS', 'PostgreSQL', 'Git'
  ];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await careerApi.updateProfile({
        ...formData,
        skills: JSON.stringify(skills),
      });
      if (refreshProfile) {
        await refreshProfile();
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-white">CareerPilot AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-outfit">Welcome to Your Career Setup</h1>
          <p className="text-xs text-slate-400 mt-1">Configure your career goal and profile to get personalized AI placement intelligence.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-8">
          {[
            { id: 1, label: 'Basic Info' },
            { id: 2, label: 'Career Goal' },
            { id: 3, label: 'Skill Set' },
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400'
                    : step > s.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.id ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" /> Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Alex Rivera"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">University / College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="UC Berkeley"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree / Major</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="B.S. Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value) || 2026 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="San Francisco, CA (or Remote)"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Continue to Career Goal <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Target Role & Career Goal
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Target Role</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetRole: role })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formData.targetRole === role
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Custom Target Role"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Entry Level / Intern">Entry Level / Intern</option>
                    <option value="Associate / Mid Level">Associate / Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Job Type</label>
                  <select
                    value={formData.preferredJobType}
                    onChange={(e) => setFormData({ ...formData, preferredJobType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Career Goal Statement</label>
                <textarea
                  rows={3}
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. I want to become a Data Scientist and get an internship within 6 months."
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  Continue to Skills <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" /> Select Your Current Skills
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Add Custom Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillInput))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. TensorFlow, Docker, PostgreSQL"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(skillInput)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Selected Skills ({skills.length})</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[60px]">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5"
                    >
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Popular Suggested Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {popularSkills.map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => handleAddSkill(ps)}
                      disabled={skills.includes(ps)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                        skills.includes(ps)
                          ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-indigo-500/40 hover:text-white'
                      }`}
                    >
                      + {ps}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gradient-btn px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  {isSubmitting ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
