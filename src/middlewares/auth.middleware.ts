import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../utils/env.utils';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/error.utils';

// Extend Express Request to include authId
declare module 'express-serve-static-core' {
  interface Request {
    authId?: number;
  }
}

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (payload.role !== 'admin') {
      throw new AppError(StatusCodes.FORBIDDEN, 'Admin access required');
    }
    req.authId = payload.id;
    next();
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
  }
}