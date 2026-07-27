import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../config/prisma.js';

const mockAdminUsers: Map<string, any> = new Map([
  [
    'usr_01',
    {
      id: 'usr_01',
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
      targetRole: 'Frontend Developer',
      resumesCount: 3,
      avgAtsScore: 88,
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
  ],
  [
    'usr_02',
    {
      id: 'usr_02',
      name: 'Samantha Chen',
      email: 'samantha.c@techbootcamp.io',
      role: 'STUDENT',
      status: 'ACTIVE',
      targetRole: 'Full Stack Engineer',
      resumesCount: 2,
      avgAtsScore: 92,
      createdAt: new Date(Date.now() - 86400000 * 15),
    },
  ],
  [
    'usr_03',
    {
      id: 'usr_03',
      name: 'Marcus Vance',
      email: 'marcus.v@devhub.com',
      role: 'STUDENT',
      status: 'SUSPENDED',
      targetRole: 'AI Engineer',
      resumesCount: 1,
      avgAtsScore: 65,
      createdAt: new Date(Date.now() - 86400000 * 45),
    },
  ],
  [
    'usr_04',
    {
      id: 'usr_04',
      name: 'Admin Master',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      targetRole: 'Platform Lead',
      resumesCount: 0,
      avgAtsScore: 100,
      createdAt: new Date(Date.now() - 86400000 * 90),
    },
  ],
]);

export async function getAdminMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const metrics = {
      totalUsers: 1248,
      totalResumes: 3490,
      dailyVisitors: 412,
      avgPlatformAtsScore: 84.5,
      mockInterviewsConducted: 890,
      activeJobTrackers: 2150,
      monthlyActivityTrend: [
        { month: 'Jan', users: 420, resumes: 890, interviews: 150 },
        { month: 'Feb', users: 680, resumes: 1420, interviews: 290 },
        { month: 'Mar', users: 950, resumes: 2310, interviews: 540 },
        { month: 'Apr', users: 1248, resumes: 3490, interviews: 890 },
      ],
    };
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const users = Array.from(mockAdminUsers.values());
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function toggleUserStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = mockAdminUsers.get(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    mockAdminUsers.set(id, user);

    res.json({
      success: true,
      message: `User status changed to ${user.status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    mockAdminUsers.delete(id);
    res.json({ success: true, message: 'User deleted from system' });
  } catch (error) {
    next(error);
  }
}

export async function getSystemReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const reports = [
      { id: 'rep_1', title: 'Top Missing Skills Report', date: '2026-07-25', status: 'Generated', downloadUrl: '#' },
      { id: 'rep_2', title: 'Monthly Platform Engagement', date: '2026-07-01', status: 'Generated', downloadUrl: '#' },
      { id: 'rep_3', title: 'Mock Interview Performance Benchmark', date: '2026-06-15', status: 'Archived', downloadUrl: '#' },
    ];
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
}
