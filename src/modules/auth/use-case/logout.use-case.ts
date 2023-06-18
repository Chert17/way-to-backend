import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DevicesRepo } from '../../devices/repositories/devices.repo';
import { AuthService } from '../auth.service';
import { LogoutServiceDto } from '../dto/input/logout.dto';

export class LogoutCommand {
  constructor(public dto: LogoutServiceDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private devicesRepo: DevicesRepo,
    private authService: AuthService,
  ) {}

  async execute({ dto }: LogoutCommand) {
    const { deviceId, iat, userId, userAgent } = dto;

    const device = await this.devicesRepo.getDeviceById(deviceId);

    this.authService.checkDevice(device, userId, iat, userAgent);

    return this.devicesRepo.deleteOneDevice({ userId, deviceId });
  }
}
