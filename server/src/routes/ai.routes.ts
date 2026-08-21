import { Router } from 'express';
import {
  analyzeProblem,
  prioritizeTasks,
  planDay,
  planTomorrow,
  assistantChat,
  getProductivityInsights
} from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/analyze-problem', analyzeProblem);
router.post('/prioritize-tasks', prioritizeTasks);
router.post('/plan-day', planDay);
router.post('/plan-tomorrow', planTomorrow);
router.post('/assistant', assistantChat);
router.get('/insights', getProductivityInsights);

export default router;
