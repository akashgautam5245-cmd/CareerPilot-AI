import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getAnalytics);

export default router;
