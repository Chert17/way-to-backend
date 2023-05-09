import { Request, Response, NextFunction } from 'express';
import { STATUS_CODE } from '../utils/status.code';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const encode = Buffer.from('admin:qwerty').toString('base64');
  const correctAuth = `Basic ${encode}`;

  if (req.headers.authorization !== correctAuth) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    return;
  }

  next();
};
