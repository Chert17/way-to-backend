import { add } from 'date-fns';
import { WithId } from 'mongodb';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { v4 as uuidv4 } from 'uuid';

import { JwtService } from '../application/jwt.service';
import {
  IUserConfirmEmailDb,
  IUserRecoveryPasswordDb,
  IUserSecurityDevicesDb,
} from '../db/db.types';
import { getTokenIat } from '../helpers/get.token.iat';
import { emailManager } from '../managers/email.managers';
import {
  LoginInputServiceModel,
  RegisterInputModel,
  TokensViewModel,
} from '../models/auth.models';
import { AuthRepo } from '../repositories/auth/auth.repo';
import { TokenRepo } from '../repositories/auth/token.repo';
import {
  userQueryRepo,
  userService,
} from '../repositories/users/user.composition';

export class AuthService {
  constructor(
    protected authRepo: AuthRepo,
    protected tokenRepo: TokenRepo,
    protected jwtService: JwtService
  ) {}

  async registerUser({
    email,
    login,
    password,
  }: RegisterInputModel): Promise<SentMessageInfo | null> {
    const user = await userService.createUser({ email, login, password });

    if (!user) return null; // faild create user

    const code = await this._createConfirmEmailByUser(user.id);

    if (!code) return null; // faild add confirm email for user

    const message = await this._sendEmail(user.email, code);

    if (!message) return null; // faild sent email to user

    return message;
  }

  async loginUser({
    loginOrEmail,
    password,
    ip,
    deviceName,
  }: LoginInputServiceModel): Promise<TokensViewModel | null> {
    const user = await userService.checkCredentials(loginOrEmail, password);

    if (!user) return null; // not found user by loginOrEmail

    const deviceId = uuidv4();

    const tokens = await this.jwtService.createJWT(
      user._id.toString(),
      deviceId
    );

    if (!tokens) return null; // faild create tokens

    const refreshIat = getTokenIat(tokens.refreshToken);

    const refreshTokenMeta: IUserSecurityDevicesDb = {
      userId: user._id.toString(),
      lastActiveDate: refreshIat,
      ip,
      deviceName,
      deviceId,
    };

    const result = await this.tokenRepo.addRefreshTokenMeta(refreshTokenMeta); // return null if faild add refresh token meto to base

    return !result ? null : tokens;
  }

  async checkConfirmEmail(
    confirmCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    const confirmEmail = await this.authRepo.getConfirmEmailByCode(confirmCode);

    if (!confirmEmail) return null; //codes not match

    if (confirmEmail.isConfirm === true) return null; // user has already been verified

    if (confirmEmail.expirationDate < new Date()) return null; // expirationDate limit exhausted  //? maybe delete confirm email data & user

    const result = await this.authRepo.updateConfirmEmailStatus(
      confirmEmail._id.toString()
    );

    if (!result) return null; //faild update confirm email status for user

    return result;
  }
  async updateUserConfirmCode(email: string): Promise<SentMessageInfo | null> {
    const user = await userQueryRepo.getUserByEmail(email);

    const newCode = uuidv4();

    const result = await this.authRepo.updateConfirmCodeByUserId(
      user!.id,
      newCode
    ); // because i check in authResendingRequestBodySchema

    if (!result) return null; // faild update confirm code for user

    const message = await this._sendEmail(user!.email, result.confirmationCode);

    if (!message) return null; // faild sent email to user

    return message;
  }
  async recoveryPasswordForUser(
    email: string
  ): Promise<SentMessageInfo | null> {
    const user = await userQueryRepo.getUserByEmail(email);

    if (!user) return null; // not found user //?

    const message = await this._sendRecoveryPassword(user.email);

    if (!message) return null; // faild sent email to user

    return message;
  }

  private async _createConfirmEmailByUser(
    userId: string
  ): Promise<string | null> {
    const emailConfirmation: IUserConfirmEmailDb = {
      userId,
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 2 }),
      isConfirm: false,
    };

    const result = await this.authRepo.userConfirmEmail(emailConfirmation);

    if (!result) return null; // faild add confirm email for user

    return emailConfirmation.confirmationCode;
  }

  private async _sendEmail(
    email: string,
    code: string
  ): Promise<SentMessageInfo | null> {
    const resultMessage = await emailManager.sendEmailMessage(email, code);

    if (!resultMessage) return null; // message not sent

    return resultMessage;
  }

  private async _sendRecoveryPassword(
    userEmail: string
  ): Promise<SentMessageInfo | null> {
    const recoveryPasswordDate: IUserRecoveryPasswordDb = {
      userEmail,
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 2 }),
    };

    const result = await this.authRepo.recoveryPassword(recoveryPasswordDate);

    if (!result) return null; // faild add recovery password date for user
    console.log(recoveryPasswordDate.confirmationCode);

    const resultMessage = await emailManager.sendRecoveryPasswordMessage(
      userEmail,
      recoveryPasswordDate.confirmationCode
    );

    if (!resultMessage) return null; // message not sent

    return resultMessage;
  }
}
