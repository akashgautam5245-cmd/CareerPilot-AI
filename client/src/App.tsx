import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { StudentDashboard } from './pages/Dashboard/StudentDashboard';
import { ResumeUpload } from './pages/Resume/ResumeUpload';
import { ResumeBuilder } from './pages/Builder/ResumeBuilder';
import { MockInterviewStudio } from './pages/Interview/MockInterviewStudio';
import { SkillGapAnalyzer } from './pages/SkillGap/SkillGapAnalyzer';
import { JobTrackerBoard } from './pages/JobTracker/JobTrackerBoard';
import { AICareerAssistant } from './pages/AIChat/AICareerAssistant';
import { UserProfile } from './pages/Profile/UserProfile';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { NotFound } from './pages/NotFound/NotFound';

const MainAppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-semibold tracking-wider">Loading Antigravity AI Engine...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return (
      <Login
        onSwitchToRegister={() => setAuthView('register')}
        onForgotPassword={() => alert('Password reset link sent to demo user.')}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard onNavigate={setActiveTab} />;
      case 'resume-ats':
        return <ResumeUpload />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'mock-interview':
        return <MockInterviewStudio />;
      case 'skill-gap':
        return <SkillGapAnalyzer />;
      case 'job-tracker':
        return <JobTrackerBoard />;
      case 'ai-chat':
        return <AICareerAssistant />;
      case 'profile':
        return <UserProfile />;
      case 'admin':
        return user.role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard onNavigate={setActiveTab} />;
      default:
        return <NotFound onGoHome={() => setActiveTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} />
        <main className="flex-1 min-w-0">{renderActiveTab()}</main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
