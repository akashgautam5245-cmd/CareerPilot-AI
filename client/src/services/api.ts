import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const careerApi = {
  // Auth
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),

  // Profile
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),

  // Resume
  uploadResume: (formData: FormData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getLatestResume: () => api.get('/resume/latest'),

  // Job Matcher
  createJobAndMatch: (data: any) => api.post('/jobs/match', data),
  getJobs: () => api.get('/jobs'),
  getJobMatchDetails: (jobId: string) => api.get(`/jobs/${jobId}/match`),

  // Skill Gap
  getSkillGaps: () => api.get('/skill-gap'),
  recalculateSkillGaps: () => api.post('/skill-gap/recalculate'),

  // Roadmap
  getRoadmap: () => api.get('/roadmap'),
  toggleTaskComplete: (taskId: string) => api.patch(`/roadmap/tasks/${taskId}/toggle`),
  addCustomTask: (data: any) => api.post('/roadmap/tasks/custom', data),

  // Projects
  getProjectRecommendations: () => api.get('/projects/recommendations'),
  updateProjectStatus: (projectId: string, status: string) => api.patch(`/projects/${projectId}/status`, { status }),

  // Mock Interview
  createInterviewSession: (data: any) => api.post('/interview/session', data),
  submitAnswer: (data: any) => api.post('/interview/answer', data),
  getInterviewResults: (interviewId: string) => api.get(`/interview/${interviewId}/results`),

  // Career Readiness
  getCareerReadiness: () => api.get('/readiness'),

  // AI Assistant
  askAssistant: (data: any) => api.post('/assistant', data),

  // Applications & Saved Jobs
  getApplications: () => api.get('/applications'),
  toggleSaveJob: (jobId: string) => api.post('/jobs/save', { jobId }),
  updateApplicationStatus: (data: any) => api.post('/applications/update', data),

  // Analytics
  getAnalytics: () => api.get('/analytics'),
};
