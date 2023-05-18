import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';

export const checkAuthUserForLikeStatusUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return next();

  const decodeToken = decode(refreshToken) as any;
  req.userId = decodeToken.userId.toString();
  return next();
};
