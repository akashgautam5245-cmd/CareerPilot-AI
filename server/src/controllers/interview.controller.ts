import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/ai.service.js';
import { prisma } from '../config/prisma.js';

const mockInterviewsDB: Map<string, any> = new Map();

export async function startInterview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { targetRole = 'Software Engineer', difficulty = 'INTERMEDIATE', interviewType = 'TECHNICAL' } = req.body;
    const questions = await aiService.generateInterviewQuestions(targetRole, difficulty, interviewType, 5);

    const interviewId = `int_${Date.now()}`;
    const newInterview = {
      id: interviewId,
      userId: req.user?.id || 'student-123',
      targetRole,
      difficulty,
      interviewType,
      questions,
      answers: [],
      overallScore: 0,
      createdAt: new Date(),
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
      interview.overallScore = Math.round(totalScores / interview.answers.length);
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
      interviews = [
        {
          id: 'int_sample_01',
          userId,
          targetRole: 'Full Stack Developer',
          difficulty: 'INTERMEDIATE',
          interviewType: 'TECHNICAL',
          overallScore: 86,
          confidenceScore: 88,
          technicalScore: 84,
          communicationScore: 90,
          createdAt: new Date(Date.now() - 86400000 * 2),
        },
        {
          id: 'int_sample_02',
          userId,
          targetRole: 'Software Engineer',
          difficulty: 'ADVANCED',
          interviewType: 'SYSTEM_DESIGN',
          overallScore: 78,
          confidenceScore: 80,
          technicalScore: 76,
          communicationScore: 82,
          createdAt: new Date(Date.now() - 86400000 * 5),
        },
      ];
    }

    res.json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
}
