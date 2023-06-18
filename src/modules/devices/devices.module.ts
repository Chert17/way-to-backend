import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '../auth/jwt.service';
import { Device } from '../users/entities/devices';
import { UsersRepo } from '../users/repositories/users.repo';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesQueryRepo } from './repositories/devices.query.repo';
import { DevicesRepo } from './repositories/devices.repo';
import { GetAllDevicesUseCase } from './use-case/get.all.devices.use-case';

@Module({
  controllers: [DevicesController],
  providers: [
    // service
    DevicesService,
    DevicesRepo,
    DevicesQueryRepo,
    JwtService,
    UsersRepo,
    // use-case
    GetAllDevicesUseCase,
  ],
  imports: [TypeOrmModule.forFeature([Device]), CqrsModule],
})
export class DevicesModule {}
