import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { JobApplication } from '../../types';
import { Briefcase, Plus, Calendar, DollarSign, MapPin, ExternalLink, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const JobTrackerBoard: React.FC = () => {
  const { addToast } = useNotification();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('APPLIED');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/jobs');
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err: any) {
      addToast('error', 'Could not load jobs', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/jobs', {
        company,
        position,
        status,
        salary,
        location,
      });
      if (res.success && res.data) {
        setJobs(prev => [res.data, ...prev]);
        setShowAddModal(false);
        setCompany('');
        setPosition('');
        setSalary('');
        setLocation('');
        addToast('success', 'Job Tracked!', 'Added new application to your board.');
      }
    } catch (err: any) {
      addToast('error', 'Error adding job', err.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobApplication['status']) => {
    try {
      const res: any = await api.patch(`/jobs/${id}/status`, { status: newStatus });
      if (res.success) {
        setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: newStatus } : j)));
        addToast('info', 'Status Updated', `Moved application to ${newStatus}`);
      }
    } catch (err: any) {
      addToast('error', 'Update failed', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j.id !== id));
      addToast('success', 'Removed', 'Job application deleted.');
    } catch (err: any) {
      addToast('error', 'Delete failed', err.message);
    }
  };

  const columns: Array<{ id: JobApplication['status']; label: string; color: string }> = [
    { id: 'WISHLIST', label: 'Wishlist', color: 'border-purple-500' },
    { id: 'APPLIED', label: 'Applied', color: 'border-blue-500' },
    { id: 'INTERVIEWING', label: 'Interviewing', color: 'border-amber-500' },
    { id: 'OFFER', label: 'Offer Received', color: 'border-emerald-500' },
    { id: 'REJECTED', label: 'Rejected', color: 'border-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-500" /> Job Application Kanban Board
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track applications, interview schedules, offers, and conversion statistics
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg glow-blue flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colJobs = jobs.filter(j => j.status === col.id);
          return (
            <div key={col.id} className={`glass-panel p-4 rounded-3xl border-t-4 ${col.color} border-x border-b border-gray-200 dark:border-gray-800 space-y-3 min-w-[240px]`}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">{col.label}</h3>
                <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-bold flex items-center justify-center">
                  {colJobs.length}
                </span>
              </div>

              <div className="space-y-3">
                {colJobs.map(job => (
                  <div key={job.id} className="p-3.5 rounded-2xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{job.company}</h4>
                      <button onClick={() => handleDelete(job.id)} className="text-gray-400 hover:text-red-500 text-xs">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-blue-500 font-semibold">{job.position}</p>
                    {job.salary && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" /> {job.salary}
                      </p>
                    )}
                    {job.location && (
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </p>
                    )}

                    {/* Move column dropdown */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <select
                        value={job.status}
                        onChange={e => handleStatusChange(job.id, e.target.value as any)}
                        className="text-[10px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 font-medium"
                      >
                        <option value="WISHLIST">Wishlist</option>
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Track New Job Application</h3>
            <form onSubmit={handleAddJob} className="space-y-3">
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
                placeholder="Company Name (e.g. Google)"
                className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold"
              />
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                required
                placeholder="Job Position (e.g. Frontend Engineer)"
                className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="Salary (e.g. $140,000/yr)"
                  className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
                />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Location (e.g. Remote)"
                  className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
