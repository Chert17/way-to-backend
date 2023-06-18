import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReqUserType } from '../../../types/req.user.interface';
import { DevicesService } from '../devices.service';
import { DevicesRepo } from '../repositories/devices.repo';

export class DeleteDevicesExpectCurrentCommand {
  constructor(public dto: ReqUserType) {}
}

@CommandHandler(DeleteDevicesExpectCurrentCommand)
export class DeleteDevicesExpectCurrentUseCase
  implements ICommandHandler<DeleteDevicesExpectCurrentCommand>
{
  constructor(
    private devicesRepo: DevicesRepo,
    private devicesService: DevicesService,
  ) {}

  async execute({ dto }: DeleteDevicesExpectCurrentCommand) {
    const { userId, deviceId, iat } = dto;

    const device = await this.devicesRepo.getDeviceById(deviceId);

    this.devicesService.checkDevice(device, userId, iat);

    return this.devicesRepo.deleteDevicesExceptCurrent(userId, deviceId);
  }
}
