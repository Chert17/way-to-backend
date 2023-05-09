import { ObjectId, WithId } from 'mongodb';

import { userConfirmEmailDbCollection } from '../../db/db.collections';
import { IUserConfirmEmailDb } from '../../db/db.types';

export const authRepo = {
  userConfirmEmail: async (
    emailConfirmation: IUserConfirmEmailDb
  ): Promise<ObjectId | null> => {
    try {
      const result = await userConfirmEmailDbCollection.insertOne(
        emailConfirmation
      );

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },

  getConfirmEmailByCode: async (
    confirmCode: string
  ): Promise<WithId<IUserConfirmEmailDb> | null> => {
    try {
      const code = await userConfirmEmailDbCollection.findOne({
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
      const result = await userConfirmEmailDbCollection.findOne({ userId });

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

      const result = await userConfirmEmailDbCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isConfirm: true } },
        { returnDocument: 'after' }
      );

      if (!result.value) return null;

      return result.value;
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

      const result = await userConfirmEmailDbCollection.findOneAndUpdate(
        { userId },
        { $set: { confirmationCode: newCode } },
        { returnDocument: 'after' }
      );

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },
};
