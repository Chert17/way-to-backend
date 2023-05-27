import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor() {}

  @Get()
  @SkipThrottle()
  async getMe() {}

  @Post('/registration')
  @HttpCode(204)
  async registration() {}

  @Post('/login')
  @HttpCode(204)
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
