import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory } from '@nestjs/jwt';

import { SETTINGS } from '../utils/settings';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions() {
    return {
      secret: this.configService.get(SETTINGS.JWT_SECRET),
      signOptions: {
        expiresIn: this.configService.get(SETTINGS.EXPIRESIN_ACCESS_TOKEN),
      },
    };
  }
}
