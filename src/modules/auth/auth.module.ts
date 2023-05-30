import { Module } from '@nestjs/common';

import { UsersRepo } from '../users/repositories/users.repo';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, UsersService, UsersRepo],
})
export class AuthModule {}
