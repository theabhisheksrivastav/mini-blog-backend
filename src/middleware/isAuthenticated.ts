import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'access_secret';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken ||
    (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as any;
    req.user = decoded;   // TS augmentation
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
