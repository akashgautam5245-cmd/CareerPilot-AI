import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/enhance-bullets', aiController.enhanceBulletPoints);
router.post('/generate-summary', aiController.generateSummary);
router.post('/chat', aiController.chatAssistant);

export default router;
