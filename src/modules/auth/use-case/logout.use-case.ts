import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DevicesService } from '../../devices/devices.service';
import { DevicesRepo } from '../../devices/repositories/devices.repo';
import { LogoutServiceDto } from '../dto/input/logout.dto';

export class LogoutCommand {
  constructor(public dto: LogoutServiceDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private devicesRepo: DevicesRepo,
    private devicesService: DevicesService,
  ) {}

  async execute({ dto }: LogoutCommand) {
    const { deviceId, iat, userId, userAgent } = dto;

    const device = await this.devicesRepo.getDeviceById(deviceId);

    this.devicesService.checkDevice(device, userId, iat, userAgent);

    return this.devicesRepo.deleteOneDevice({ userId, deviceId });
  }
}
