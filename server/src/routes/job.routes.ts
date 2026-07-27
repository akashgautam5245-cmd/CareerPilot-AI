import { Router } from 'express';
import * as jobController from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.patch('/:id/status', jobController.updateJobStatus);
router.delete('/:id', jobController.deleteJob);
router.get('/analytics', jobController.getJobAnalytics);

export default router;
