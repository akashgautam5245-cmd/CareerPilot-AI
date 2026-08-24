import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function uploadResume(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const file = req.file;
    const { rawText: textInput, targetRole } = req.body;

    let resumeText = textInput || '';
    let fileName = file ? file.originalname : 'Uploaded_Resume.pdf';
    let fileType = file ? (file.originalname.endsWith('.docx') ? 'docx' : 'pdf') : 'text';

    if (file) {
      if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
        try {
          const parsedPdf = await pdfParse(file.buffer);
          resumeText = parsedPdf.text;
        } catch (pdfErr) {
          console.warn('PDF parsing error, falling back to raw buffer string:', pdfErr);
          resumeText = file.buffer.toString('utf-8');
        }
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.originalname.endsWith('.docx')
      ) {
        try {
          const docxResult = await mammoth.extractRawText({ buffer: file.buffer });
          resumeText = docxResult.value;
        } catch (docxErr) {
          console.warn('DOCX parsing error, falling back to text buffer:', docxErr);
          resumeText = file.buffer.toString('utf-8');
        }
      } else {
        resumeText = file.buffer.toString('utf-8');
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from uploaded resume. Please upload a valid PDF, DOCX, or paste text directly.',
      });
    }

    // Call Python AI Service for Resume Analysis
    const aiResult = await aiService.analyzeResume({
      resumeText,
      targetRole: targetRole || 'Software Engineer',
    });

    // Save Resume to Database
    const savedResume = await prisma.resume.create({
      data: {
        userId,
        fileName,
        fileType,
        rawText: resumeText,
        overallScore: aiResult.overallScore,
        skillsScore: aiResult.skillsScore,
        projectsScore: aiResult.projectsScore,
        experienceScore: aiResult.experienceScore,
        educationScore: aiResult.educationScore,
        structureScore: aiResult.structureScore,
        relevanceScore: aiResult.relevanceScore,
        strengths: JSON.stringify(aiResult.strengths),
        weaknesses: JSON.stringify(aiResult.weaknesses),
        recommendations: JSON.stringify(aiResult.recommendations),
        extractedData: JSON.stringify({
          skills: aiResult.extractedSkills,
          education: aiResult.extractedEducation,
          projectsCount: aiResult.extractedProjectsCount,
        }),
      },
    });

    // Populate Resume Skills
    if (aiResult.extractedSkills && aiResult.extractedSkills.length > 0) {
      for (const skillName of aiResult.extractedSkills) {
        await prisma.resumeSkill.create({
          data: {
            resumeId: savedResume.id,
            skillName,
            level: 'INTERMEDIATE',
            category: 'Technical',
          },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      resume: {
        ...savedResume,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        recommendations: aiResult.recommendations,
        extractedData: {
          skills: aiResult.extractedSkills,
          education: aiResult.extractedEducation,
          projectsCount: aiResult.extractedProjectsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getLatestResume(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { skills: true },
    });

    if (!resume) {
      return res.json({ success: true, resume: null });
    }

    return res.json({
      success: true,
      resume: {
        ...resume,
        strengths: JSON.parse(resume.strengths || '[]'),
        weaknesses: JSON.parse(resume.weaknesses || '[]'),
        recommendations: JSON.parse(resume.recommendations || '[]'),
        extractedData: JSON.parse(resume.extractedData || '{}'),
      },
    });
  } catch (error) {
    next(error);
  }
}
