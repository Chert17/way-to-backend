import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistConfirmCode } from '../../infra/decorators/auth/exist.comfirm.code';
import { ExistResendingEmail } from '../../infra/decorators/auth/exist.email.resending';
import { ExistRecoveryCode } from '../../infra/decorators/auth/exist.recovery.code';
import { ExistUserByLoginOrEmail } from '../../infra/decorators/user/exist.user.by.login-email';
import { DevicesRepo } from '../devices/repositories/devices.repo';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';
import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { ConfirmRegisterUseCase } from './use-case/confirm.register.use-case';
import { EmailResendingUseCase } from './use-case/email.resending.use-case';
import { LoginUseCase } from './use-case/login.use-case';
import { LogoutUseCase } from './use-case/logout.use-case';
import { NewPassUseCase } from './use-case/new.pass.use-case';
import { RecoveryPassUseCase } from './use-case/recovery.pass.use-case';
import { RefreshTokenUseCase } from './use-case/refresh.token.use-case';
import { RegisterUseCase } from './use-case/register.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    // service
    AuthService,
    UsersService,
    UsersRepo,
    DevicesRepo,
    EmailService,
    JwtService,
    // use-case
    RegisterUseCase,
    ConfirmRegisterUseCase,
    LoginUseCase,
    EmailResendingUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    RecoveryPassUseCase,
    NewPassUseCase,
    // validation
    ExistConfirmCode,
    ExistUserByLoginOrEmail,
    ExistResendingEmail,
    ExistRecoveryCode,
  ],
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
})
export class AuthModule {}
