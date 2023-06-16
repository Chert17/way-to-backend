import { Response } from 'express';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

import { UserAgent } from '../../infra/decorators/params/req.user.agent.decorator';
import { SETTINGS } from '../../utils/settings';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { LoginDto } from './dto/input/login.dto';
import { JwtTokensViewDto } from './dto/view/jwt.tokens.view.dto';
import { ConfirmRegisterUserCommand } from './use-case/confirm.register.use-case';
import { LoginUserCommand } from './use-case/login.use-case';
import { RegisterUserCommand } from './use-case/register.use-case';

const { COOKIE_HTTP_ONLY, COOKIE_SECURE, REFRESH_TOKEN_COOKIE_NAME } = SETTINGS;

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  register(@Body() dto: CreateUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Post('/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  confirmRegister(@Body() dto: ConfirmRegisterDto) {
    return this.commandBus.execute(new ConfirmRegisterUserCommand(dto.code));
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const { accessToken, refreshToken } = await await this.commandBus.execute<
      LoginUserCommand,
      JwtTokensViewDto
    >(new LoginUserCommand({ ...dto, ip, userAgent }));

    this._setRefreshTokenToCookie(res, refreshToken);

    return { accessToken };
  }

  private _setRefreshTokenToCookie(res: Response, refreshToken: string) {
    return res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: Boolean(this.configService.get(COOKIE_HTTP_ONLY)),
      secure: Boolean(this.configService.get(COOKIE_SECURE)),
    });
  }
}
