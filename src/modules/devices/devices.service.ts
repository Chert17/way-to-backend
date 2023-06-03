import { Injectable } from '@nestjs/common';

import { CreateDevicesServiceDto } from './dto/input/create.devices.dto';
import { UpdateDevicesDto } from './dto/input/update.devices.dto';
import { DevicesRepo } from './repositories/devices.repo';

@Injectable()
export class DevicesService {
  constructor(private devicesRepo: DevicesRepo) {}

  async createNewDevice(dto: CreateDevicesServiceDto) {
    return await this.devicesRepo.createDevices({
      ...dto,
      title: dto.deviceName,
    });
  }

  async updateDevice(dto: UpdateDevicesDto) {
    return await this.devicesRepo.updateDevices(dto);
  }
}
