import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { careerProfile: true },
    });

    return res.json({ success: true, profile: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const {
      name,
      bio,
      location,
      education,
      degree,
      college,
      gradYear,
      targetRole,
      preferredIndustry,
      experienceLevel,
      preferredJobType,
      careerGoal,
      skills,
      targetCompany,
      targetSalary,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        location,
        education,
        degree,
        college,
        gradYear: gradYear ? parseInt(gradYear) : undefined,
        targetRole,
        preferredIndustry,
        experienceLevel,
        preferredJobType,
        careerGoal,
      },
    });

    const existingProfile = await prisma.careerProfile.findUnique({ where: { userId } });

    if (existingProfile) {
      await prisma.careerProfile.update({
        where: { userId },
        data: {
          targetRole: targetRole || updatedUser.targetRole,
          targetIndustry: preferredIndustry || updatedUser.preferredIndustry,
          targetCompany,
          targetSalary,
          skills: Array.isArray(skills) ? JSON.stringify(skills) : skills,
        },
      });
    } else {
      await prisma.careerProfile.create({
        data: {
          userId,
          targetRole: targetRole || updatedUser.targetRole,
          targetIndustry: preferredIndustry || updatedUser.preferredIndustry,
          targetCompany,
          targetSalary,
          skills: Array.isArray(skills) ? JSON.stringify(skills) : JSON.stringify([]),
        },
      });
    }

    return res.json({ success: true, message: 'Career profile updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
}
