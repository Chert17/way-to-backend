import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersRepo } from './repositories/users.repo';
import { CreateUserUseCase } from './use-case/create.user.use-case';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepo, UsersRepo, CreateUserUseCase],
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
})
export class UsersModule {}
