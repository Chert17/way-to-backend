import mongoose from 'mongoose';

import { IUserSecurityDevicesDb } from '../db.types';

const UserSecurityDeviceSchema = new mongoose.Schema<IUserSecurityDevicesDb>({
  userId: { type: String, require: true },
  lastActiveDate: { type: Date, require: true },
  ip: { type: String, require: true },
  deviceName: { type: String, require: true },
  deviceId: { type: String, require: true },
});

export const UserSecurityDevicesModel = mongoose.model<IUserSecurityDevicesDb>(
  'userSecurityDevices',
  UserSecurityDeviceSchema
);
