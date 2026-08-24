import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getCareerAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const skillGaps = await prisma.skillGap.findMany({ where: { userId } });
    const jobMatches = await prisma.jobMatch.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });

    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const applications = await prisma.application.findMany({ where: { userId } });
    const roadmap = await prisma.learningRoadmap.findFirst({ where: { userId } });

    // Application funnel statistics
    const funnel = {
      saved: applications.filter((a) => a.status === 'SAVED').length,
      applied: applications.filter((a) => a.status === 'APPLIED').length,
      interview: applications.filter((a) => a.status === 'INTERVIEW').length,
      rejected: applications.filter((a) => a.status === 'REJECTED').length,
      selected: applications.filter((a) => a.status === 'SELECTED').length,
      total: applications.length,
    };

    // Skill Radar Data
    const skillRadar = skillGaps.map((sg) => ({
      skill: sg.skillName,
      userProficiency: sg.userProficiency,
      requiredProficiency: sg.requiredProficiency,
      status: sg.status,
    }));

    // Job Match History Graph
    const matchHistory = jobMatches.map((jm) => ({
      company: jm.job.company,
      role: jm.job.title,
      score: jm.matchScore,
      date: jm.createdAt.toISOString().split('T')[0],
    }));

    return res.json({
      success: true,
      analytics: {
        funnel,
        skillRadar,
        matchHistory,
        roadmapProgress: roadmap?.progress || 42,
        interviewCount: interviews.length,
        avgInterviewScore: interviews.length > 0 ? Math.round(interviews.reduce((acc, i) => acc + i.overallScore, 0) / interviews.length) : 76,
      },
    });
  } catch (error) {
    next(error);
  }
}
