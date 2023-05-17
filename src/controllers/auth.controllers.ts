import { Request, Response } from 'express';

import { JwtService } from '../application/jwt.service';
import { getTokenIat } from '../helpers/get.token.iat';
import {
  MeViewMOdel,
  NewPasswordRecoveryInputModel,
  RegisterInputModel,
} from '../models/auth.models';
import { LoginInputModel } from '../models/users.models';
import { TokenRepo } from '../repositories/auth/token.repo';
import { userSecurityDevicesRepo } from '../repositories/security-devices/security.devices.repo';
import {
  userQueryRepo,
  userService,
} from '../repositories/users/user.composition';
import { AuthService } from '../service/auth.service';
import { TypeRequestBody } from '../types/req-res.types';
import { SETTINGS } from '../utils/settings';
import { STATUS_CODE } from '../utils/status.code';

const { COOKIE_HTTP_ONLY, COOKIE_SECURE } = SETTINGS;

export class AuthController {
  constructor(
    protected tokenRepo: TokenRepo,
    protected authService: AuthService,
    protected jwtService: JwtService
  ) {}

  async login(req: TypeRequestBody<LoginInputModel>, res: Response) {
    const { ip } = req;

    const deviceName = req.headers['user-agent'] ?? 'client';

    const { loginOrEmail, password } = req.body;

    const tokens = await this.authService.loginUser({
      loginOrEmail,
      password,
      ip,
      deviceName,
    });

    if (!tokens) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild login user & faild create tokens

    this._refreshTokenToCookieResponse(res, tokens.refreshToken);

    return res.status(STATUS_CODE.OK).json({ accessToken: tokens.accessToken });
  }

  async getMe(req: Request, res: Response) {
    const user = await userQueryRepo.getUserById(req.userId!); // because i'm checking in jwtAuthMiddleware

    if (!user) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // not found user by req.userId

    const viewUser: MeViewMOdel = {
      userId: user.id,
      login: user.login,
      email: user.email,
    };

    return res.status(STATUS_CODE.OK).json(viewUser);
  }

  async registration(req: TypeRequestBody<RegisterInputModel>, res: Response) {
    const { email, login, password } = req.body; // check in authRegisterRequestBodySchema

    const result = await this.authService.registerUser({
      email,
      login,
      password,
    });

    if (!result) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild register user

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async confirmRegistration(req: Request, res: Response) {
    return res.sendStatus(STATUS_CODE.NO_CONTENT); // all checks are carried out in authRegisterConfirmRequestBodySchema
  }

  async emailResending(req: TypeRequestBody<{ email: string }>, res: Response) {
    const result = await this.authService.updateUserConfirmCode(req.body.email);

    if (!result) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild update confirm code for user

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async refreshToken(req: Request, res: Response) {
    const { userId, deviceId, ip } = req;

    const newTokens = await this.jwtService.createJWT(userId!, deviceId!); // because i'm checking in checkRefreshTokenMiddleware

    if (!newTokens) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild create tokens

    const issuesAt = getTokenIat(newTokens.refreshToken);

    const result = await this.tokenRepo.updateRefreshToken(
      userId!, // because i'm checking in checkRefreshTokenMiddleware
      deviceId!, // because i'm checking in checkRefreshTokenMiddleware
      ip,
      issuesAt
    );

    if (!result) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild add refreshToken to addInvalidRefreshToken

    this._refreshTokenToCookieResponse(res, newTokens.refreshToken);

    return res
      .status(STATUS_CODE.OK)
      .json({ accessToken: newTokens.accessToken });
  }

  async logout(req: Request, res: Response) {
    const { userId, deviceId, ip } = req;

    const result = await userSecurityDevicesRepo.deleteOneSessionByUserDevice(
      userId!, // because i'm checking in checkRefreshTokenMiddleware
      deviceId!, // because i'm checking in checkRefreshTokenMiddleware
      ip
    );

    if (!result) return res.sendStatus(STATUS_CODE.UNAUTHORIZED); // faild add refreshToken to addInvalidRefreshToken

    res.clearCookie('refreshToken');

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async passwordRecovery(
    req: TypeRequestBody<{ email: string }>,
    res: Response
  ) {
    await this.authService.recoveryPasswordForUser(req.body.email);

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  async newPasswordForUser(
    req: TypeRequestBody<NewPasswordRecoveryInputModel>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;

    const result = await userService.updateUserPassword(
      recoveryCode,
      newPassword
    );

    if (!result) return res.sendStatus(STATUS_CODE.BAD_REQUEST); // faild update new password for user

    return res.sendStatus(STATUS_CODE.NO_CONTENT);
  }

  private _refreshTokenToCookieResponse(res: Response, refreshToken: string) {
    return res.cookie('refreshToken ', refreshToken, {
      httpOnly: Boolean(COOKIE_HTTP_ONLY),
      secure: Boolean(COOKIE_SECURE),
    });
  }
}
