import { WithId } from "mongodb";

import { userSecurityDevicesCollection } from "../../db/db.collections";
import { IUserSecurityDevicesDb } from "../../db/db.types";
import { converterUserSecurityDevices } from "../../helpers/converterToValidFormatData/converter.user.secutity.devices";

export const userSecurityDevicesQueryRepo = {
  getAllDevicesActiveByUser: async (userId: string) => {
    const result = await userSecurityDevicesCollection
      .find({ userId })
      .toArray();

    return result.map(converterUserSecurityDevices);
  },

  getOneDeviceByDeviceId: async (
    deviceId: string
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await userSecurityDevicesCollection.findOne({ deviceId });

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
