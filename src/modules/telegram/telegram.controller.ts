import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ReqUser } from '../../infra/decorators/params/req.user.decorator';
import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthTelegramBotCommand } from './use-case/auth.bot.use-case';
import { SetAuthTelegramBotCommand } from './use-case/set.auth.bot.use-case';

@Controller('integrations/telegram')
export class TelegramController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.NO_CONTENT)
  connect(@Body() payload: any) {
    return this.commandBus.execute(new SetAuthTelegramBotCommand(payload));
  }

  @Get('/auth-bot-link')
  @UseGuards(JwtAuthGuard)
  getLink(@ReqUser() user: User) {
    return this.commandBus.execute(new AuthTelegramBotCommand(user.id));
  }
}
