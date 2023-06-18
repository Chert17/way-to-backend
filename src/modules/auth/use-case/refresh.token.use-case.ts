import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DevicesRepo } from '../../devices/repositories/devices.repo';
import { AuthService } from '../auth.service';
import { RefreshTokenServiceDto } from '../dto/input/refresh.token.dto';
import { JwtService } from '../jwt.service';

export class RefreshTokenCommand {
  constructor(public dto: RefreshTokenServiceDto) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private jwtService: JwtService,
    private devicesRepo: DevicesRepo,
    private authService: AuthService,
  ) {}

  async execute({ dto }: RefreshTokenCommand) {
    const { deviceId, iat, ip, userId, userAgent } = dto;

    const device = await this.devicesRepo.getDeviceById(deviceId);

    this.authService.checkDevice(device, userId, iat, userAgent);

    const tokens = this.jwtService.createJWT(userId, deviceId);

    const lastActiveDate = this.jwtService.getTokenIat(tokens.refreshToken);

    await this.devicesRepo.updateDevice({
      userId,
      deviceId,
      ip,
      lastActiveDate: lastActiveDate.iat,
    });

    return tokens;
  }
}
