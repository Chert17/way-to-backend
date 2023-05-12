import { NextFunction, Request, Response } from "express";

import { rateLimitRepo } from "../repositories/rate-limit/rate.limit.repo";
import { STATUS_CODE } from "../utils/status.code";

export const checkRequestRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ip, originalUrl: url } = req;

  const tenSecondsAgo = new Date(Date.now() - 10000);

  const totalCount = await rateLimitRepo.getTotalCountRequest({
    ip,
    url,
    date: tenSecondsAgo,
  });

  if (totalCount && totalCount > 5) {
    return res.sendStatus(STATUS_CODE.Too_Many_Requests); //? >4 || >=5
  }

  await rateLimitRepo.addRequest({ ip, url, date: new Date() });

  return next();
};
