import { IUserSecurityDevicesDb } from "../../db/db.types";
import { SecurityDevicesViewModel } from "../../models/secutity.devices.models";

export const converterUserSecurityDevices = (
  data: IUserSecurityDevicesDb
): SecurityDevicesViewModel => {
  return {
    ip: data.ip,
    deviceId: data.deviceId,
    lastActiveDate: data.lastActiveDate.toISOString(),
    title: data.deviceName,
  };
};
