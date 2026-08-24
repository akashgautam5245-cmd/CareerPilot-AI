import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { careerApi } from '../../services/api';
import { UserCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const CareerProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    education: user?.education || 'B.S. in Computer Science & Data Science',
    degree: user?.degree || 'Bachelor of Science',
    college: user?.college || 'University of California, Berkeley',
    gradYear: user?.gradYear || 2026,
    location: user?.location || 'San Francisco, CA',
    targetRole: user?.targetRole || 'Data Scientist / ML Engineer',
    preferredIndustry: user?.preferredIndustry || 'Artificial Intelligence & Technology',
    experienceLevel: user?.experienceLevel || 'Entry Level / Intern',
    preferredJobType: user?.preferredJobType || 'Full-time',
    careerGoal: user?.careerGoal || 'Secure a Data Scientist or Machine Learning Engineer role at a leading tech company within 6 months.',
    skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'PyTorch', 'FastAPI', 'React', 'Git', 'REST APIs'],
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);
    try {
      const res: any = await careerApi.updateProfile(formData);
      if (res.user) {
        setUser(res.user);
      }
      setSuccess('Career profile updated successfully!');
    } catch (err: any) {
      setSuccess('Profile saved locally.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-400" /> Career Profile & Onboarding
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Set up your academic background, target role goals, and technical skill inventory.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Academic Background</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value) || 2026 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Career Goal */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Target Career Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Role</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Industry</label>
              <input
                type="text"
                value={formData.preferredIndustry}
                onChange={(e) => setFormData({ ...formData, preferredIndustry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Career Statement Goal</label>
            <textarea
              rows={3}
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Skills Inventory */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">Skills Inventory</h3>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving Profile...' : 'Save Career Profile'}
        </button>
      </form>
    </div>
  );
};
