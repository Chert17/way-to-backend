import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '../../../modules/auth/jwt.service';
import { UsersQueryRepo } from '../../../modules/users/repositories/users.query.repo';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersQueryRepo: UsersQueryRepo,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new UnauthorizedException();

    const [type, accessToken] = request.headers.authorization.split(' ');

    if (type !== 'Bearer') throw new UnauthorizedException(); // incorrect verification by type

    const payload = this.jwtService.verifyToken(accessToken);

    if (!payload) throw new UnauthorizedException(); // invalid accessToken

    const user = await this.usersQueryRepo.getUserById(payload.userId);

    if (!user) throw new UnauthorizedException(); // not found user by jwt payload or user deleted

    request.user = user;

    return true;
  }
}
