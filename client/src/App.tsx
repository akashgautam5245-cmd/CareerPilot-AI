import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

// 20 Pages Imports
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Onboarding } from './pages/Onboarding';

import { Dashboard } from './pages/Dashboard';
import { CareerProfile } from './pages/CareerProfile';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { JobMatcher } from './pages/JobMatcher';
import { SkillGap } from './pages/SkillGap';
import { CareerRoadmap } from './pages/CareerRoadmap';
import { ProjectRecommendations } from './pages/ProjectRecommendations';
import { MockInterviewStudio } from './pages/Interview/MockInterviewStudio';
import { InterviewResults } from './pages/InterviewResults';
import { CareerReadiness } from './pages/CareerReadiness';
import { AIAssistant } from './pages/AIAssistant';
import { JobTrackerBoard } from './pages/JobTracker/JobTrackerBoard';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading CareerPilot AI...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Career Platform Pages */}
            <Route
              path="/onboarding"
              element={
                <ProtectedLayout>
                  <Onboarding />
                </ProtectedLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <CareerProfile />
                </ProtectedLayout>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedLayout>
                  <ResumeAnalyzer />
                </ProtectedLayout>
              }
            />
            <Route
              path="/job-matcher"
              element={
                <ProtectedLayout>
                  <JobMatcher />
                </ProtectedLayout>
              }
            />
            <Route
              path="/skill-gap"
              element={
                <ProtectedLayout>
                  <SkillGap />
                </ProtectedLayout>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedLayout>
                  <CareerRoadmap />
                </ProtectedLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedLayout>
                  <ProjectRecommendations />
                </ProtectedLayout>
              }
            />
            <Route
              path="/interview/new"
              element={
                <ProtectedLayout>
                  <MockInterviewStudio />
                </ProtectedLayout>
              }
            />
            <Route
              path="/interview/:id/results"
              element={
                <ProtectedLayout>
                  <InterviewResults />
                </ProtectedLayout>
              }
            />
            <Route
              path="/readiness"
              element={
                <ProtectedLayout>
                  <CareerReadiness />
                </ProtectedLayout>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedLayout>
                  <AIAssistant />
                </ProtectedLayout>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedLayout>
                  <JobTrackerBoard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedLayout>
                  <Analytics />
                </ProtectedLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              }
            />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
