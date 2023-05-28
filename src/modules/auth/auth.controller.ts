import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/input/register.dto';

@Controller('auth')
@Throttle(5, 10)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @SkipThrottle()
  async getMe() {}

  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(200)
  async login() {}

  @Post('/logout')
  @HttpCode(204)
  async logout() {}

  @Post('/refresh-token')
  @SkipThrottle()
  @HttpCode(204)
  async refreshToken() {}

  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmRegistration() {}

  @Post('/registration-email-resending')
  @HttpCode(204)
  async emailResending() {}

  @Post('/password-recovery')
  @HttpCode(204)
  async recoveryPassword() {}

  @Post('/new-password')
  @HttpCode(204)
  async newPassword() {}
}
