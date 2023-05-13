import { ObjectId, WithId } from "mongodb";

import { userSecurityDevicesCollection } from "../../db/db.collections";
import { IUserSecurityDevicesDb } from "../../db/db.types";

export const tokenRepo = {
  addRefreshTokenMeta: async (
    refreshTokenMeta: IUserSecurityDevicesDb
  ): Promise<ObjectId | null> => {
    try {
      const result = await userSecurityDevicesCollection.insertOne(
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
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await userSecurityDevicesCollection.findOne({
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
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await userSecurityDevicesCollection.findOneAndUpdate(
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
};
