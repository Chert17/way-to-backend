import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    CreateUserUseCase,
    BanUserUseCase,
    DeleteUserUseCase,
  ],
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
})
export class UsersModule {}
