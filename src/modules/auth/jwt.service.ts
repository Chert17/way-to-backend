import { decode, sign, verify } from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ReqUser } from '../../types/req.user.interface';
import { SETTINGS } from '../../utils/settings';
import { JwtTokensDto } from './dto/view/tokens.view.dto';

const { JWT_SECRET, EXPIRESIN_ACCESS_TOKEN, EXPIRESIN_REFRESH_TOKEN } =
  SETTINGS;

@Injectable()
export class JwtService {
  private readonly _jwtSecret: string;

  constructor(private configService: ConfigService) {
    this._jwtSecret = this.configService.get(JWT_SECRET);
  }

  createJWT(userId: string): JwtTokensDto {
    try {
      const accessToken = sign({ userId }, this._jwtSecret, {
        expiresIn: this.configService.get(EXPIRESIN_ACCESS_TOKEN),
      });
      const refreshToken = sign({ userId }, this._jwtSecret, {
        expiresIn: this.configService.get(EXPIRESIN_REFRESH_TOKEN),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  verify(accessToken: string) {
    try {
      const result = verify(accessToken, this._jwtSecret) as ReqUser;

      return { userId: result.userId };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getUserIdFromAccessToken(accessToken: string) {
    try {
      return decode(accessToken) as any;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getTokenIat(token: string) {
    const tokenIat: any = decode(token);

    return new Date(tokenIat.iat);
  }
}
