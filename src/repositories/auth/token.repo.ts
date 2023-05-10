import { ObjectId, WithId } from "mongodb";

import { userRefreshTokenCollection } from "../../db/db.collections";
import { IUserRefreshTokenDb } from "../../db/db.types";

export const tokenRepo = {
  addInvalidRefreshTokenByUser: async (
    userId: string,
    refreshToken: string
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      if (!ObjectId.isValid(userId)) return null;

      const result = await userRefreshTokenCollection.findOneAndUpdate(
        { userId: userId },
        { $push: { refreshToken } },
        { returnDocument: 'after', upsert: true }
      );

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },
  checkRefreshTokenByUser: async (
    userId: string,
    refreshToken: string
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      if (!ObjectId.isValid(userId)) return null;

      const result = await userRefreshTokenCollection.findOne({
        userId,
        refreshToken: { $elemMatch: { refreshToken } },
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
