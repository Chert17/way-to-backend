import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Devices } from '../devices.schema';
import { CreateDevicesDbDto } from '../dto/input/create.devices.dto';

@Injectable()
export class DevicesRepo {
  constructor(
    @InjectModel(Devices.name) private devicesModel: Model<Devices>,
  ) {}

  async createDevices(dto: CreateDevicesDbDto) {
    return await this.devicesModel.create(dto);
  }
}
