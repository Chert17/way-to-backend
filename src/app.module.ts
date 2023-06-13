import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerConfigService } from './configs/mailer.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { TypeOrmConfig } from './configs/typeorm.config';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),

    TestingModule,
    UsersModule,
  ],
})
export class AppModule {}
