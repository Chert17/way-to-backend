import { Module } from '@nestjs/common';

import { JwtService } from '../auth/jwt.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [
    // service
    TelegramService,
    UsersRepo,
    JwtService,
  ],
})
export class TelegramModule {}
