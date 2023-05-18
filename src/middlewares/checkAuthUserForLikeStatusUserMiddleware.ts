import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';

export const checkAuthUserForLikeStatusUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqAuth = req.headers.authorization;
  if (!reqAuth) return next();

  const accessToken = reqAuth.split(' ')[1];

  const decodeToken = decode(accessToken) as any;

  req.userId = decodeToken.userId.toString();

  return next();
};
