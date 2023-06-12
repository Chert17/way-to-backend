import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { BanUser } from '../modules/users/entities/ban.user';
import { ConfirmEmail } from '../modules/users/entities/confirm.email';
import { Device } from '../modules/users/entities/devices';
import { RecoveryPassword } from '../modules/users/entities/recovery.pass';
import { User } from '../modules/users/entities/user.entity';
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
      // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      entities: [User, ConfirmEmail, RecoveryPassword, Device, BanUser],
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
