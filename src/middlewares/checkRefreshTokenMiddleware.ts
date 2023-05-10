import { NextFunction, Request, Response } from "express";

import { jwtService } from "../application/jwt.service";
import { tokenRepo } from "../repositories/auth/token.repo";
import { STATUS_CODE } from "../utils/status.code";

export const checkRefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(STATUS_CODE.UNAUTHORIZED);

  const userId = await jwtService.getUserIdByToken(refreshToken);

  if (!userId) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED); // invalid refreshToken
    return;
  }

  const isInvalidRefreshToken = await tokenRepo.checkRefreshTokenByUser(
    userId.toString(),
    refreshToken
  );

  if (isInvalidRefreshToken) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED); // isInvalidRefreshToken is already in the database of used tokens
    return;
  }

  req.userId = userId.toString();
  return next();
};
