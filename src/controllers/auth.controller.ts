import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authDb } from '../db/auth.db';
import { nanoid } from 'nanoid';

const ACCESS_SECRET  = process.env.JWT_SECRET      || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const accessOpts  = { httpOnly: true, sameSite: "lax" as const, maxAge: 15 * 60 * 1000 };
const refreshOpts = { httpOnly: true, sameSite: "lax" as const, maxAge: 7  * 24 * 60 * 60 * 1000 };

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  authDb.read();
  const existingUser = authDb.data!.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: nanoid(),
    email,
    password: hashedPassword,
    role: 'user' as const,
  };

  authDb.data!.users.push(newUser);
  authDb.write();

  return res.status(201).json({ message: 'User registered successfully' });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  authDb.read();
  const user = authDb.data!.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken  = jwt.sign({ userId: user.id, role: user.role }, ACCESS_SECRET,  { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  res
    .cookie('accessToken',  accessToken,  { ...accessOpts, secure: process.env.NODE_ENV === 'production' })
    .cookie('refreshToken', refreshToken, { ...refreshOpts, secure: process.env.NODE_ENV === 'production' })
    .json({ message: 'Logged in' });
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    authDb.read();
    const user = authDb.data!.users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const newAccess = jwt.sign({ userId: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
    res.cookie('accessToken', newAccess, { ...accessOpts, secure: process.env.NODE_ENV === 'production' })
       .json({ message: 'refreshed' });
  } catch {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (_: Request, res: Response) =>
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
