import { NextFunction, Request, Response } from "express";

import { jwtService } from "../application/jwt.service";
import { STATUS_CODE } from "../utils/status.code";

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqAuth = req.headers.authorization;

  if (!reqAuth) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    return;
  }

  const [atuhType, accessToken] = reqAuth.split(' ');

  if (atuhType !== 'Bearer') {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED); // incorrect verification by type
    return;
  }

  const userId = await jwtService.getUserIdByToken(accessToken);

  if (!userId) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED); // invalid accessToken
    return;
  }

  req.userId = userId.toString();
  next();
};
