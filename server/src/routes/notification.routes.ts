import { Router } from 'express';
import { getNotifications, markNotificationAsRead, markAllNotificationsRead } from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getNotifications);
router.put('/read-all', markAllNotificationsRead);
router.put('/:id/read', markNotificationAsRead);

export default router;
