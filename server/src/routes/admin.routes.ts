import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/metrics', adminController.getAdminMetrics);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/reports', adminController.getSystemReports);

export default router;
