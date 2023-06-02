import { Injectable } from '@nestjs/common';

import { CreateDevicesServiceDto } from './dto/input/create.devices.dto';
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
}
