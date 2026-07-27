import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AI Resume Analyzer & Interview Coach API',
    version: '1.0.0',
    description: 'Production-ready REST API for ATS Resume Scoring, AI Mock Interviews, Skill Gap Analysis, and Job Tracking.',
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local Development Server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/signup': { post: { summary: 'Register new student account' } },
    '/auth/login': { post: { summary: 'Login user with JWT response' } },
    '/resumes/upload': { post: { summary: 'Upload & Parse PDF/DOCX Resume up to 10MB' } },
    '/ats/analyze': { post: { summary: 'Run 10+ metric ATS resume analysis' } },
    '/interview/start': { post: { summary: 'Generate dynamic AI Mock Interview questions' } },
    '/skillgap/analyze': { post: { summary: 'Compare resume skills against target role matrix' } },
    '/jobs': { get: { summary: 'Get list of tracked job applications' }, post: { summary: 'Track new job application' } },
  },
};

const router = Router();
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/docs.json', (req, res) => res.json(swaggerSpec));

export default router;
