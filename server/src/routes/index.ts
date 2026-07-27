import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import atsRoutes from './ats.routes.js';
import aiRoutes from './ai.routes.js';
import interviewRoutes from './interview.routes.js';
import skillgapRoutes from './skillgap.routes.js';
import jobRoutes from './job.routes.js';
import profileRoutes from './profile.routes.js';
import adminRoutes from './admin.routes.js';
import swaggerRoutes from './swagger.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ats', atsRoutes);
router.use('/ai', aiRoutes);
router.use('/interview', interviewRoutes);
router.use('/skillgap', skillgapRoutes);
router.use('/jobs', jobRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/', swaggerRoutes);

export default router;
