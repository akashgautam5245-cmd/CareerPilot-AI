import { Router } from 'express';
import * as atsController from '../controllers/ats.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/analyze', atsController.analyzeATS);

export default router;
