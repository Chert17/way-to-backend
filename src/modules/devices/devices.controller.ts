import { Controller, Get, UseGuards } from '@nestjs/common';

import { RefreshTokenPayload } from '../../infra/decorators/param/req.refresh.token.decorator';
import { RefreshTokenGuard } from '../../infra/guards/auth/refresh.token.guard';
import { ReqUserType } from '../../types/req.user.interface';
import { DevicesService } from './devices.service';
import { DevicesQueryRepo } from './repositories/devices.query.repo';

@Controller('security')
@UseGuards(RefreshTokenGuard)
export class DevicesController {
  constructor(
    private devicesQueryRepo: DevicesQueryRepo,
    private devicesService: DevicesService,
  ) {}

  @Get('/devices')
  async getAllUserDevices(@RefreshTokenPayload() refreshPayload: ReqUserType) {
    const { userId } = refreshPayload;

    return await this.devicesQueryRepo.getAllUserDevices(userId);
  }
}
