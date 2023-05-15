import { WithId } from 'mongodb';

import { IUserSecurityDevicesDb } from '../../db/db.types';
import { UserSecurityDevicesModel } from '../../db/schema-model/user.security.device.schema.model';

export const userSecurityDevicesRepo = {
  deleteOneSessionByUserDevice: async (
    userId: string,
    deviceId: string,
    ip: string
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await UserSecurityDevicesModel.findOneAndDelete({
        userId,
        deviceId,
        ip,
      });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },

  deleteAllDevicesExpectCurrentSession: async (
    userId: string,
    deviceId: string
  ) => {
    try {
      const result = await UserSecurityDevicesModel.deleteMany({
        userId,
        deviceId: { $ne: deviceId },
      });

      if (!result.acknowledged) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
