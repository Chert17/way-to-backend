import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DbType } from '../../../types/db.interface';
import { Devices } from '../devices.schema';
import { DevicesViewDto } from '../dto/view/devices.view.dto';

@Injectable()
export class DevicesQueryRepo {
  constructor(
    @InjectModel(Devices.name) private devicesModel: Model<Devices>,
  ) {}

  async getAllUserDevices(userId: string) {
    const devices = await this.devicesModel.find({ userId }).lean();

    return devices.map(this._devicesMapping);
  }

  async getDevicebyId(deviceId: string) {
    return await this.devicesModel.findOne({ deviceId }).lean();
  }

  private _devicesMapping(device: DbType<Devices>): DevicesViewDto {
    const { deviceId, ip, lastActiveDate, title } = device;

    return {
      deviceId,
      ip,
      lastActiveDate: lastActiveDate.toISOString(),
      title,
    };
  }
}
