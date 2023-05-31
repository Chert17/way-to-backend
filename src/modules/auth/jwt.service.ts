import { sign } from 'jsonwebtoken';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
