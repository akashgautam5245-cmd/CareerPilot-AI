import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/errors.js';

export const mockJobsDB: Map<string, any> = new Map([
  [
    'job_01',
    {
      id: 'job_01',
      userId: 'student-123',
      company: 'Google',
      position: 'Frontend Engineer',
      status: 'INTERVIEWING',
      salary: '$140,000 / yr',
      location: 'Mountain View, CA (Remote)',
      jobUrl: 'https://careers.google.com',
      appliedDate: new Date(Date.now() - 86400000 * 14),
      interviewDate: new Date(Date.now() + 86400000 * 3),
      notes: 'Passed initial recruiter screening. Technical round scheduled for Thursday.',
      createdAt: new Date(),
    },
  ],
  [
    'job_02',
    {
      id: 'job_02',
      userId: 'student-123',
      company: 'Stripe',
      position: 'Full Stack Engineer',
      status: 'OFFER',
      salary: '$155,000 / yr',
      location: 'San Francisco, CA',
      jobUrl: 'https://stripe.com/jobs',
      appliedDate: new Date(Date.now() - 86400000 * 25),
      interviewDate: new Date(Date.now() - 86400000 * 5),
      notes: 'Received written offer! Reviewing compensation package.',
      createdAt: new Date(),
    },
  ],
  [
    'job_03',
    {
      id: 'job_03',
      userId: 'student-123',
      company: 'Meta',
      position: 'Software Engineer - AI Systems',
      status: 'APPLIED',
      salary: '$160,000 / yr',
      location: 'Menlo Park, CA',
      jobUrl: 'https://metacareers.com',
      appliedDate: new Date(Date.now() - 86400000 * 4),
      notes: 'Submitted customized resume tailored to PyTorch and distributed systems.',
      createdAt: new Date(),
    },
  ],
  [
    'job_04',
    {
      id: 'job_04',
      userId: 'student-123',
      company: 'Vercel',
      position: 'Developer Experience Advocate',
      status: 'WISHLIST',
      salary: '$135,000 / yr',
      location: 'Remote',
      jobUrl: 'https://vercel.com/careers',
      appliedDate: new Date(),
      notes: 'Preparing portfolio application.',
      createdAt: new Date(),
    },
  ],
]);

export async function getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    let jobs: any[];
    try {
      jobs = await prisma.jobApplication.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      jobs = Array.from(mockJobsDB.values()).filter(j => j.userId === userId);
    }
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
}

export async function createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    const { company, position, status = 'APPLIED', salary, location, jobUrl, interviewDate, notes } = req.body;

    if (!company || !position) {
      return next(new ApiError(400, 'Company and Position are required'));
    }

    const jobId = `job_${Date.now()}`;
    const newJob = {
      id: jobId,
      userId,
      company,
      position,
      status,
      salary,
      location,
      jobUrl,
      appliedDate: new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      notes,
      createdAt: new Date(),
    };

    try {
      const dbJob = await prisma.jobApplication.create({
        data: {
          userId,
          company,
          position,
          status,
          salary,
          location,
          jobUrl,
          interviewDate: interviewDate ? new Date(interviewDate) : undefined,
          notes,
        },
      });
      mockJobsDB.set(dbJob.id, dbJob);
    } catch {
      mockJobsDB.set(jobId, newJob);
    }

    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    next(error);
  }
}

export async function updateJobStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate } = req.body;

    let updated: any;
    try {
      updated = await prisma.jobApplication.update({
        where: { id },
        data: { status, notes, interviewDate: interviewDate ? new Date(interviewDate) : undefined },
      });
    } catch {
      if (mockJobsDB.has(id)) {
        updated = mockJobsDB.get(id);
        if (status) updated.status = status;
        if (notes) updated.notes = notes;
        if (interviewDate) updated.interviewDate = new Date(interviewDate);
        mockJobsDB.set(id, updated);
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    try {
      await prisma.jobApplication.delete({ where: { id } });
    } catch {
      mockJobsDB.delete(id);
    }
    res.json({ success: true, message: 'Job application deleted' });
  } catch (error) {
    next(error);
  }
}

export async function getJobAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    const jobs = Array.from(mockJobsDB.values()).filter(j => j.userId === userId);

    const analytics = {
      totalApplications: jobs.length,
      wishlist: jobs.filter(j => j.status === 'WISHLIST').length,
      applied: jobs.filter(j => j.status === 'APPLIED').length,
      interviewing: jobs.filter(j => j.status === 'INTERVIEWING').length,
      offers: jobs.filter(j => j.status === 'OFFER' || j.status === 'ACCEPTED').length,
      rejected: jobs.filter(j => j.status === 'REJECTED').length,
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}
