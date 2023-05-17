import { sign, verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { TokensViewModel } from '../models/auth.models';
import { SETTINGS } from '../utils/settings';

const { JWT_SECRET, EXPIRESIN_ACCESS_TOKEN, EXPIRESIN_REFRESH_TOKEN } =
  SETTINGS;

export class JwtService {
  async createJWT(
    userId: string,
    deviceId: string
  ): Promise<TokensViewModel | null> {
    try {
      const accessToken = sign({ userId, deviceId }, JWT_SECRET, {
        expiresIn: EXPIRESIN_ACCESS_TOKEN,
      });
      const refreshToken = sign({ userId, deviceId }, JWT_SECRET, {
        expiresIn: EXPIRESIN_REFRESH_TOKEN,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      return null;
    }
  }

  async getUserIdByToken(token: string): Promise<ObjectId | null> {
    try {
      const result = verify(token, JWT_SECRET) as { userId: ObjectId };

      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getDeviceIdByToken(token: string): Promise<string | null> {
    try {
      const result = verify(token, JWT_SECRET) as { deviceId: string };

      return result.deviceId;
    } catch (error) {
      return null;
    }
  }
}
