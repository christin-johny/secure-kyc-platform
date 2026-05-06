import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import * as ERRORS from '../constants/errors';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: ERRORS.SECURITY.NO_ACCESS });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || '') as any;
    (req as any).user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: ERRORS.SECURITY.TOKEN_EXPIRED });
  }
};
