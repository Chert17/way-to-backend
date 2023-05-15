import { ObjectId, WithId } from 'mongodb';

import { IUserDb } from '../../db/db.types';
import { UserModel } from '../../db/schema-model/user.schema.model';

export const userRepo = {
  createUser: async (user: IUserDb): Promise<WithId<IUserDb> | null> => {
    try {
      return await UserModel.create(user);
    } catch (error) {
      return null;
    }
  },

  deleteUser: async (userId: string): Promise<WithId<IUserDb> | null> => {
    try {
      if (!ObjectId.isValid(userId)) return null;

      const result = await UserModel.findOneAndDelete({
        _id: new ObjectId(userId),
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
