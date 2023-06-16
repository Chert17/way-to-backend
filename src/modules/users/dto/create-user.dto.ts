import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';

import { ExistUserByLoginOrEmail } from '../../../infra/decorators/user/exist.user.by.login-email';
import { Trim } from '../../../infra/decorators/validation/trim';
import { CreateUserFormat } from '../types/user.types';

export class CreateUserDto {
  @Validate(ExistUserByLoginOrEmail)
  @Matches('^[a-zA-Z0-9_-]*$')
  @Length(3, 10)
  @Trim()
  @IsString()
  readonly login: string;

  @Length(6, 20)
  @Trim()
  @IsString()
  readonly password: string;

  @Validate(ExistUserByLoginOrEmail)
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @IsEmail()
  @Trim()
  @IsString()
  readonly email: string;
}

export class CreateUserServiceDto {
  readonly login: string;
  readonly password: string;
  readonly email: string;
  readonly format: CreateUserFormat;
}

export class CreateUserDbDto {
  readonly login: string;
  readonly pass_hash: string;
  readonly email: string;
  readonly createdAt: string;
  readonly format: CreateUserFormat;
}
