import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function askCareerAssistant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt is required' });
    }

    // Assemble RAG context from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        careerProfile: true,
        resumes: { orderBy: { createdAt: 'desc' }, take: 1 },
        skillGaps: true,
        learningRoadmaps: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    const userProfileContext = {
      name: user?.name,
      targetRole: user?.targetRole || 'Software Engineer',
      experienceLevel: user?.experienceLevel,
      resumeScore: user?.resumes[0]?.overallScore || 78,
      skills: user?.skillGaps.map((s) => s.skillName) || ['Python', 'SQL'],
      missingSkills: user?.skillGaps.filter((s) => s.status === 'MISSING').map((s) => s.skillName) || ['AWS', 'Docker'],
      roadmapProgress: user?.learningRoadmaps[0]?.progress || 40,
    };

    const response = await aiService.assistant({
      message,
      userProfile: userProfileContext,
      history: history || [],
    });

    return res.json({
      success: true,
      reply: response.reply,
      suggestedFollowUps: response.suggestedFollowUps,
    });
  } catch (error) {
    next(error);
  }
}
