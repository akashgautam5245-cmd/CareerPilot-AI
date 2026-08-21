import { Router } from 'express';
import { getProjectsAndCategories } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getProjectsAndCategories);

export default router;
