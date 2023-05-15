import { WithId } from 'mongodb';

import { IUserSecurityDevicesDb } from '../../db/db.types';
import { UserSecurityDevicesModel } from '../../db/schema-model/user.security.device.schema.model';
import { converterUserSecurityDevices } from '../../helpers/converterToValidFormatData/converter.user.secutity.devices';

export const userSecurityDevicesQueryRepo = {
  getAllDevicesActiveByUser: async (userId: string) => {
    const result = await UserSecurityDevicesModel.find({ userId }).lean();

    return result.map(converterUserSecurityDevices);
  },

  getOneDeviceByDeviceId: async (
    deviceId: string
  ): Promise<WithId<IUserSecurityDevicesDb> | null> => {
    try {
      const result = await UserSecurityDevicesModel.findOne({
        deviceId,
      }).lean();

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  },
};
