import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
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
  @HttpCode(HttpStatus.OK)
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
  async confirmRegistration(@Body() dto: ConfirmRegisterDto) {
    return await this.authService.confirmRegister(dto);
  }

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
