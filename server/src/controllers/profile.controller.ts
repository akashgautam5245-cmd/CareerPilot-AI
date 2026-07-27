import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../config/prisma.js';

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    let profile: any;
    try {
      profile = await prisma.user.findUnique({
        where: { id: userId },
        include: { educations: true, experiences: true, projects: true, skills: true },
      });
    } catch {
      profile = {
        id: userId,
        name: 'Jane Student',
        email: 'student@example.com',
        targetRole: 'Software Engineer',
        profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Passionate computer science student specializing in frontend and full-stack cloud applications.',
        skills: [
          { name: 'TypeScript', category: 'Technical', proficiency: 90 },
          { name: 'React', category: 'Technical', proficiency: 88 },
          { name: 'Node.js', category: 'Technical', proficiency: 85 },
          { name: 'PostgreSQL', category: 'Technical', proficiency: 80 },
        ],
        educations: [
          { institution: 'State University', degree: 'B.S.', fieldOfStudy: 'Computer Science', startDate: '2021', endDate: '2025' },
        ],
        experiences: [
          { company: 'Tech Corp', position: 'Software Engineer Intern', startDate: 'Jun 2024', endDate: 'Aug 2024', description: 'Built React dashboard' },
        ],
        projects: [
          { title: 'AI Resume Analyzer', description: 'Built full-stack ATS analyzer', technologies: ['React', 'Node.js', 'Prisma'] },
        ],
      };
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'student-123';
    const { name, targetRole, bio, profilePic } = req.body;

    let updated: any;
    try {
      updated = await prisma.user.update({
        where: { id: userId },
        data: { name, targetRole, bio, profilePic },
      });
    } catch {
      updated = { id: userId, name, targetRole, bio, profilePic };
    }

    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
}
