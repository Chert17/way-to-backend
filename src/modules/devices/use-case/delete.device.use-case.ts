import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DevicesRepo } from '../repositories/devices.repo';

export class DeleteDeviceCommand {
  constructor(public dto: { userId: string; deviceId: string }) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase
  implements ICommandHandler<DeleteDeviceCommand>
{
  constructor(private devicesRepo: DevicesRepo) {}

  async execute({ dto }: DeleteDeviceCommand) {
    const { userId, deviceId } = dto;

    console.log('USE-CASE', dto);

    const device = await this.devicesRepo.getDeviceById(deviceId);

    if (!device) throw new NotFoundException();

    if (device.user_id !== userId) throw new ForbiddenException();

    return this.devicesRepo.deleteOneDevice({ deviceId, userId });
  }
}
