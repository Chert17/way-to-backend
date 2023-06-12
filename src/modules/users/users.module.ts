import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersRepo } from './repositories/users.repo';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepo, UsersRepo],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
