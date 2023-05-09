import { ObjectId, WithId } from 'mongodb';

import { usersDbCollection } from '../../db/db.collections';
import { IUserDb } from '../../db/db.types';

export const userRepo = {
  createUser: async (user: IUserDb): Promise<ObjectId | null> => {
    try {
      const result = await usersDbCollection.insertOne(user);

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },

  deleteUser: async (userId: string): Promise<WithId<IUserDb> | null> => {
    try {
      if (!ObjectId.isValid(userId)) return null;

      const result = await usersDbCollection.findOneAndDelete({
        _id: new ObjectId(userId),
      });

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },
};
