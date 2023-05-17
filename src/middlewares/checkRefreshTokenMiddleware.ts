import { NextFunction, Request, Response } from 'express';

import { getTokenIat } from '../helpers/get.token.iat';
import { jwtService, tokenRepo } from '../repositories/auth/auth.composition';
import { STATUS_CODE } from '../utils/status.code';

export const checkRefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;
  const ip = req.ip;

  if (!refreshToken) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // empty refreshToken

  const userId = await jwtService.getUserIdByToken(refreshToken);

  if (!userId) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // invalid refreshToken

  const deviceId = await jwtService.getDeviceIdByToken(refreshToken);

  if (!deviceId) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // invalid refreshToken

  const issuesAt = getTokenIat(refreshToken);

  const isValidRefreshToken = await tokenRepo.checkRefreshToken(
    issuesAt,
    deviceId,
    ip
  );

  if (!isValidRefreshToken) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // not found in database

  req.userId = userId.toString();
  req.deviceId = deviceId;
  return next();
};
