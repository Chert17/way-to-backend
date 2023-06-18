import { Injectable, UnauthorizedException } from '@nestjs/common';

import { DeviceDb } from '../devices/types/device.db';

@Injectable()
export class AuthService {
  checkDevice(
    device: DeviceDb,
    userId: string,
    iat: number,
    userAgent: string,
  ) {
    if (!device) throw new UnauthorizedException();

    if (device.user_id !== userId) throw new UnauthorizedException();

    if (device.last_active_date !== new Date(iat * 1000).toISOString())
      throw new UnauthorizedException();

    if (device.title !== userAgent) throw new UnauthorizedException();
  }
}
