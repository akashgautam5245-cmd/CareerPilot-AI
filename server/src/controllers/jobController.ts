import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/aiService.js';

export async function createJobAndMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { title, company, location, type, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Job title and description are required' });
    }

    // 1. AI Job Analysis
    const jobAnalysis = await aiService.analyzeJob({
      jobTitle: title,
      company: company || 'Target Company',
      jobDescription: description,
    });

    // 2. Save Job to DB
    const job = await prisma.job.create({
      data: {
        title,
        company: company || 'Target Company',
        location: location || 'Remote / Hybrid',
        type: type || 'Full-time',
        description,
        requirements: JSON.stringify(jobAnalysis.keyResponsibilities || []),
        requiredSkills: JSON.stringify(jobAnalysis.requiredSkills || []),
        preferredSkills: JSON.stringify(jobAnalysis.preferredSkills || []),
        category: jobAnalysis.experienceLevel || 'Engineering',
      },
    });

    // 3. Fetch User Resume & Profile to execute Match
    const userResume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { skills: true },
    });

    const userProfile = await prisma.careerProfile.findUnique({ where: { userId } });
    let userSkillsList: string[] = [];

    if (userResume && userResume.skills) {
      userSkillsList = userResume.skills.map((s) => s.skillName);
    }
    if (userProfile && userProfile.skills) {
      try {
        const parsed = JSON.parse(userProfile.skills);
        if (Array.isArray(parsed)) {
          userSkillsList = Array.from(new Set([...userSkillsList, ...parsed]));
        }
      } catch (e) {
        // ignore
      }
    }

    if (userSkillsList.length === 0) {
      userSkillsList = ['Python', 'SQL', 'Git', 'React', 'REST APIs'];
    }

    // 4. Execute AI Job Match calculation
    const matchResult = await aiService.matchJob({
      userSkills: userSkillsList,
      resumeText: userResume ? userResume.rawText : 'Candidate skills in software development and problem solving.',
      jobTitle: title,
      jobDescription: description,
      requiredSkills: jobAnalysis.requiredSkills,
      preferredSkills: jobAnalysis.preferredSkills,
    });

    // 5. Store Job Match
    const jobMatch = await prisma.jobMatch.upsert({
      where: {
        userId_jobId: {
          userId,
          jobId: job.id,
        },
      },
      update: {
        matchScore: matchResult.matchScore,
        breakdown: JSON.stringify(matchResult.breakdown),
        whyMatch: JSON.stringify(matchResult.whyMatch),
        whyNotMatch: JSON.stringify(matchResult.whyNotMatch),
        recommendation: matchResult.recommendation,
        matchedSkills: JSON.stringify(matchResult.matchedSkills),
        missingSkills: JSON.stringify(matchResult.missingSkills),
        developingSkills: JSON.stringify(matchResult.developingSkills),
      },
      create: {
        userId,
        jobId: job.id,
        matchScore: matchResult.matchScore,
        breakdown: JSON.stringify(matchResult.breakdown),
        whyMatch: JSON.stringify(matchResult.whyMatch),
        whyNotMatch: JSON.stringify(matchResult.whyNotMatch),
        recommendation: matchResult.recommendation,
        matchedSkills: JSON.stringify(matchResult.matchedSkills),
        missingSkills: JSON.stringify(matchResult.missingSkills),
        developingSkills: JSON.stringify(matchResult.developingSkills),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Job analyzed and matched successfully',
      job,
      match: {
        ...jobMatch,
        breakdown: matchResult.breakdown,
        whyMatch: matchResult.whyMatch,
        whyNotMatch: matchResult.whyNotMatch,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        developingSkills: matchResult.developingSkills,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        matches: {
          where: { userId },
        },
      },
    });

    const formattedJobs = jobs.map((job) => {
      const match = job.matches[0] || null;
      return {
        ...job,
        requirements: JSON.parse(job.requirements || '[]'),
        requiredSkills: JSON.parse(job.requiredSkills || '[]'),
        preferredSkills: JSON.parse(job.preferredSkills || '[]'),
        match: match
          ? {
              ...match,
              breakdown: JSON.parse(match.breakdown || '{}'),
              whyMatch: JSON.parse(match.whyMatch || '[]'),
              whyNotMatch: JSON.parse(match.whyNotMatch || '[]'),
              matchedSkills: JSON.parse(match.matchedSkills || '[]'),
              missingSkills: JSON.parse(match.missingSkills || '[]'),
              developingSkills: JSON.parse(match.developingSkills || '[]'),
            }
          : null,
      };
    });

    return res.json({ success: true, jobs: formattedJobs });
  } catch (error) {
    next(error);
  }
}

export async function getJobMatchDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const match = await prisma.jobMatch.findUnique({
      where: {
        userId_jobId: { userId, jobId },
      },
    });

    return res.json({
      success: true,
      job: {
        ...job,
        requirements: JSON.parse(job.requirements || '[]'),
        requiredSkills: JSON.parse(job.requiredSkills || '[]'),
        preferredSkills: JSON.parse(job.preferredSkills || '[]'),
      },
      match: match
        ? {
            ...match,
            breakdown: JSON.parse(match.breakdown || '{}'),
            whyMatch: JSON.parse(match.whyMatch || '[]'),
            whyNotMatch: JSON.parse(match.whyNotMatch || '[]'),
            matchedSkills: JSON.parse(match.matchedSkills || '[]'),
            missingSkills: JSON.parse(match.missingSkills || '[]'),
            developingSkills: JSON.parse(match.developingSkills || '[]'),
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
}
