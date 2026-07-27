import { Router } from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/start', interviewController.startInterview);
router.post('/evaluate-answer', interviewController.evaluateAnswer);
router.get('/', interviewController.getUserInterviews);

export default router;
