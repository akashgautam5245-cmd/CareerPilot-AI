import { Router } from 'express';
import {
  getProblems,
  createProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
  exportToKnowledgeBase
} from '../controllers/problem.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getProblems);
router.post('/', createProblem);
router.get('/:id', getProblemById);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);
router.post('/:id/export-kb', exportToKnowledgeBase);

export default router;
