import { Router } from 'express';
import { getDailyReviews, createDailyReview } from '../controllers/dailyReview.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getDailyReviews);
router.post('/', createDailyReview);

export default router;
