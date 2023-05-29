import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/input/register.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
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
