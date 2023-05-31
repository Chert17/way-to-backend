import { IsEmail, IsString, Matches } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class RecoveryPasswordDto {
  @IsString()
  @IsEmail()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @Trim()
  readonly email: string;
}
