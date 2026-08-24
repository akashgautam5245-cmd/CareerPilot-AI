import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function getSkillGaps(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const targetRole = user?.targetRole || 'Software Engineer';

    let dbGaps = await prisma.skillGap.findMany({
      where: { userId },
      orderBy: { priorityRank: 'asc' },
    });

    if (dbGaps.length === 0) {
      // Trigger AI Skill Gap analysis if database is empty
      const resume = await prisma.resume.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { skills: true },
      });

      const userSkills = resume?.skills.map((s) => s.skillName) || ['Python', 'SQL', 'Git'];

      const aiGapResult = await aiService.analyzeSkillGap({
        userSkills,
        targetRole,
      });

      for (const sg of aiGapResult.skillGaps) {
        await prisma.skillGap.create({
          data: {
            userId,
            skillName: sg.skillName,
            status: sg.status as any,
            userProficiency: sg.userProficiency,
            requiredProficiency: sg.requiredProficiency,
            priorityRank: sg.priorityRank,
            reason: sg.reason,
            category: sg.category,
          },
        });
      }

      dbGaps = await prisma.skillGap.findMany({
        where: { userId },
        orderBy: { priorityRank: 'asc' },
      });
    }

    return res.json({
      success: true,
      targetRole,
      skillGaps: dbGaps,
    });
  } catch (error) {
    next(error);
  }
}

export async function recalculateSkillGaps(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const targetRole = user?.targetRole || 'Software Engineer';

    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { skills: true },
    });

    const userSkills = resume?.skills.map((s) => s.skillName) || ['Python', 'SQL', 'Git'];

    const aiGapResult = await aiService.analyzeSkillGap({
      userSkills,
      targetRole,
    });

    await prisma.skillGap.deleteMany({ where: { userId } });

    for (const sg of aiGapResult.skillGaps) {
      await prisma.skillGap.create({
        data: {
          userId,
          skillName: sg.skillName,
          status: sg.status as any,
          userProficiency: sg.userProficiency,
          requiredProficiency: sg.requiredProficiency,
          priorityRank: sg.priorityRank,
          reason: sg.reason,
          category: sg.category,
        },
      });
    }

    const updatedGaps = await prisma.skillGap.findMany({
      where: { userId },
      orderBy: { priorityRank: 'asc' },
    });

    return res.json({
      success: true,
      message: 'Skill gaps recalculated successfully',
      targetRole,
      skillGaps: updatedGaps,
    });
  } catch (error) {
    next(error);
  }
}
