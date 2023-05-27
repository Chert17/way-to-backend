import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SETTINGS } from '../../../utils/settings';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new UnauthorizedException();

    const [type, auth] = request.headers.authorization.split(' ');

    const decode = Buffer.from(auth, 'base64').toString('utf-8');

    if (type !== 'Basic' || decode !== SETTINGS.BASIC_AUTH) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
