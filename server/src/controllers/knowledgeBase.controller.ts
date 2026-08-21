import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getKnowledgeBaseEntries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { search, category, tag } = req.query;

    const where: any = { userId };
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { problemSummary: { contains: String(search), mode: 'insensitive' } },
        { solution: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (category) where.category = String(category);
    if (tag) where.tags = { has: String(tag) };

    const entries = await prisma.knowledgeBaseEntry.findMany({
      where,
      orderBy: { usageCount: 'desc' },
      include: { problem: true },
    }).catch(() => []);

    return res.json({ success: true, entries, count: entries.length });
  } catch (error) {
    next(error);
  }
}

export async function incrementKnowledgeBaseUsage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const entry = await prisma.knowledgeBaseEntry.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    }).catch(() => null);

    return res.json({ success: true, entry });
  } catch (error) {
    next(error);
  }
}
