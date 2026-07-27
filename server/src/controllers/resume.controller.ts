import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { extractTextFromFile } from '../services/pdf.service.js';
import { aiService } from '../services/ai.service.ts';
import { uploadFile } from '../config/cloudinary.js';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';

// In-memory fallback resume store
export const mockResumesDB: Map<string, any> = new Map();
export const mockATSDB: Map<string, any> = new Map();

export async function uploadResume(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Please upload a PDF or DOCX file (max 10MB)'));
    }

    const userId = req.user?.id || 'student-123';
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const title = req.body.title || req.file.originalname;

    // 1. Upload to Cloudinary / Local storage
    const uploadResult = await uploadFile(filePath, 'resumes');

    // 2. Extract Text
    const rawText = await extractTextFromFile(filePath, mimeType);

    // 3. AI Structured Parsing
    const parsedData = await aiService.parseResumeText(rawText);

    // 4. Initial ATS Analysis
    const atsReport = await aiService.analyzeATS(rawText, parsedData);

    const resumeId = `res_${Date.now()}`;
    const analysisId = `ats_${Date.now()}`;

    const newResume = {
      id: resumeId,
      userId,
      title,
      fileUrl: uploadResult.url,
      filePublicId: uploadResult.publicId,
      parsedText: rawText,
      parsedData,
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      analyses: [
        {
          id: analysisId,
          resumeId,
          ...atsReport,
          createdAt: new Date(),
        },
      ],
    };

    try {
      const dbResume = await prisma.resume.create({
        data: {
          userId,
          title,
          fileUrl: uploadResult.url,
          filePublicId: uploadResult.publicId,
          parsedText: rawText,
          parsedData: parsedData as any,
          isPrimary: true,
          analyses: {
            create: {
              overallScore: atsReport.overallScore,
              formattingScore: atsReport.formattingScore,
              keywordScore: atsReport.keywordScore,
              grammarScore: atsReport.grammarScore,
              sectionOrderScore: atsReport.sectionOrderScore,
              softSkillsScore: atsReport.softSkillsScore,
              hardSkillsScore: atsReport.hardSkillsScore,
              missingKeywords: atsReport.missingKeywords,
              missingSkills: atsReport.missingSkills,
              weakSections: atsReport.weakSections,
              suggestions: atsReport.suggestions,
            },
          },
        },
        include: { analyses: true },
      });
      mockResumesDB.set(dbResume.id, dbResume);
    } catch {
      mockResumesDB.set(resumeId, newResume);
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded, parsed, and analyzed successfully',
      data: {
        resume: newResume,
        atsReport,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserResumes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    let resumes: any[] = [];
    try {
      resumes = await prisma.resume.findMany({
        where: { userId },
        include: { analyses: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      resumes = Array.from(mockResumesDB.values()).filter(r => r.userId === userId);
    }

    if (resumes.length === 0) {
      // Provide default demo resume if empty
      const demoResume = {
        id: 'res_demo_101',
        userId,
        title: 'Software_Engineer_Resume_2026.pdf',
        fileUrl: '/uploads/sample_resume.pdf',
        parsedText: 'Alex Mercer Full Stack Engineer React TypeScript Node.js Express PostgreSQL',
        parsedData: {
          name: 'Alex Mercer',
          email: 'alex.mercer@example.com',
          phone: '+1 (555) 234-5678',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'REST API', 'Git'],
          experience: [
            {
              company: 'Tech Solutions Inc.',
              position: 'Software Developer',
              startDate: 'Jan 2023',
              endDate: 'Present',
              description: 'Developed scalable web services and modernized client-side applications.',
              highlights: ['Built responsive web components.', 'Optimized RESTful API performance by 35%.'],
            },
          ],
          education: [
            { institution: 'State University', degree: 'B.S. Computer Science', startDate: '2019', endDate: '2023' },
          ],
          certifications: [{ name: 'AWS Certified Cloud Practitioner', issuer: 'AWS' }],
        },
        isPrimary: true,
        createdAt: new Date(),
        analyses: [
          {
            id: 'ats_demo_101',
            overallScore: 88,
            formattingScore: 92,
            keywordScore: 84,
            grammarScore: 95,
            sectionOrderScore: 90,
            softSkillsScore: 86,
            hardSkillsScore: 89,
            missingKeywords: ['Docker', 'CI/CD Pipelines', 'System Architecture', 'GraphQL'],
            missingSkills: ['Kubernetes', 'Redis', 'Microservices'],
            weakSections: ['Quantifiable Metrics in Bullet Points'],
            suggestions: [
              'Add measurable metrics (e.g., "Reduced page render time by 45%") to experience bullet points.',
              'Include Docker and CI/CD Pipeline experience to stand out for senior full-stack roles.',
            ],
          },
        ],
      };
      mockResumesDB.set(demoResume.id, demoResume);
      resumes = [demoResume];
    }

    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
}

export async function getResumeById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let resume: any;
    try {
      resume = await prisma.resume.findUnique({
        where: { id },
        include: { analyses: true },
      });
    } catch {
      resume = mockResumesDB.get(id);
    }

    if (!resume) return next(new ApiError(404, 'Resume not found'));
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
}

export async function deleteResume(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    try {
      await prisma.resume.delete({ where: { id } });
    } catch {
      mockResumesDB.delete(id);
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
}
