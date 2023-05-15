import { ObjectId, WithId } from 'mongodb';

import { IUserConfirmEmailDb } from '../../db/db.types';
import { UserConfirmEmailModel } from '../../db/schema-model/user.confirm.email.schema.model';

export const authRepo = {
  userConfirmEmail: async (
    emailConfirmation: IUserConfirmEmailDb
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
    try {
      const confirmEmail = new UserConfirmEmailModel(emailConfirmation);

      const result = await confirmEmail.save();

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },

  getConfirmEmailByCode: async (
    confirmCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
    try {
      const code = await UserConfirmEmailModel.findOne({
        confirmationCode: confirmCode,
      });

      if (!code) return null;

      return code;
    } catch (error) {
      return null;
    }
  },

  getConfirmEmailByUserId: async (
    userId: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
    try {
      const result = await UserConfirmEmailModel.findOne({ userId });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },

  updateConfirmEmailStatus: async (
    id: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
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
  },

  updateConfirmCodeByUserId: async (
    userId: string,
    newCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
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
  },
};
