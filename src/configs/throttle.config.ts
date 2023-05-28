import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerOptionsFactory } from '@nestjs/throttler';

import { SETTINGS } from '../utils/settings';

@Injectable()
export class ThrottleConfigService implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createThrottlerOptions() {
    return {
      ttl: this.configService.get(SETTINGS.THROTTLE_TTL),
      limit: this.configService.get(SETTINGS.THROTTLR_LIMIT),
    };
  }
}
