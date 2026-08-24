import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function getProjectRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    let projects = await prisma.projectRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (projects.length === 0) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const targetRole = user?.targetRole || 'Software Engineer';
      const skillGaps = await prisma.skillGap.findMany({ where: { userId } });
      const missingSkills = skillGaps
        .filter((s) => s.status === 'MISSING' || s.status === 'WEAK')
        .map((s) => s.skillName);

      const aiProjectRecs = await aiService.recommendProjects({
        targetRole,
        userSkills: ['Python', 'SQL', 'Git'],
        missingSkills: missingSkills.length > 0 ? missingSkills : ['AWS Cloud Services', 'Docker'],
      });

      for (const p of aiProjectRecs.projects) {
        await prisma.projectRecommendation.create({
          data: {
            userId,
            title: p.title,
            description: p.description,
            difficulty: (p.difficulty as any) || 'INTERMEDIATE',
            estimatedDuration: p.estimatedDuration,
            skillsGained: JSON.stringify(p.skillsGained),
            techStack: JSON.stringify(p.techStack),
            problemStatement: p.problemStatement,
            features: JSON.stringify(p.features),
            implementationSteps: JSON.stringify(p.implementationSteps),
            resumeValue: p.resumeValue,
            status: 'NOT_STARTED',
          },
        });
      }

      projects = await prisma.projectRecommendation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedProjects = projects.map((p) => ({
      ...p,
      skillsGained: JSON.parse(p.skillsGained || '[]'),
      techStack: JSON.parse(p.techStack || '[]'),
      features: JSON.parse(p.features || '[]'),
      implementationSteps: JSON.parse(p.implementationSteps || '[]'),
    }));

    return res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await prisma.projectRecommendation.update({
      where: { id: projectId },
      data: { status: status as any },
    });

    return res.json({
      success: true,
      message: 'Project status updated',
      project: {
        ...project,
        skillsGained: JSON.parse(project.skillsGained || '[]'),
        techStack: JSON.parse(project.techStack || '[]'),
        features: JSON.parse(project.features || '[]'),
        implementationSteps: JSON.parse(project.implementationSteps || '[]'),
      },
    });
  } catch (error) {
    next(error);
  }
}
