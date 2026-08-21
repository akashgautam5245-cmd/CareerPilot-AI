import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }).catch(() => []);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    return res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    }).catch(() => null);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    }).catch(() => null);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
