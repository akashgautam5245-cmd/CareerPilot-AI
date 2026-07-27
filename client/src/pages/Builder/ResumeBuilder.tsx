import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Download, Layout, Sparkles, Plus, Trash2, Edit3, Move, Check } from 'lucide-react';
import jsPDF from 'jspdf';

export const ResumeBuilder: React.FC = () => {
  const { addToast } = useNotification();
  const [template, setTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');

  const [formData, setFormData] = useState({
    name: 'Alex Mercer',
    title: 'Senior Full Stack Software Engineer',
    email: 'alex.mercer@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Results-driven Full Stack Engineer with 4+ years of experience building high-throughput web applications using React, TypeScript, Node.js, and PostgreSQL. Reduced API latency by 35%.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'REST API', 'Git'],
    experience: [
      {
        company: 'CloudTech Solutions',
        role: 'Software Developer',
        dates: 'Jan 2023 - Present',
        description: 'Architected responsive SaaS dashboards serving 50,000+ monthly active users. Optimized REST APIs.',
      },
    ],
    education: [
      {
        institution: 'State University',
        degree: 'B.S. Computer Science',
        dates: '2019 - 2023',
      },
    ],
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(formData.name, 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(formData.title, 14, 28);
    doc.text(`${formData.email}  |  ${formData.phone}  |  ${formData.location}`, 14, 34);

    doc.line(14, 38, 196, 38);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PROFESSIONAL SUMMARY', 14, 46);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(formData.summary, 180);
    doc.text(splitSummary, 14, 52);

    let y = 52 + splitSummary.length * 6 + 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('EXPERIENCE', 14, y);
    y += 8;

    formData.experience.forEach(exp => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${exp.role} - ${exp.company}`, 14, y);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text(exp.dates, 150, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(exp.description, 180);
      doc.text(splitDesc, 14, y);
      y += splitDesc.length * 6 + 6;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TECHNICAL SKILLS', 14, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(formData.skills.join('  •  '), 14, y);

    doc.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
    addToast('success', 'PDF Generated!', 'Your resume template has been downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Layout className="w-7 h-7 text-blue-500" /> Drag-and-Drop Resume Builder
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Build ATS-optimized resumes with real-time live preview & instant PDF export
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Template Selector */}
          <div className="flex p-1 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-medium">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'modern' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Modern SaaS
            </button>
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'classic' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Classic Tech
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Split Screen: Editor on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Personal Info Box */}
          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-500" /> Personal Information
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
                placeholder="Target Job Title"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
                  placeholder="Phone"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary Box */}
          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Professional Summary</h3>
            <textarea
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs leading-relaxed"
            />
          </div>

          {/* Skills List Editor */}
          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((sk, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1">
                  {sk}
                  <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== idx) })} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 glass-panel p-8 rounded-3xl border border-gray-300 dark:border-gray-800 shadow-2xl bg-white text-gray-900 min-h-[600px]">
            {/* Header section of template */}
            <div className={`pb-4 border-b ${template === 'modern' ? 'border-blue-500' : 'border-gray-300'}`}>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.name}</h2>
              <p className="text-sm font-bold text-blue-600 mt-0.5">{formData.title}</p>
              <p className="text-xs text-gray-500 mt-1 flex flex-wrap gap-3">
                <span>{formData.email}</span>
                <span>•</span>
                <span>{formData.phone}</span>
                <span>•</span>
                <span>{formData.location}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Professional Summary</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{formData.summary}</p>
            </div>

            {/* Experience Section */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Work Experience</h4>
              {formData.experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-gray-900">{exp.role} — <span className="text-gray-700 font-normal">{exp.company}</span></span>
                    <span className="text-[11px] text-gray-500 italic">{exp.dates}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Technical Skills</h4>
              <p className="text-xs text-gray-700">{formData.skills.join('  •  ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
