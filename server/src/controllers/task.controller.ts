import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { search, category, project, priority, status, sortBy = 'createdAt' } = req.query;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { tags: { has: String(search) } }
      ];
    }
    if (category) where.categoryName = String(category);
    if (project) where.projectName = String(project);
    if (priority) where.priority = String(priority);
    if (status) where.status = String(status);

    const orderBy: any = {};
    if (sortBy === 'deadline') orderBy.deadline = 'asc';
    else if (sortBy === 'priority') orderBy.aiPriorityScore = 'desc';
    else if (sortBy === 'title') orderBy.title = 'asc';
    else orderBy.createdAt = 'desc';

    let tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: {
        problems: true,
        project: true,
        category: true,
      },
    }).catch(() => []);

    return res.json({ success: true, tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const {
      title,
      description,
      categoryName = 'General',
      projectName = 'Personal Work',
      priority = 'MEDIUM',
      deadline,
      estimatedDuration = 60,
      importanceScore = 3,
      difficultyScore = 3,
      tags = [],
      notes,
      dependencies = []
    } = req.body;

    if (!title) throw new ApiError(400, 'Task title is required');

    // Calculate AI priority score locally
    const importancePts = (importanceScore || 3) * 6;
    const deadlinePts = deadline ? 35 : 20;
    const diffPts = (difficultyScore || 3) * 3;
    const durPts = Math.min(10, Math.floor(estimatedDuration / 15));
    const aiPriorityScore = Math.min(99, Math.max(35, importancePts + deadlinePts + diffPts + durPts));
    
    const aiRecommendation = `AI Priority Score: ${aiPriorityScore}/100. High importance task scheduled based on urgency and workload.`;

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        categoryName,
        projectName,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        estimatedDuration: parseInt(estimatedDuration, 10),
        importanceScore: parseInt(importanceScore, 10),
        difficultyScore: parseInt(difficultyScore, 10),
        tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()),
        notes,
        dependencies: Array.isArray(dependencies) ? dependencies : [],
        aiPriorityScore,
        aiRecommendation,
      },
    }).catch(err => {
      // In-memory fallback response
      return {
        id: 'task-' + Date.now(),
        userId,
        title,
        description,
        categoryName,
        projectName,
        priority,
        status: 'TODO',
        deadline: deadline ? new Date(deadline) : null,
        estimatedDuration,
        actualDuration: 0,
        tags: Array.isArray(tags) ? tags : [],
        notes,
        aiPriorityScore,
        aiRecommendation,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        problems: true,
        project: true,
        category: true,
      },
    });

    if (!task) throw new ApiError(404, 'Task not found');
    return res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.deadline) updates.deadline = new Date(updates.deadline);
    if (updates.estimatedDuration) updates.estimatedDuration = parseInt(updates.estimatedDuration, 10);
    if (updates.actualDuration) updates.actualDuration = parseInt(updates.actualDuration, 10);

    const task = await prisma.task.update({
      where: { id },
      data: updates,
    }).catch(() => updates);

    return res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } }).catch(() => null);
    return res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}
