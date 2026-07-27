import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/ai.service.js';
import { mockResumesDB } from './resume.controller.js';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';

export async function analyzeATS(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { resumeId } = req.body;
    let resume: any;

    if (resumeId) {
      try {
        resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      } catch {
        resume = mockResumesDB.get(resumeId);
      }
    }

    if (!resume) {
      resume = Array.from(mockResumesDB.values())[0] || {
        parsedText: 'Alex Mercer Full Stack Engineer React TypeScript Node.js PostgreSQL',
        parsedData: {
          name: 'Alex Mercer',
          email: 'alex.mercer@example.com',
          skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
          experience: [{ company: 'Tech Inc', position: 'Developer', highlights: ['Built features'] }],
          education: [{ degree: 'BS Computer Science', institution: 'State University' }],
        },
      };
    }

    const atsReport = await aiService.analyzeATS(resume.parsedText, resume.parsedData);

    res.json({
      success: true,
      message: 'ATS Resume Analysis completed successfully',
      data: atsReport,
    });
  } catch (error) {
    next(error);
  }
}
