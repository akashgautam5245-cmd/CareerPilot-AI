export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'ACTIVE' | 'SUSPENDED';
  targetRole?: string;
  profilePic?: string;
  bio?: string;
  isEmailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ResumeParsedData {
  name?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description?: string;
    highlights: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
  }>;
}

export interface ATSReport {
  overallScore: number;
  formattingScore: number;
  keywordScore: number;
  grammarScore: number;
  sectionOrderScore: number;
  softSkillsScore: number;
  hardSkillsScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  weakSections: string[];
  suggestions: string[];
}

export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  parsedText: string;
  parsedData: ResumeParsedData;
  isPrimary: boolean;
  createdAt: string;
  analyses?: ATSReport[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  hints: string[];
}

export interface InterviewAnswerEvaluation {
  score: number;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  feedback: string;
  missingPoints: string[];
  modelAnswer: string;
}

export interface InterviewSession {
  id: string;
  targetRole: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  interviewType: 'BEHAVIORAL' | 'TECHNICAL' | 'HR' | 'SYSTEM_DESIGN';
  overallScore?: number;
  questions: InterviewQuestion[];
  answers?: Array<{
    question: string;
    userAnswer: string;
    score: number;
    feedback: string;
  }>;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED' | 'ACCEPTED';
  salary?: string;
  location?: string;
  jobUrl?: string;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
}

export interface SkillGapRoadmap {
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  estimatedLearningTimeWeeks: number;
  roadmap: Array<{
    phase: string;
    title: string;
    skillsToLearn: string[];
    recommendedResources: string[];
    estimatedHours: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
