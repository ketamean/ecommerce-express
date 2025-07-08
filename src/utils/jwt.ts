// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key';

interface UserPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '365d' });
};

export const verifyAccessToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
};