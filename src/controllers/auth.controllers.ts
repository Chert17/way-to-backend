import { Request, Response } from "express";

import { jwtService } from "../application/jwt.service";
import { getTokenIat } from "../helpers/get.token.iat";
import { MeViewMOdel, RegisterInputModel } from "../models/auth.models";
import { LoginInputModel } from "../models/users.models";
import { tokenRepo } from "../repositories/auth/token.repo";
import { userQueryRepo } from "../repositories/users/user.query.repo";
import { authService } from "../service/auth.service";
import { TypeRequestBody } from "../types/req-res.types";
import { STATUS_CODE } from "../utils/status.code";

export const loginController = async (
  req: TypeRequestBody<LoginInputModel>,
  res: Response
) => {
  const { ip, originalUrl: url } = req;

  const deviceName = req.headers['user-agent'] ?? 'client';

  const { loginOrEmail, password } = req.body;

  const loginUser = { loginOrEmail, password, ip, url, deviceName };

  const tokens = await authService.loginUser(loginUser);

  if (!tokens) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild login user & faild create tokens

  _refreshTokenToCookieResponse(res, tokens.refreshToken);

  return res.status(STATUS_CODE.OK).json({ accessToken: tokens.accessToken });
};

export const getMeController = async (req: Request, res: Response) => {
  const user = await userQueryRepo.getUserById(req.userId!); // because i'm checking in jwtAuthMiddleware

  if (!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // not found user by req.userId

  const viewUser: MeViewMOdel = {
    userId: user.id,
    login: user.login,
    email: user.email,
  };

  return res.status(STATUS_CODE.OK).json(viewUser);
};

export const registrationController = async (
  req: TypeRequestBody<RegisterInputModel>,
  res: Response
) => {
  const { email, login, password } = req.body; // check in authRegisterRequestBodySchema

  const result = await authService.registerUser({ email, login, password });

  if (!result) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild register user

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const confirmRegistrationController = async (
  req: Request,
  res: Response
) => {
  return res.sendStatus(STATUS_CODE.NO_CONTENT); // all checks are carried out in authRegisterConfirmRequestBodySchema
};

export const emailResendingController = async (
  req: TypeRequestBody<{ email: string }>,
  res: Response
) => {
  const result = await authService.updateUserConfirmCode(req.body.email);

  if (!result) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild update confirm code for user

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { userId, deviceId, ip } = req;

  const newTokens = await jwtService.createJWT(userId!, deviceId!); // because i'm checking in checkRefreshTokenMiddleware

  if (!newTokens) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild create tokens

  const issuesAt = getTokenIat(newTokens.refreshToken);

  const result = await tokenRepo.updateRefreshToken(
    userId!, // because i'm checking in checkRefreshTokenMiddleware
    deviceId!, // because i'm checking in checkRefreshTokenMiddleware
    ip,
    issuesAt
  );

  if (!result) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild add refreshToken to addInvalidRefreshToken

  _refreshTokenToCookieResponse(res, newTokens.refreshToken);

  return res
    .status(STATUS_CODE.OK)
    .json({ accessToken: newTokens.accessToken });
};

export const logoutController = async (req: Request, res: Response) => {
  const { userId, deviceId, ip } = req;

  const result = await tokenRepo.deleteRefreshTokenSessionByDevice(
    userId!, // because i'm checking in checkRefreshTokenMiddleware
    deviceId!, // because i'm checking in checkRefreshTokenMiddleware
    ip
  );

  if (!result) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild add refreshToken to addInvalidRefreshToken

  res.clearCookie('refreshToken');

  return res.sendStatus(STATUS_CODE.NO_CONTENT);
};

const _refreshTokenToCookieResponse = (res: Response, refreshToken: string) =>
  res.cookie('refreshToken ', refreshToken, {
    // httpOnly: true,
    // secure: true,
  });
