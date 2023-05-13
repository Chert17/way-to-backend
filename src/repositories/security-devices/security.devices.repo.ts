import { WithId } from "mongodb";

import { userSecurityDevicesCollection } from "../../db/db.collections";
import { IUserSecurityDevicesDb } from "../../db/db.types";

export const userSecurityDevicesRepo = {
  deleteOneSessionByUserDevice: async (
    userId: string,
    deviceId: string,
    ip: string
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await userSecurityDevicesCollection.findOneAndDelete({
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

  deleteAllDevicesExpectCurrentSession: async (
    userId: string,
    deviceId: string
  ) => {
    try {
      const result = await userSecurityDevicesCollection.deleteMany({
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
