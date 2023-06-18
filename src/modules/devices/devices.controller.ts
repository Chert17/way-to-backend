import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RefreshTokenPayload } from '../../infra/decorators/params/req.refresh.token.decorator';
import { RefreshTokenGuard } from '../../infra/guards/refresh.token.guard';
import { ReqUserType } from '../../types/req.user.interface';
import { DeleteDeviceCommand } from './use-case/delete.device.use-case';
import { DeleteDevicesExpectCurrentCommand } from './use-case/delete.devices.expect.current.use-case';
import { GetAllDevicesCommand } from './use-case/get.all.devices.use-case';

@Controller('security/devices')
@UseGuards(RefreshTokenGuard)
export class DevicesController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  findAll(@RefreshTokenPayload() refreshPayload: ReqUserType) {
    return this.commandBus.execute(new GetAllDevicesCommand(refreshPayload));
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOneDevice(
    @Param('deviceId') deviceId: string,
    @RefreshTokenPayload() refreshPayload: ReqUserType,
  ) {
    return this.commandBus.execute(
      new DeleteDeviceCommand({
        deviceId,
        userId: refreshPayload.userId,
      }),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAllDevicesExceptCurrent(
    @RefreshTokenPayload() refreshPayload: ReqUserType,
  ) {
    return this.commandBus.execute(
      new DeleteDevicesExpectCurrentCommand(refreshPayload),
    );
  }
}
