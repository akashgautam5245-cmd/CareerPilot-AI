import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Shield, Users, FileText, Eye, Ban, Trash2, CheckCircle, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { addToast } = useNotification();
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      const [metRes, usrRes]: any[] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
      ]);
      if (metRes.success) setMetrics(metRes.data);
      if (usrRes.success) setUsersList(usrRes.data);
    } catch (err: any) {
      addToast('error', 'Admin Load Error', err.message);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      const res: any = await api.patch(`/admin/users/${userId}/status`, {});
      if (res.success) {
        setUsersList(prev =>
          prev.map(u => (u.id === userId ? { ...u, status: res.data.status } : u))
        );
        addToast('success', 'User Status Updated', res.message);
      }
    } catch (err: any) {
      addToast('error', 'Failed to update status', err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      addToast('success', 'User Deleted', 'User account permanently removed.');
    } catch (err: any) {
      addToast('error', 'Delete failed', err.message);
    }
  };

  const filteredUsers = usersList.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-amber-500" /> Platform Admin Management Suite
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Monitor total users, resume uploads, daily visitors, suspend/delete accounts, and export reports
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{metrics.totalUsers}</div>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18% this month
            </span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Resumes</span>
              <FileText className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{metrics.totalResumes}</div>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +340 parsed today
            </span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Daily Visitors</span>
              <Eye className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{metrics.dailyVisitors}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Active online today</span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">Avg Platform ATS</span>
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500 mt-2">{metrics.avgPlatformAtsScore}</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Out of 100 max</span>
          </div>
        </div>
      )}

      {/* Monthly Activity Chart */}
      {metrics?.monthlyActivityTrend && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">Monthly User & Resume Growth</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyActivityTrend}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} name="New Users" />
                <Bar dataKey="resumes" fill="#6366f1" radius={[6, 6, 0, 0]} name="Resumes Parsed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">User Accounts ({filteredUsers.length})</h3>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search user by name or email..."
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase font-semibold">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Target Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="py-3.5 font-semibold text-gray-900 dark:text-white">
                    <div>{u.name}</div>
                    <span className="text-[11px] text-gray-400 font-normal">{u.email}</span>
                  </td>
                  <td className="py-3.5 font-medium">{u.role}</td>
                  <td className="py-3.5 text-gray-400">{u.targetRole || 'Software Engineer'}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-red-100 dark:bg-red-950 text-red-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 font-semibold hover:bg-amber-200 transition-colors"
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 font-semibold hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
