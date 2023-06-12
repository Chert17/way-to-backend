import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SETTINGS } from '../utils/settings';

@Injectable()
export class TypeOrmConfig {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: this.configService.get(SETTINGS.PG_PORT),
      username: this.configService.get(SETTINGS.PG_USER_NAME),
      password: this.configService.get(SETTINGS.PG_PASS),
      database: this.configService.get(SETTINGS.PG_DB_NAME),
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    };
  }
}
