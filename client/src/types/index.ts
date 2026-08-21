export type Role = 'USER' | 'ADMIN';
export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
export type ProblemSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ProblemStatus = 'OPEN' | 'INVESTIGATING' | 'SOLUTION_FOUND' | 'RESOLVED' | 'UNRESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  focusHoursGoal?: number;
  createdAt?: string;
}

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  categoryId?: string;
  title: string;
  description?: string;
  categoryName: string;
  projectName: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  estimatedDuration: number;
  actualDuration: number;
  tags: string[];
  notes?: string;
  aiPriorityScore: number;
  aiRecommendation?: string;
  importanceScore: number;
  difficultyScore: number;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
  problems?: Problem[];
}

export interface Problem {
  id: string;
  userId: string;
  taskId?: string;
  task?: Partial<Task>;
  title: string;
  description: string;
  categoryName: string;
  severity: ProblemSeverity;
  status: ProblemStatus;
  date: string;
  attempts: number;
  notes?: string;
  whatHappened?: string;
  whyHappened?: string;
  whatTried?: string;
  whatWorked?: string;
  whatFailed?: string;
  whatDifferentNextTime?: string;
  aiSummary?: string;
  aiPossibleCauses?: string[];
  aiRecommendedSolutions?: string[];
  aiBestSolution?: string;
  aiActionPlan?: string[];
  aiPrevention?: string;
  createdAt: string;
  updatedAt: string;
  knowledgeBaseEntry?: KnowledgeBaseEntry;
}

export interface KnowledgeBaseEntry {
  id: string;
  userId: string;
  problemId?: string;
  title: string;
  category: string;
  tags: string[];
  problemSummary: string;
  rootCause: string;
  solution: string;
  prevention: string;
  usageCount: number;
  createdAt: string;
}

export interface DailyReview {
  id: string;
  userId: string;
  date: string;
  accomplishments: string;
  problemsFaced: string;
  remainingUnfinished: string;
  distractions: string;
  wentWell: string;
  improveTomorrow: string;
  aiSummary?: string;
  createdAt: string;
}

export interface ProductivityMetric {
  id: string;
  date: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  problemsEncountered: number;
  problemsSolved: number;
  focusTimeMinutes: number;
  productivityPercentage: number;
  estVsActualRatio: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ScheduleBlock {
  timeSlot: string;
  activity: string;
  category: string;
  taskId?: string;
  durationMinutes: number;
  notes?: string;
}
