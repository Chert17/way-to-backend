import { Injectable } from '@nestjs/common';

import { CreateDevicesServiceDto } from './dto/input/create.devices.dto';
import { DeleteDeviceDto } from './dto/input/delete.device.dto';
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

  async deleteAllDevicesExceptCurrent(dto: DeleteDeviceDto) {
    return await this.devicesRepo.deleteAllDevicesExceptCurrent(dto);
  }

  async deleteOneDevice(dto: DeleteDeviceDto) {
    return await this.devicesRepo.deleteOneDevice(dto);
  }

  async deleteAllDevicesByBanUser(userId: string) {
    return await this.devicesRepo.deleteAllDevicesByBanUser(userId);
  }
}
