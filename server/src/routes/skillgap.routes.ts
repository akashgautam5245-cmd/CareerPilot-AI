import { Router } from 'express';
import * as skillgapController from '../controllers/skillgap.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/analyze', skillgapController.analyzeSkillGap);

export default router;
