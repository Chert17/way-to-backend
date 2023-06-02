import { Module } from '@nestjs/common';

import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesQueryRepo } from './repositories/devices.query.repo';
import { DevicesRepo } from './repositories/devices.repo';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, DevicesQueryRepo, DevicesRepo],
})
export class DevicesModule {}
