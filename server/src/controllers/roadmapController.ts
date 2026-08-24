import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function getRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    let roadmap = await prisma.learningRoadmap.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tasks: { orderBy: [{ month: 'asc' }, { week: 'asc' }] } },
    });

    if (!roadmap) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const targetRole = user?.targetRole || 'Software Engineer';
      const skillGaps = await prisma.skillGap.findMany({ where: { userId } });
      const missingSkills = skillGaps
        .filter((s) => s.status === 'MISSING' || s.status === 'WEAK')
        .map((s) => s.skillName);

      const aiRoadmap = await aiService.generateRoadmap({
        targetRole,
        userSkills: ['Python', 'SQL'],
        missingSkills: missingSkills.length > 0 ? missingSkills : ['AWS Cloud Services', 'Docker'],
      });

      roadmap = await prisma.learningRoadmap.create({
        data: {
          userId,
          title: aiRoadmap.title,
          targetRole: aiRoadmap.targetRole,
          durationDays: aiRoadmap.durationDays,
          tasks: {
            create: aiRoadmap.tasks.map((t) => ({
              month: t.month,
              week: t.week,
              title: t.title,
              description: t.description,
              category: t.category,
              resources: JSON.stringify(t.resources),
              priority: (t.priority as any) || 'MEDIUM',
            })),
          },
        },
        include: { tasks: { orderBy: [{ month: 'asc' }, { week: 'asc' }] } },
      });
    }

    const formattedTasks = roadmap.tasks.map((t) => ({
      ...t,
      resources: JSON.parse(t.resources || '[]'),
    }));

    return res.json({
      success: true,
      roadmap: {
        ...roadmap,
        tasks: formattedTasks,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleTaskComplete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const task = await prisma.roadmapTask.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updatedTask = await prisma.roadmapTask.update({
      where: { id: taskId },
      data: { isCompleted: !task.isCompleted },
    });

    // Recalculate roadmap overall progress percentage
    const allTasks = await prisma.roadmapTask.findMany({ where: { roadmapId: task.roadmapId } });
    const completedCount = allTasks.filter((t) => t.isCompleted).length;
    const newProgress = Math.round((completedCount / max(1, allTasks.length)) * 100);

    await prisma.learningRoadmap.update({
      where: { id: task.roadmapId },
      data: { progress: newProgress },
    });

    return res.json({
      success: true,
      task: {
        ...updatedTask,
        resources: JSON.parse(updatedTask.resources || '[]'),
      },
      newRoadmapProgress: newProgress,
    });
  } catch (error) {
    next(error);
  }
}

export async function addCustomTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { roadmapId, month, week, title, description, category, priority } = req.body;

    const task = await prisma.roadmapTask.create({
      data: {
        roadmapId,
        month: month || 1,
        week: week || 1,
        title,
        description: description || '',
        category: category || 'Learning',
        priority: priority || 'MEDIUM',
        resources: JSON.stringify(['Custom Learning Task']),
      },
    });

    return res.status(201).json({
      success: true,
      task: {
        ...task,
        resources: JSON.parse(task.resources || '[]'),
      },
    });
  } catch (error) {
    next(error);
  }
}

function max(a: number, b: number) {
  return a > b ? a : b;
}
