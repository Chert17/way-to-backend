import { IsEmail, IsString, Matches } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim';

export class RecoveryPasswordDto {
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @IsEmail()
  @Trim()
  @IsString()
  readonly email: string;
}

export class RecoveyPassowrdDbDto {
  readonly userId: string;
  readonly recoveryCode: string;
  readonly expDate: string;
}
