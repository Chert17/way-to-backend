import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class RegisterDto {
  @IsString()
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  @Trim()
  readonly login: string;

  @IsString()
  @Length(6, 20)
  @Trim()
  readonly password: string;

  @IsString()
  @IsEmail()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @Trim()
  readonly email: string;
}
