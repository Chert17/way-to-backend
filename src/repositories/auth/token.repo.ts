import { ObjectId, WithId } from 'mongodb';

import { IUserSecurityDevicesDb } from '../../db/db.types';
import { UserSecurityDevicesModel } from '../../db/schema-model/user.security.device.schema.model';

export const tokenRepo = {
  addRefreshTokenMeta: async (
    refreshTokenMeta: IUserSecurityDevicesDb
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const refreshTokenDate = new UserSecurityDevicesModel(refreshTokenMeta);

      const result = await refreshTokenDate.save();

      if (!result) return null;

      return result;
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
      const result = await UserSecurityDevicesModel.findOne({
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
      const result = await UserSecurityDevicesModel.findOneAndUpdate(
        { userId, deviceId, ip },
        { $set: { lastActiveDate: issuesAt } },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
