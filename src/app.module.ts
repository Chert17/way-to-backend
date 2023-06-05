import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { controllers } from './app/app.controllers';
import { mongooseModels } from './app/app.mongo.models';
import { repo } from './app/app.repositories';
import { services } from './app/app.services';
import { validators } from './app/app.validators';
import { MailerConfigService } from './configs/mailer.config';
import { ThrottleConfigService } from './configs/throttle.config';
import { MongoModule } from './modules/db-module/mongoose.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forFeature(mongooseModels),
    MailerModule.forRootAsync({ useClass: MailerConfigService }),
    ThrottlerModule.forRootAsync({ useClass: ThrottleConfigService }),

    MongoModule, // in modules/db-module , bacause need for test
  ],
  controllers: [...controllers],
  providers: [...validators, ...services, ...repo],
})
export class AppModule {}
