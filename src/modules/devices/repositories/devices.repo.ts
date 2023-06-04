import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Devices } from '../devices.schema';
import { CreateDevicesDbDto } from '../dto/input/create.devices.dto';
import { DeleteDeviceDto } from '../dto/input/delete.device.dto';
import { UpdateDevicesDto } from '../dto/input/update.devices.dto';

@Injectable()
export class DevicesRepo {
  constructor(
    @InjectModel(Devices.name) private devicesModel: Model<Devices>,
  ) {}

  async createDevices(dto: CreateDevicesDbDto) {
    return await this.devicesModel.create(dto);
  }

  async updateDevices(dto: UpdateDevicesDto) {
    const { userId, deviceId, ip, lastActiveDate } = dto;

    return await this.devicesModel.updateOne(
      { userId, deviceId, ip },
      { $set: { lastActiveDate } },
    );
  }

  async deleteAllDevicesExceptCurrent(dto: DeleteDeviceDto) {
    const { userId, deviceId } = dto;

    return await this.devicesModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteOneDevice(dto: DeleteDeviceDto) {
    const { userId, deviceId } = dto;

    return await this.devicesModel.deleteOne({ userId, deviceId });
  }

  async checkDevice(userId: string, deviceId: string) {
    const result = await this.devicesModel.findOne({ userId, deviceId });

    if (!result) return false;

    return result;
  }
}
