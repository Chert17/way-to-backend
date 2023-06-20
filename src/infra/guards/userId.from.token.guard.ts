import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { JwtService } from '../../modules/auth/jwt.service';

@Injectable()
export class UserIdFromToken implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;

    if (!auth) {
      request.userId = null;
      return true;
    }

    const [type, accessToken] = auth.split(' ');

    if (type !== 'Bearer' || !accessToken) {
      request.userId = null;
      return true;
    }

    const { userId } = this.jwtService.getUserIdFromAccessToken(accessToken);

    if (!userId) {
      request.userId = null;
      return true;
    }

    request.userId = userId;
    return true;
  }
}
