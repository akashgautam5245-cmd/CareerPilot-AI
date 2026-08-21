import { Router } from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/start', interviewController.startInterview);
router.post('/create-interview', interviewController.startInterview);
router.post('/evaluate-answer', interviewController.evaluateAnswer);
router.post('/evaluate', interviewController.evaluateAnswer);
router.get('/', interviewController.getUserInterviews);
router.get('/interviews', interviewController.getUserInterviews);
router.get('/:id', interviewController.getInterviewById);
router.get('/:id/scorecard', interviewController.getInterviewById);
router.delete('/:id', interviewController.deleteInterview);

export default router;
