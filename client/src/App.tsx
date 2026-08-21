import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

// 17 Pages Imports
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { CreateTask } from './pages/CreateTask';
import { TaskDetails } from './pages/TaskDetails';
import { Calendar } from './pages/Calendar';
import { ProblemSolver } from './pages/ProblemSolver';
import { ProblemDetails } from './pages/ProblemDetails';
import { AIAssistant } from './pages/AIAssistant';
import { ProductivityAnalytics } from './pages/ProductivityAnalytics';
import { DailyReview } from './pages/DailyReview';
import { WeeklyInsights } from './pages/WeeklyInsights';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading SolveFlow AI...
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
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Main Application Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedLayout>
                  <Tasks />
                </ProtectedLayout>
              }
            />
            <Route
              path="/create-task"
              element={
                <ProtectedLayout>
                  <CreateTask />
                </ProtectedLayout>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedLayout>
                  <TaskDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedLayout>
                  <Calendar />
                </ProtectedLayout>
              }
            />
            <Route
              path="/problems"
              element={
                <ProtectedLayout>
                  <ProblemSolver />
                </ProtectedLayout>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <ProtectedLayout>
                  <ProblemDetails />
                </ProtectedLayout>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedLayout>
                  <AIAssistant />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedLayout>
                  <ProductivityAnalytics />
                </ProtectedLayout>
              }
            />
            <Route
              path="/daily-review"
              element={
                <ProtectedLayout>
                  <DailyReview />
                </ProtectedLayout>
              }
            />
            <Route
              path="/weekly-insights"
              element={
                <ProtectedLayout>
                  <WeeklyInsights />
                </ProtectedLayout>
              }
            />
            <Route
              path="/knowledge-base"
              element={
                <ProtectedLayout>
                  <KnowledgeBase />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <Profile />
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

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
