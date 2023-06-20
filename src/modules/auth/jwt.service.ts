import { decode, sign, verify } from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SETTINGS } from '../../utils/settings';
import { JwtTokensViewDto } from './dto/view/jwt.tokens.view.dto';

const { JWT_SECRET, EXPIRESIN_ACCESS_TOKEN, EXPIRESIN_REFRESH_TOKEN } =
  SETTINGS;

@Injectable()
export class JwtService {
  private readonly _jwtSecret: string;

  constructor(private configService: ConfigService) {
    this._jwtSecret = this.configService.get(JWT_SECRET);
  }

  createJWT(userId: string, deviceId: string): JwtTokensViewDto {
    try {
      const accessToken = sign({ userId, deviceId }, this._jwtSecret, {
        expiresIn: this.configService.get(EXPIRESIN_ACCESS_TOKEN),
      });
      const refreshToken = sign({ userId, deviceId }, this._jwtSecret, {
        expiresIn: this.configService.get(EXPIRESIN_REFRESH_TOKEN),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  verifyToken(token: string) {
    try {
      const result = verify(token, this._jwtSecret) as any;

      return {
        userId: result.userId,
        deviceId: result.deviceId,
        iat: result.iat,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getTokenIat(token: string): { iat: string } {
    const tokenIat: any = decode(token);

    return { iat: new Date(tokenIat.iat * 1000).toISOString() };
  }

  getUserIdFromAccessToken(accessToken: string): { userId: string } {
    try {
      const result = decode(accessToken) as any;

      return { userId: result.userId };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
