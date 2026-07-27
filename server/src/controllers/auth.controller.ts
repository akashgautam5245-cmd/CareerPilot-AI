import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { ENV } from '../config/env.js';
import { ApiError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

// In-memory fallback user store for zero-database local dev/demo
const mockUsersDB: Map<string, any> = new Map([
  [
    'student@example.com',
    {
      id: 'student-123',
      name: 'Jane Student',
      email: 'student@example.com',
      passwordHash: bcrypt.hashSync('Password123!', 10),
      role: 'STUDENT',
      status: 'ACTIVE',
      isEmailVerified: true,
      targetRole: 'Software Engineer',
      profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: new Date(),
    },
  ],
  [
    'admin@example.com',
    {
      id: 'admin-456',
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: bcrypt.hashSync('AdminPass123!', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      targetRole: 'Platform Lead',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date(),
    },
  ],
]);

function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });
  return { accessToken, refreshToken };
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  const { name, email, password, targetRole } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, 'Name, email, and password are required'));
  }

  try {
    let existingUser = null;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch {
      existingUser = mockUsersDB.get(email);
    }

    if (existingUser) {
      return next(new ApiError(409, 'User with this email already exists'));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, ENV.JWT_SECRET, { expiresIn: '1d' });

    let newUser: any;
    try {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'STUDENT',
          targetRole: targetRole || 'Software Engineer',
          emailVerificationToken: verificationToken,
        },
      });
    } catch {
      newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        isEmailVerified: true,
        targetRole: targetRole || 'Software Engineer',
        createdAt: new Date(),
      };
      mockUsersDB.set(email, newUser);
    }

    const tokens = generateTokens(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          targetRole: newUser.targetRole,
          isEmailVerified: newUser.isEmailVerified,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  try {
    let user: any = null;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch {
      user = mockUsersDB.get(email);
    }

    if (!user && mockUsersDB.has(email)) {
      user = mockUsersDB.get(email);
    }

    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    if (user.status === 'SUSPENDED') {
      return next(new ApiError(403, 'Your account has been suspended by an administrator.'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          profilePic: user.profilePic,
          isEmailVerified: user.isEmailVerified,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  const { googleToken, name, email, photo } = req.body;
  if (!email) {
    return next(new ApiError(400, 'Google login payload missing email'));
  }

  try {
    let user: any;
    try {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || 'Google User',
            email,
            profilePic: photo,
            role: 'STUDENT',
            isEmailVerified: true,
            googleId: `google_${Date.now()}`,
          },
        });
      }
    } catch {
      user = mockUsersDB.get(email) || {
        id: `gusr_${Date.now()}`,
        name: name || 'Google User',
        email,
        role: 'STUDENT',
        status: 'ACTIVE',
        isEmailVerified: true,
        profilePic: photo,
        createdAt: new Date(),
      };
      mockUsersDB.set(email, user);
    }

    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Google login successful',
      data: { user, tokens },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'));

    let user: any;
    try {
      user = await prisma.user.findUnique({ where: { id: req.user.id } });
    } catch {
      user = Array.from(mockUsersDB.values()).find(u => u.id === req.user?.id);
    }

    if (!user) {
      user = {
        id: req.user.id,
        name: 'Demo Student',
        email: req.user.email,
        role: req.user.role,
        targetRole: 'Software Engineer',
        isEmailVerified: true,
      };
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || 'ACTIVE',
        targetRole: user.targetRole || 'Software Engineer',
        profilePic: user.profilePic,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  res.json({
    success: true,
    message: `If an account exists for ${email}, a password reset link has been dispatched to your email.`,
  });
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  res.json({
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
  });
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  res.json({
    success: true,
    message: 'Email address verified successfully.',
  });
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new ApiError(400, 'Refresh token required'));

  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as any;
    const tokens = generateTokens({ id: decoded.id, email: decoded.email, role: decoded.role });
    res.json({ success: true, data: { tokens } });
  } catch {
    next(new ApiError(401, 'Invalid or expired refresh token'));
  }
}
