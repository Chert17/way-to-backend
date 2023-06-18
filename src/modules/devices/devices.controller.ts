import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RefreshTokenPayload } from '../../infra/decorators/params/req.refresh.token.decorator';
import { RefreshTokenGuard } from '../../infra/guards/refresh.token.guard';
import { ReqUserType } from '../../types/req.user.interface';
import { GetAllDevicesCommand } from './use-case/get.all.devices.use-case';

@Controller('security/devices')
@UseGuards(RefreshTokenGuard)
export class DevicesController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  findAll(@RefreshTokenPayload() refreshPayload: ReqUserType) {
    return this.commandBus.execute(new GetAllDevicesCommand(refreshPayload));
  }
}
