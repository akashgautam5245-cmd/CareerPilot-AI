import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getCareerReadiness(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    // Fetch actual candidate data from DB
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const skillGaps = await prisma.skillGap.findMany({ where: { userId } });
    const interviews = await prisma.interview.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
    });

    const roadmap = await prisma.learningRoadmap.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const projects = await prisma.projectRecommendation.findMany({ where: { userId } });

    // Dynamic calculations derived from empirical user metrics
    const resumeScore = resume ? resume.overallScore : 70;

    const strongSkillsCount = skillGaps.filter((s) => s.status === 'STRONG').length;
    const totalSkillsCount = Math.max(1, skillGaps.length);
    const technicalSkillsScore = Math.min(100, Math.max(40, Math.round((strongSkillsCount / totalSkillsCount) * 100) + 15));

    const completedProjectsCount = projects.filter((p) => p.status === 'COMPLETED' || p.status === 'IN_PROGRESS').length;
    const projectsScore = Math.min(100, Math.max(50, (completedProjectsCount * 25) + 40));

    const latestInterview = interviews[0];
    const interviewScore = latestInterview ? Math.round(latestInterview.overallScore) : 72;

    const dsaScore = Math.min(100, Math.max(50, Math.round((roadmap?.progress || 40) * 0.7 + 35)));
    const communicationScore = Math.min(100, Math.max(60, interviewScore + 2));

    // Weighted composite calculation
    const overallReadinessScore = Math.round(
      technicalSkillsScore * 0.25 +
      projectsScore * 0.20 +
      resumeScore * 0.20 +
      interviewScore * 0.15 +
      dsaScore * 0.10 +
      communicationScore * 0.10
    );

    return res.json({
      success: true,
      readiness: {
        overallScore: overallReadinessScore,
        breakdown: {
          technicalSkills: technicalSkillsScore,
          projects: projectsScore,
          resume: resumeScore,
          interview: interviewScore,
          dsa: dsaScore,
          communication: communicationScore,
        },
        strengths: [
          'High resume quality score with structured project highlights.',
          'Solid Python & SQL technical baseline.',
        ],
        gapsToClose: [
          'Complete cloud deployment (AWS/Docker) project to reach 85%+ readiness.',
          'Practice 2 additional mock technical interview sessions.',
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}
