import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../infra/guards/jwt.auth.guard';
import { TelegramUpdateMessage } from './dto/update.message.dto';

@Controller('integrations/telegram')
export class TelegramController {
  @Post('/webhook')
  @HttpCode(HttpStatus.NO_CONTENT)
  connect(@Body() payload: TelegramUpdateMessage) {
    console.log("I'M HERE", payload);

    return { payload };
  }

  @Get('/auth-bot-link')
  @UseGuards(JwtAuthGuard)
  getLink() {}
}
