import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { controllers } from './app/controllers';
import { services } from './app/services';
import { MailerConfigService } from './configs/mailer.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { TypeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),
  ],
  providers: [...controllers, ...services],
})
export class AppModule {}
