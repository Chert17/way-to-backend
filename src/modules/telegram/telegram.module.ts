import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { JwtService } from '../auth/jwt.service';
import { UsersRepo } from '../users/repositories/users.repo';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { AuthTelegramBotUseCase } from './use-case/auth.bot.use-case';
import { SetAuthTelegramBotUseCase } from './use-case/set.auth.bot.use-case';

@Module({
  controllers: [TelegramController],
  providers: [
    // service
    TelegramService,
    UsersRepo,
    JwtService,
    // use-case
    AuthTelegramBotUseCase,
    SetAuthTelegramBotUseCase,
  ],
  imports: [CqrsModule],
})
export class TelegramModule {}
