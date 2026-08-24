import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware.js';
import * as authController from '../controllers/authController.js';
import * as profileController from '../controllers/profileController.js';
import * as resumeController from '../controllers/resumeController.js';
import * as jobController from '../controllers/jobController.js';
import * as skillGapController from '../controllers/skillGapController.js';
import * as roadmapController from '../controllers/roadmapController.js';
import * as projectController from '../controllers/projectController.js';
import * as interviewController from '../controllers/interviewController.js';
import * as readinessController from '../controllers/readinessController.js';
import * as assistantController from '../controllers/assistantController.js';
import * as applicationController from '../controllers/applicationController.js';
import * as analyticsController from '../controllers/analyticsController.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

// 1. Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// 2. Profile Routes
router.get('/profile', authenticate, profileController.getProfile);
router.put('/profile', authenticate, profileController.updateProfile);

// 3. Resume Routes
router.post('/resume/upload', authenticate, upload.single('resume'), resumeController.uploadResume);
router.get('/resume/latest', authenticate, resumeController.getLatestResume);

// 4. Job & Match Routes
router.post('/jobs/match', authenticate, jobController.createJobAndMatch);
router.get('/jobs', authenticate, jobController.getJobs);
router.get('/jobs/:jobId/match', authenticate, jobController.getJobMatchDetails);

// 5. Skill Gap Routes
router.get('/skill-gap', authenticate, skillGapController.getSkillGaps);
router.post('/skill-gap/recalculate', authenticate, skillGapController.recalculateSkillGaps);

// 6. Roadmap Routes
router.get('/roadmap', authenticate, roadmapController.getRoadmap);
router.patch('/roadmap/tasks/:taskId/toggle', authenticate, roadmapController.toggleTaskComplete);
router.post('/roadmap/tasks/custom', authenticate, roadmapController.addCustomTask);

// 7. Project Recommendation Routes
router.get('/projects/recommendations', authenticate, projectController.getProjectRecommendations);
router.patch('/projects/:projectId/status', authenticate, projectController.updateProjectStatus);

// 8. Interview Routes
router.post('/interview/session', authenticate, interviewController.createInterviewSession);
router.post('/interview/answer', authenticate, interviewController.submitAnswerAndEvaluate);
router.get('/interview/:interviewId/results', authenticate, interviewController.getInterviewResults);

// 9. Career Readiness Routes
router.get('/readiness', authenticate, readinessController.getCareerReadiness);

// 10. AI Career Assistant Routes
router.post('/assistant', authenticate, assistantController.askCareerAssistant);

// 11. Saved Jobs & Applications Routes
router.get('/applications', authenticate, applicationController.getSavedAndAppliedJobs);
router.post('/jobs/save', authenticate, applicationController.toggleSaveJob);
router.post('/applications/update', authenticate, applicationController.updateApplicationStatus);

// 12. Analytics Routes
router.get('/analytics', authenticate, analyticsController.getCareerAnalytics);

export default router;
