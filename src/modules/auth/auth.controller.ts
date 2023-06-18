import { Response } from 'express';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

import { RefreshTokenPayload } from '../../infra/decorators/params/req.refresh.token.decorator';
import { UserAgent } from '../../infra/decorators/params/req.user.agent.decorator';
import { RefreshTokenGuard } from '../../infra/guards/refresh.token.guard';
import { ReqUserType } from '../../types/req.user.interface';
import { SETTINGS } from '../../utils/settings';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { LoginDto } from './dto/input/login.dto';
import { JwtTokensViewDto } from './dto/view/jwt.tokens.view.dto';
import { ConfirmRegisterUserCommand } from './use-case/confirm.register.use-case';
import { EmailResendingCommand } from './use-case/email.resending.use-case';
import { LoginUserCommand } from './use-case/login.use-case';
import { LogoutCommand } from './use-case/logout.use-case';
import { RefreshTokenCommand } from './use-case/refresh.token.use-case';
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
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      JwtTokensViewDto
    >(new LoginUserCommand({ ...dto, ip, userAgent }));

    this._setRefreshTokenToCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  emailResending(@Body() dto: EmailResendingDto) {
    return this.commandBus.execute(new EmailResendingCommand(dto.email));
  }

  @Post('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @RefreshTokenPayload() refreshPayload: ReqUserType,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshTokenCommand,
      JwtTokensViewDto
    >(new RefreshTokenCommand({ ...refreshPayload, ip, userAgent }));

    this._setRefreshTokenToCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('/logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @RefreshTokenPayload() refreshPayload: ReqUserType,
    @UserAgent() userAgent: string,
  ) {
    await this.commandBus.execute(
      new LogoutCommand({ ...refreshPayload, userAgent }),
    );

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return;
  }

  private _setRefreshTokenToCookie(res: Response, refreshToken: string) {
    return res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: Boolean(this.configService.get(COOKIE_HTTP_ONLY)),
      secure: Boolean(this.configService.get(COOKIE_SECURE)),
    });
  }
}
