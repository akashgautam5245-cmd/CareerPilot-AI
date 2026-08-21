import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getProjectsAndCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    const projects = await prisma.project.findMany({ where: { userId } }).catch(() => []);
    const categories = await prisma.category.findMany({ where: { userId } }).catch(() => []);

    return res.json({
      success: true,
      projects: projects.length > 0 ? projects : [
        { id: 'p1', name: 'Machine Learning Coursework', color: '#8b5cf6' },
        { id: 'p2', name: 'SolveFlow AI Web App', color: '#3b82f6' },
        { id: 'p3', name: 'Internships & Career', color: '#10b981' },
      ],
      categories: categories.length > 0 ? categories : [
        { id: 'c1', name: 'Technical & Code', color: '#3b82f6' },
        { id: 'c2', name: 'Documentation', color: '#f59e0b' },
        { id: 'c3', name: 'AI & Research', color: '#ec4899' },
        { id: 'c4', name: 'Career Prep', color: '#10b981' },
      ]
    });
  } catch (error) {
    next(error);
  }
}
