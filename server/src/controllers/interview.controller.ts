import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/ai.service.js';

const mockInterviewsDB: Map<string, any> = new Map();

// Initialize DB with realistic demo interviews for rich UI out-of-the-box
const initialSampleInterviews = [
  {
    id: 'int_sample_01',
    userId: 'student-123',
    targetRole: 'Full Stack Developer',
    experienceLevel: 'MID',
    companyType: 'High-Growth Startup',
    difficulty: 'INTERMEDIATE',
    interviewType: 'TECHNICAL',
    programmingLanguage: 'TypeScript',
    numQuestions: 5,
    overallScore: 86,
    grammarScore: 92,
    technicalScore: 84,
    confidenceScore: 88,
    communicationScore: 90,
    fluencyScore: 88,
    completenessScore: 85,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    questions: [
      { id: 'q1', question: 'How do you structure microservices communication for high concurrency?', category: 'System Architecture', hints: ['Message queues', 'gRPC vs REST'] },
      { id: 'q2', question: 'Explain how React Server Components differ from standard SSR.', category: 'Frontend', hints: ['Bundle size', 'Zero-bundle-size components'] }
    ],
    answers: [
      {
        question: 'How do you structure microservices communication for high concurrency?',
        userAnswer: 'I rely on asynchronous message brokers like RabbitMQ or Kafka for event-driven updates, alongside gRPC for synchronous internal microservice calls to keep latency low.',
        score: 88,
        grammarScore: 95,
        technicalScore: 88,
        confidenceScore: 90,
        communicationScore: 92,
        fluencyScore: 90,
        completenessScore: 85,
        feedback: 'Excellent breakdown of synchronous vs asynchronous microservices design.',
        strengths: ['Great choice of tools', 'Clean architectural distinction'],
        weaknesses: ['Could mention circuit breaker patterns for fault tolerance']
      }
    ],
    recommendedResources: [
      { title: 'Designing Data-Intensive Applications', type: 'article', url: 'https://dataintensive.net/' },
      { title: 'Microservices Communication Patterns', type: 'course', url: 'https://microservices.io/patterns/' }
    ]
  },
  {
    id: 'int_sample_02',
    userId: 'student-123',
    targetRole: 'Software Engineer',
    experienceLevel: 'SENIOR',
    companyType: 'MAANG / Tech Giant',
    difficulty: 'ADVANCED',
    interviewType: 'SYSTEM_DESIGN',
    programmingLanguage: 'System Design',
    numQuestions: 5,
    overallScore: 78,
    grammarScore: 88,
    technicalScore: 76,
    confidenceScore: 80,
    communicationScore: 82,
    fluencyScore: 80,
    completenessScore: 75,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    questions: [
      { id: 'q1', question: 'Design a distributed rate limiter for a public API gateway.', category: 'Distributed Systems', hints: ['Token bucket', 'Redis sliding window'] }
    ],
    answers: [],
    recommendedResources: [
      { title: 'System Design Primer', type: 'practice', url: 'https://github.com/donnemartin/system-design-primer' }
    ]
  }
];

initialSampleInterviews.forEach(item => mockInterviewsDB.set(item.id, item));

export async function startInterview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const {
      targetRole = 'Software Engineer',
      experienceLevel = 'MID',
      companyType = 'Tech Giant',
      difficulty = 'INTERMEDIATE',
      interviewType = 'TECHNICAL',
      numQuestions = 5,
      programmingLanguage = 'JavaScript',
      resumeSkills = []
    } = req.body;

    const questions = await aiService.generateInterviewQuestions(
      targetRole,
      difficulty,
      interviewType,
      numQuestions,
      companyType,
      experienceLevel,
      programmingLanguage,
      resumeSkills
    );

    const interviewId = `int_${Date.now()}`;
    const newInterview = {
      id: interviewId,
      userId: req.user?.id || 'student-123',
      targetRole,
      experienceLevel,
      companyType,
      difficulty,
      interviewType,
      programmingLanguage,
      numQuestions,
      questions,
      answers: [],
      overallScore: 0,
      grammarScore: 0,
      technicalScore: 0,
      confidenceScore: 0,
      communicationScore: 0,
      fluencyScore: 0,
      completenessScore: 0,
      createdAt: new Date().toISOString(),
      recommendedResources: [
        { title: `${targetRole} Interview Guide & Best Practices`, type: 'article', url: 'https://roadmap.sh' },
        { title: `Mastering ${interviewType} Interviews`, type: 'course', url: 'https://leetcode.com' },
        { title: `System Architecture & ${programmingLanguage} Deep Dive`, type: 'practice', url: 'https://github.com' }
      ]
    };

    mockInterviewsDB.set(interviewId, newInterview);

    res.status(201).json({
      success: true,
      message: 'Interview session created successfully',
      data: newInterview,
    });
  } catch (error) {
    next(error);
  }
}

export async function evaluateAnswer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { interviewId, question, userAnswer, targetRole = 'Software Engineer' } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ success: false, message: 'Question and User Answer are required' });
    }

    const evaluation = await aiService.evaluateInterviewAnswer(question, userAnswer, targetRole);

    if (interviewId && mockInterviewsDB.has(interviewId)) {
      const interview = mockInterviewsDB.get(interviewId);
      interview.answers.push({ question, userAnswer, ...evaluation });

      const totalScores = interview.answers.reduce((acc: number, cur: any) => acc + cur.score, 0);
      const totalGrammar = interview.answers.reduce((acc: number, cur: any) => acc + (cur.grammarScore || cur.score), 0);
      const totalTech = interview.answers.reduce((acc: number, cur: any) => acc + (cur.technicalScore || cur.score), 0);
      const totalConf = interview.answers.reduce((acc: number, cur: any) => acc + (cur.confidenceScore || cur.score), 0);
      const totalComm = interview.answers.reduce((acc: number, cur: any) => acc + (cur.communicationScore || cur.score), 0);
      const totalFluency = interview.answers.reduce((acc: number, cur: any) => acc + (cur.fluencyScore || cur.score), 0);
      const totalComplete = interview.answers.reduce((acc: number, cur: any) => acc + (cur.completenessScore || cur.score), 0);

      const count = interview.answers.length;
      interview.overallScore = Math.round(totalScores / count);
      interview.grammarScore = Math.round(totalGrammar / count);
      interview.technicalScore = Math.round(totalTech / count);
      interview.confidenceScore = Math.round(totalConf / count);
      interview.communicationScore = Math.round(totalComm / count);
      interview.fluencyScore = Math.round(totalFluency / count);
      interview.completenessScore = Math.round(totalComplete / count);

      mockInterviewsDB.set(interviewId, interview);
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserInterviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    let interviews = Array.from(mockInterviewsDB.values()).filter(i => i.userId === userId);

    if (interviews.length === 0) {
      interviews = initialSampleInterviews;
    }

    res.json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const interview = mockInterviewsDB.get(id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
}

export async function deleteInterview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const exists = mockInterviewsDB.has(id);

    if (exists) {
      mockInterviewsDB.delete(id);
    }

    res.json({ success: true, message: 'Interview deleted successfully' });
  } catch (error) {
    next(error);
  }
}
