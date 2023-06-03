import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Devices } from '../devices.schema';
import { CreateDevicesDbDto } from '../dto/input/create.devices.dto';
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

    return await this.devicesModel.updateOne({
      userId,
      deviceId,
      ip,
      lastActiveDate,
    });
  }

  async checkDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.devicesModel.findOne({ userId, deviceId });

    if (!result) return false;

    return !!result;
  }
}
