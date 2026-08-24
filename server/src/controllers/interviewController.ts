import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function createInterviewSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { targetRole, difficulty, type } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userRole = targetRole || user?.targetRole || 'Software Engineer';

    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { skills: true },
    });

    const userSkills = resume?.skills.map((s) => s.skillName) || ['Python', 'SQL', 'Git'];
    let userProjects: string[] = [];
    if (resume?.extractedData) {
      try {
        const parsed = JSON.parse(resume.extractedData);
        userProjects = parsed.projects || [];
      } catch (e) {
        // ignore
      }
    }

    const aiInterview = await aiService.generateInterview({
      targetRole: userRole,
      difficulty: difficulty || 'Intermediate',
      interviewType: type || 'TECHNICAL',
      userSkills,
      userProjects,
    });

    const interview = await prisma.interview.create({
      data: {
        userId,
        title: aiInterview.title,
        targetRole: userRole,
        difficulty: difficulty || 'Intermediate',
        type: (type as any) || 'TECHNICAL',
        totalQuestions: aiInterview.questions.length,
        status: 'IN_PROGRESS',
        questions: {
          create: aiInterview.questions.map((q) => ({
            questionNumber: q.questionNumber,
            text: q.text,
            topic: q.topic,
            difficulty: q.difficulty,
            expectedKeyPoints: JSON.stringify(q.expectedKeyPoints),
            resumeContext: q.resumeContext || null,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    const formattedQuestions = interview.questions.map((q) => ({
      ...q,
      expectedKeyPoints: JSON.parse(q.expectedKeyPoints || '[]'),
    }));

    return res.status(201).json({
      success: true,
      interview: {
        ...interview,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAnswerAndEvaluate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { questionId, userTextAnswer, speakingDurationSeconds } = req.body;

    if (!questionId || !userTextAnswer) {
      return res.status(400).json({ success: false, message: 'Question ID and user answer text are required' });
    }

    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
      include: { interview: true },
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const expectedPoints = JSON.parse(question.expectedKeyPoints || '[]');

    // 1. Save Answer
    const answer = await prisma.interviewAnswer.create({
      data: {
        questionId,
        userTextAnswer,
        durationSeconds: speakingDurationSeconds || 45,
        fillerWordsCount: (userTextAnswer.match(/\b(um|uh|like|you know)\b/gi) || []).length,
        paceWpm: Math.min(180, Math.max(90, Math.round((userTextAnswer.split(' ').length / Math.max(1, speakingDurationSeconds || 45)) * 60))),
      },
    });

    // 2. Call AI Answer Evaluation Engine
    const evalResult = await aiService.evaluateAnswer({
      questionText: question.text,
      expectedKeyPoints: expectedPoints,
      userAnswerText,
      speakingDurationSeconds: speakingDurationSeconds || 45,
    });

    // 3. Save Evaluation
    const evaluation = await prisma.interviewEvaluation.create({
      data: {
        questionId,
        score: evalResult.score,
        technicalCorrectness: evalResult.technicalCorrectness,
        completeness: evalResult.completeness,
        relevance: evalResult.relevance,
        clarity: evalResult.clarity,
        depth: evalResult.depth,
        whatDoneWell: JSON.stringify(evalResult.whatDoneWell),
        whatMissed: JSON.stringify(evalResult.whatMissed),
        betterAnswerStructure: evalResult.betterAnswerStructure,
        topicToRevise: evalResult.topicToRevise,
      },
    });

    // 4. Update Interview overall score if all questions evaluated
    const allQuestions = await prisma.interviewQuestion.findMany({
      where: { interviewId: question.interviewId },
      include: { evaluation: true },
    });

    const evaluated = allQuestions.filter((q) => q.evaluation);
    const avgScore = evaluated.reduce((acc, q) => acc + (q.evaluation?.score || 0), 0) / Math.max(1, evaluated.length);

    await prisma.interview.update({
      where: { id: question.interviewId },
      data: {
        overallScore: Math.round(avgScore * 10) / 10,
        status: evaluated.length === allQuestions.length ? 'COMPLETED' : 'IN_PROGRESS',
      },
    });

    return res.json({
      success: true,
      answer,
      evaluation: {
        ...evaluation,
        whatDoneWell: evalResult.whatDoneWell,
        whatMissed: evalResult.whatMissed,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewResults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { interviewId } = req.params;

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        questions: {
          include: {
            answers: true,
            evaluation: true,
          },
          orderBy: { questionNumber: 'asc' },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const formattedQuestions = interview.questions.map((q) => ({
      ...q,
      expectedKeyPoints: JSON.parse(q.expectedKeyPoints || '[]'),
      evaluation: q.evaluation
        ? {
            ...q.evaluation,
            whatDoneWell: JSON.parse(q.evaluation.whatDoneWell || '[]'),
            whatMissed: JSON.parse(q.evaluation.whatMissed || '[]'),
          }
        : null,
    }));

    return res.json({
      success: true,
      interview: {
        ...interview,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
}
