import { ObjectId, WithId } from "mongodb";

import { userRefreshTokenCollection } from "../../db/db.collections";
import { IUserRefreshTokenDb } from "../../db/db.types";

export const tokenRepo = {
  addRefreshTokenMeta: async (
    refreshTokenMeta: IUserRefreshTokenDb
  ): Promise<ObjectId | null> => {
    try {
      const result = await userRefreshTokenCollection.insertOne(
        refreshTokenMeta
      );

      if (!result.acknowledged) return null;

      return result.insertedId;
    } catch (error) {
      return null;
    }
  },
  checkRefreshToken: async (
    issuesAt: Date,
    deviceId: string,
    ip: string
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      const result = await userRefreshTokenCollection.findOne({
        lastActiveDate: issuesAt,
        deviceId,
        ip,
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },

  updateRefreshToken: async (
    userId: string,
    deviceId: string,
    ip: string,
    issuesAt: Date
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      const result = await userRefreshTokenCollection.findOneAndUpdate(
        { userId, deviceId, ip },
        { $set: { lastActiveDate: issuesAt } },
        { returnDocument: 'after' }
      );

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },

  deleteRefreshTokenSessionByDevice: async (
    userId: string,
    deviceId: string,
    ip: string
  ): Promise<WithId<IUserRefreshTokenDb> | null> => {
    try {
      const result = await userRefreshTokenCollection.findOneAndDelete({
        userId,
        deviceId,
        ip,
      });

      if (!result.value) return null;

      return result.value;
    } catch (error) {
      return null;
    }
  },

  checkRequestRateLimit: async () => {},
};
