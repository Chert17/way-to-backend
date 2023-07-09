import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { TelegramService } from './telegram.service';

@Controller('integrations/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('/webhook')
  connect() {}

  @Get('/auth-bot-link')
  @UseGuards(JwtAuthGuard)
  getLink() {}
}
