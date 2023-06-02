import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

import { UserAgent } from '../../infra/decorators/param/req.user.agent.decorator';
import { ReqUser } from '../../infra/decorators/param/req.user.decorator';
import { JwtAuthGuard } from '../../infra/guards/auth/jwt.auth.guard';
import { SETTINGS } from '../../utils/settings';
import { UserViewDto } from '../users/dto/view/user.view.dto';
import { AuthService } from './auth.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { EmailResendingDto } from './dto/input/email.resending.dto';
import { LoginDto } from './dto/input/login.dto';
import { RegisterDto } from './dto/input/register.dto';

const { COOKIE_HTTP_ONLY, COOKIE_SECURE } = SETTINGS;

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/me')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  async getMe(@ReqUser() user: UserViewDto) {
    return { userId: user.id, login: user.login, email: user.email };
  }

  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const result = await this.authService.login({ ...dto, ip, userAgent });

    if (!result) throw new UnauthorizedException();

    const { accessToken, refreshToken } = result;

    this._setRefreshTokenToCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {}

  @Post('/refresh-token')
  @SkipThrottle()
  @HttpCode(HttpStatus.NO_CONTENT)
  async refreshToken() {}

  @Post('/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() dto: ConfirmRegisterDto) {
    return await this.authService.confirmRegister(dto);
  }

  @Post('/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(@Body() dto: EmailResendingDto) {
    return await this.authService.resendingEmail(dto);
  }

  @Post('/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword() {}

  @Post('/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword() {}

  private _setRefreshTokenToCookie(res: Response, refreshToken: string) {
    return res.cookie('refreshToken ', refreshToken, {
      httpOnly: Boolean(this.configService.get(COOKIE_HTTP_ONLY)),
      secure: Boolean(this.configService.get(COOKIE_SECURE)),
    });
  }
}
