import { ObjectId, WithId } from 'mongodb';

import {
  IUserConfirmEmailDb,
  IUserRecoveryPasswordDb,
} from '../../db/db.types';
import { UserConfirmEmailModel } from '../../db/schema-model/user.confirm.email.schema.model';
import { UserRecoveryPasswordModel } from '../../db/schema-model/user.recovery.password';

export class AuthRepo {
  async userConfirmEmail(
    emailConfirmation: IUserConfirmEmailDb
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    try {
      const confirmEmail = new UserConfirmEmailModel(emailConfirmation);

      const result = await confirmEmail.save();

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async getConfirmEmailByCode(
    confirmCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    try {
      const code = await UserConfirmEmailModel.findOne({
        confirmationCode: confirmCode,
      });

      if (!code) return null;

      return code;
    } catch (error) {
      return null;
    }
  }

  async getConfirmEmailByUserId(
    userId: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    try {
      const result = await UserConfirmEmailModel.findOne({ userId });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async updateConfirmEmailStatus(
    id: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    try {
      if (!ObjectId.isValid(id)) return null;

      const result = await UserConfirmEmailModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isConfirm: true } },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async updateConfirmCodeByUserId(
    userId: string,
    newCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> {
    try {
      if (!ObjectId.isValid(userId)) return null;

      const result = await UserConfirmEmailModel.findOneAndUpdate(
        { userId },
        { $set: { confirmationCode: newCode } },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async recoveryPassword(
    recoveryPasswordDate: IUserRecoveryPasswordDb
  ): Promise<WithId<IUserRecoveryPasswordDb> | null> {
    try {
      return await UserRecoveryPasswordModel.create(recoveryPasswordDate);
    } catch (error) {
      return null;
    }
  }

  async getRecoveryPasswordDateByCode(
    confirmCode: string
  ): Promise<WithId<IUserRecoveryPasswordDb> | null> {
    try {
      const code = await UserRecoveryPasswordModel.findOne({
        confirmationCode: confirmCode,
      });

      if (!code) return null;

      return code;
    } catch (error) {
      return null;
    }
  }
}
