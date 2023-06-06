import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '../../../modules/auth/jwt.service';
import { UsersRepo } from '../../../modules/users/repositories/users.repo';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersRepo: UsersRepo) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new UnauthorizedException();

    const [type, accessToken] = request.headers.authorization.split(' ');

    if (type !== 'Bearer') throw new UnauthorizedException(); // incorrect verification by type

    const payload = this.jwtService.verifyToken(accessToken);

    if (!payload) throw new UnauthorizedException(); // invalid accessToken

    const user = await this.usersRepo.checkAndGetUserById(payload.userId);

    if (!user) throw new UnauthorizedException(); // not found user by jwt payload or user deleted

    if (user.banInfo.isBanned) throw new UnauthorizedException(); // banned user

    request.user = user;

    return true;
  }
}
