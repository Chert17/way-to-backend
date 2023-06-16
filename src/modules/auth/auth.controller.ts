import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfirmRegisterDto } from './dto/input/confirm.register.dto';
import { ConfirmRegisterUserCommand } from './use-case/confirm.register.use-case';
import { RegisterUserCommand } from './use-case/register.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
