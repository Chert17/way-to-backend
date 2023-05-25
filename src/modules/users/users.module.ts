import { Module } from '@nestjs/common';

import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersRepo } from './repositories/users.repo';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersQueryRepo, UsersRepo],
})
export class UsersModule {}
