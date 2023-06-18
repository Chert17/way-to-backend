import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReqUserType } from '../../../types/req.user.interface';
import { DevicesService } from '../devices.service';
import { DevicesQueryRepo } from '../repositories/devices.query.repo';
import { DevicesRepo } from '../repositories/devices.repo';

export class GetAllDevicesCommand {
  constructor(public dto: ReqUserType) {}
}

@CommandHandler(GetAllDevicesCommand)
export class GetAllDevicesUseCase
  implements ICommandHandler<GetAllDevicesCommand>
{
  constructor(
    private devicesService: DevicesService,
    private devicesRepo: DevicesRepo,
    private devicesQueryRepo: DevicesQueryRepo,
  ) {}

  async execute({ dto }: GetAllDevicesCommand) {
    const { deviceId, userId, iat } = dto;

    const device = await this.devicesRepo.getDeviceById(deviceId);

    this.devicesService.checkDevice(device, userId, iat);

    return this.devicesQueryRepo.getAllDevices(userId);
  }
}
