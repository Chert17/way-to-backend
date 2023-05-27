import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { SETTINGS } from '../../utils/settings';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategies';
import { LocalStrategy } from './strategies/local.strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SETTINGS.JWT_SECRET,
      signOptions: { expiresIn: SETTINGS.EXPIRESIN_ACCESS_TOKEN },
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
})
export class AuthModule {}
