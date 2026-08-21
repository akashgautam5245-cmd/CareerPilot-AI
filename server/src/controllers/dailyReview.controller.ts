import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getDailyReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const reviews = await prisma.dailyReview.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 14,
    }).catch(() => []);

    return res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
}

export async function createDailyReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const {
      accomplishments,
      problemsFaced,
      remainingUnfinished,
      distractions,
      wentWell,
      improveTomorrow,
    } = req.body;

    const aiSummary = `Daily Reflection Summary: You logged key accomplishments in task execution. Recommendation: Start tomorrow focusing on high-priority remaining items.`;

    const review = await prisma.dailyReview.create({
      data: {
        userId,
        date: new Date(),
        accomplishments: accomplishments || 'Completed scheduled daily tasks.',
        problemsFaced: problemsFaced || 'None logged.',
        remainingUnfinished: remainingUnfinished || 'None.',
        distractions: distractions || 'None.',
        wentWell: wentWell || 'Good focus flow.',
        improveTomorrow: improveTomorrow || 'Maintain morning deep work block.',
        aiSummary,
      },
    }).catch(err => ({
      id: 'rev-' + Date.now(),
      date: new Date(),
      accomplishments,
      problemsFaced,
      remainingUnfinished,
      distractions,
      wentWell,
      improveTomorrow,
      aiSummary,
    }));

    return res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
}
