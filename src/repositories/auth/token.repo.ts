import { ObjectId, WithId } from "mongodb";

import { userRefreshTokenCollection } from "../../db/db.collections";
import { IUserRefreshTokenDb } from "../../db/db.types";

export const tokenRepo = {
  addInvalidRefreshToken: async (
    refreshToken: string
  ): Promise<ObjectId | null> => {
    try {
      const result = await userRefreshTokenCollection.insertOne({
        refreshToken: [refreshToken],
      });

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },
  checkRefreshToken: async (
    refreshToken: string
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      const result = await userRefreshTokenCollection.findOne({
        refreshToken: { $elemMatch: { refreshToken } },
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
