import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExistUserByLoginOrEmail } from '../../infra/decorators/user/exist.user.by.login-email';
import { DevicesRepo } from '../devices/repositories/devices.repo';
import { User } from './entities/user.entity';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersRepo } from './repositories/users.repo';
import { BanUserUseCase } from './use-case/ban.user.use-case';
import { CreateUserUseCase } from './use-case/create.user.use-case';
import { DeleteUserUseCase } from './use-case/delete.user.use-case';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersQueryRepo,
    UsersRepo,
    DevicesRepo,
    CreateUserUseCase,
    BanUserUseCase,
    DeleteUserUseCase,
    ExistUserByLoginOrEmail,
  ],
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
})
export class UsersModule {}
