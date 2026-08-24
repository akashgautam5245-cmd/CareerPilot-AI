import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getSavedAndAppliedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const saved = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            matches: { where: { userId } },
          },
        },
      },
    });

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            matches: { where: { userId } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({
      success: true,
      savedJobs: saved.map((s) => ({
        ...s,
        job: {
          ...s.job,
          match: s.job.matches[0] || null,
        },
      })),
      applications: applications.map((a) => ({
        ...a,
        job: {
          ...a.job,
          match: a.job.matches[0] || null,
        },
        statusHistory: JSON.parse(a.statusHistory || '[]'),
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleSaveJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { jobId } = req.body;

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      await prisma.savedJob.delete({
        where: { userId_jobId: { userId, jobId } },
      });
      return res.json({ success: true, isSaved: false, message: 'Job removed from saved list' });
    } else {
      await prisma.savedJob.create({
        data: { userId, jobId },
      });
      return res.json({ success: true, isSaved: true, message: 'Job saved successfully' });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { jobId, status, notes } = req.body;

    const existing = await prisma.application.findFirst({
      where: { userId, jobId },
    });

    if (existing) {
      const history = JSON.parse(existing.statusHistory || '[]');
      history.push({ status, date: new Date().toISOString() });

      const updated = await prisma.application.update({
        where: { id: existing.id },
        data: {
          status: status as any,
          notes: notes !== undefined ? notes : existing.notes,
          statusHistory: JSON.stringify(history),
        },
      });

      return res.json({ success: true, application: updated });
    } else {
      const newApp = await prisma.application.create({
        data: {
          userId,
          jobId,
          status: (status as any) || 'APPLIED',
          notes: notes || '',
          statusHistory: JSON.stringify([{ status: status || 'APPLIED', date: new Date().toISOString() }]),
        },
      });
      return res.status(201).json({ success: true, application: newApp });
    }
  } catch (error) {
    next(error);
  }
}
