import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';

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

  @Delete('/devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDevicesExceptCurrent(
    @RefreshTokenPayload() refreshPayload: ReqUserType,
  ) {
    return await this.devicesService.deleteAllDevicesExceptCurrent(
      refreshPayload,
    );
  }

  @Delete('/devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteOneDeviceDto(
    @Param('deviceId') deviceId: string,
    @RefreshTokenPayload() refreshPayload: ReqUserType,
  ) {
    const { userId } = refreshPayload;

    const device = await this.devicesQueryRepo.getDevicebyId(deviceId);

    if (!device) throw new NotFoundException();

    if (device.userId !== userId) throw new ForbiddenException();

    return await this.devicesService.deleteOneDevice({ deviceId, userId });
  }
}
