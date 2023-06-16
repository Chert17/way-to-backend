import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistConfirmCode } from '../../infra/decorators/auth/exist.comfirm.code';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmRegisterUseCase } from './use-case/confirm.register.use-case';
import { RegisterUseCase } from './use-case/register.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepo,
    EmailService,
    RegisterUseCase,
    ConfirmRegisterUseCase,
    ExistConfirmCode,
  ],
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
})
export class AuthModule {}
