// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@utils/jwt';
import redisClient from '../config/database/redis';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    isAdmin: boolean;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const user = verifyAccessToken(token);  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMTEzOGQ5Yy1jNDhlLTQ1MWYtYTQwNC1hMWY0NzRhMmI1NzIiLCJ1c2VybmFtZSI6InVzZXIxQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NTI2Njc2NzAsImV4cCI6MTc1MjY2ODU3MH0.9QvPaZhqnWvYgGg_LEwH59D0c8xPJVea7ygo7YlM4bA
  console.log("User", user)
  if (!user) {
    return res.sendStatus(403);
  }

  req.user = user;
  next();
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(401);
  }

  const isTokenBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isTokenBlacklisted) {
    return res.sendStatus(403);
  }

  const user = verifyRefreshToken(token);
  if (!user) {
    return res.sendStatus(403);
  }
  
  // RTR: Invalidate the old refresh token by adding it to a blacklist
  await redisClient.set(`blacklist:${token}`, 'true', { 'EX': 365 * 24 * 60 * 60 });

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};


export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};