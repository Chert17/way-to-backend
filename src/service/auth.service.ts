import { add } from 'date-fns';
import { WithId } from 'mongodb';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { v4 as uuidv4 } from 'uuid';

import { IUserConfirmEmailDb } from '../db/db.types';
import { emailManager } from '../managers/email.managers';
import { RegisterInputModel } from '../models/auth.models';
import { authRepo } from '../repositories/auth/auth.repo';
import { userQueryRepo } from '../repositories/users/user.query.repo';
import { userService } from './user.service';

export const authService = {
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
  },

  checkConfirmEmail: async (
    confirmCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
    const confirmEmail = await authRepo.getConfirmEmailByCode(confirmCode);

    if (!confirmEmail) return null; //codes not match

    if (confirmEmail.isConfirm === true) return null; // user has already been verified

    if (confirmEmail.expirationDate < new Date()) return null; // expirationDate limit exhausted  //? maybe delete confirm email data & user

    const result = await authRepo.updateConfirmEmailStatus(
      confirmEmail._id.toString()
    );

    if (!result) return null; //faild update confirm email status for user

    return result;
  },

  async updateUserConfirmCode(email: string): Promise<SentMessageInfo | null> {
    const user = await userQueryRepo.getUserByEmail(email);

    const newCode = uuidv4();

    const result = await authRepo.updateConfirmCodeByUserId(user!.id, newCode); // because i check in authResendingRequestBodySchema

    if (!result) return null; // faild update confirm code for user

    const message = await this._sendEmail(user!.email, result.confirmationCode);

    if (!message) return null; // faild sent email to user

    return message;
  },

  _createConfirmEmailByUser: async (userId: string): Promise<string | null> => {
    const emailConfirmation: IUserConfirmEmailDb = {
      userId,
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 2 }),
      isConfirm: false,
    };

    const result = await authRepo.userConfirmEmail(emailConfirmation);

    if (!result) return null; // faild add confirm email for user

    return emailConfirmation.confirmationCode;
  },

  _sendEmail: async (
    email: string,
    code: string
  ): Promise<SentMessageInfo | null> => {
    const resultMessage = await emailManager.sendEmailMessage(email, code);

    if (!resultMessage) return null; // message not sent

    return resultMessage;
  },
};
