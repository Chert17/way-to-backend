import { Controller } from '@nestjs/common';

import { DevicesService } from './devices.service';
import { DevicesQueryRepo } from './repositories/devices.query.repo';

@Controller('devices')
export class DevicesController {
  constructor(
    private devicesQueryRepo: DevicesQueryRepo,
    private devicesService: DevicesService,
  ) {}
}
