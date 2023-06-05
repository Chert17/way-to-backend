import { Module } from '@nestjs/common';

import { UsersSAController } from './api/users.sa.controller';
import { UsersQueryRepo } from './repositories/users.query.repo';
import { UsersRepo } from './repositories/users.repo';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersSAController],
  providers: [UsersService, UsersQueryRepo, UsersRepo],
})
export class UsersModule {}
