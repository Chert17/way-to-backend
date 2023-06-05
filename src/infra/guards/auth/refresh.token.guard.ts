import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '../../../modules/auth/jwt.service';
import { DevicesRepo } from '../../../modules/devices/repositories/devices.repo';
import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepo: UsersRepo,
    private devicesRepo: DevicesRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) throw new UnauthorizedException();

    const payload = this.jwtService.verifyToken(refreshToken);

    if (!payload) throw new UnauthorizedException(); // invalid refreshToken

    const { userId } = payload;

    const user = await this.usersRepo.checkUserById(userId);

    if (!user) throw new UnauthorizedException(); // not found user by jwt payload or user deleted

    request.refreshTokenPayload = payload;

    return true;
  }
}
