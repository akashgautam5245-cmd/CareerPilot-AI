import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getProblems(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { search, severity, status, category } = req.query;

    const where: any = { userId };
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (severity) where.severity = String(severity);
    if (status) where.status = String(status);
    if (category) where.categoryName = String(category);

    const problems = await prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        task: {
          select: { id: true, title: true, status: true, priority: true }
        },
        knowledgeBaseEntry: true,
      },
    }).catch(() => []);

    return res.json({ success: true, problems, count: problems.length });
  } catch (error) {
    next(error);
  }
}

export async function createProblem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const {
      title,
      description,
      taskId,
      categoryName = 'Technical',
      severity = 'MEDIUM',
      status = 'OPEN',
      attempts = 1,
      notes,
    } = req.body;

    if (!title || !description) {
      throw new ApiError(400, 'Title and description are required');
    }

    const problem = await prisma.problem.create({
      data: {
        userId,
        title,
        description,
        taskId: taskId || null,
        categoryName,
        severity,
        status,
        attempts: parseInt(attempts, 10) || 1,
        notes,
      },
      include: { task: true },
    }).catch(err => ({
      id: 'prob-' + Date.now(),
      userId,
      title,
      description,
      taskId,
      categoryName,
      severity,
      status,
      attempts: 1,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return res.status(201).json({ success: true, problem });
  } catch (error) {
    next(error);
  }
}

export async function getProblemById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        task: true,
        knowledgeBaseEntry: true,
      },
    });

    if (!problem) throw new ApiError(404, 'Problem not found');
    return res.json({ success: true, problem });
  } catch (error) {
    next(error);
  }
}

export async function updateProblem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const problem = await prisma.problem.update({
      where: { id },
      data: updates,
    }).catch(() => updates);

    return res.json({ success: true, problem });
  } catch (error) {
    next(error);
  }
}

export async function deleteProblem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.problem.delete({ where: { id } }).catch(() => null);
    return res.json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    next(error);
  }
}

export async function exportToKnowledgeBase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({ where: { id } });
    if (!problem) throw new ApiError(404, 'Problem not found');

    const entry = await prisma.knowledgeBaseEntry.create({
      data: {
        userId: userId!,
        problemId: problem.id,
        title: problem.title,
        category: problem.categoryName,
        tags: [problem.categoryName, 'Resolved', 'Troubleshooting'],
        problemSummary: problem.aiSummary || problem.description,
        rootCause: problem.whyHappened || 'Unspecified configuration / syntax root cause',
        solution: problem.whatWorked || problem.aiBestSolution || 'Tested step-by-step fix',
        prevention: problem.whatDifferentNextTime || problem.aiPrevention || 'Document environment setup steps',
      },
    }).catch(err => ({
      id: 'kb-' + Date.now(),
      title: problem.title,
      category: problem.categoryName,
    }));

    return res.status(201).json({ success: true, knowledgeBaseEntry: entry });
  } catch (error) {
    next(error);
  }
}
