import { Router } from 'express';
import { getKnowledgeBaseEntries, incrementKnowledgeBaseUsage } from '../controllers/knowledgeBase.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getKnowledgeBaseEntries);
router.post('/:id/usage', incrementKnowledgeBaseUsage);

export default router;
