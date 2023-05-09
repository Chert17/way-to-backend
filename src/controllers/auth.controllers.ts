import { Request, Response } from 'express';

import { jwtService } from '../application/jwt.service';
import { MeViewMOdel, RegisterInputModel } from '../models/auth.models';
import { LoginInputModel } from '../models/users.models';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { authService } from '../service/auth.service';
import { userService } from '../service/user.service';
import { TypeRequestBody } from '../types/req-res.types';
import { STATUS_CODE } from '../utils/status.code';

export const loginController = async (
  req: TypeRequestBody<LoginInputModel>,
  res: Response
) => {
  const { loginOrEmail, password } = req.body;

  const user = await userService.checkCredentials(loginOrEmail, password);

  if (!user) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // not found user by loginOrEmail

  const accessToken = await jwtService.createJWT(user._id);

  return res.status(STATUS_CODE.OK).json({ accessToken });
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
