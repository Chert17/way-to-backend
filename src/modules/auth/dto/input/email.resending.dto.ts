import { IsEmail, IsString, Matches, Validate } from 'class-validator';

import { ExistResendingEmail } from '../../../../infra/decorators/auth/exist.email.resending';
import { Trim } from '../../../../infra/decorators/validation/trim';

export class EmailResendingDto {
  @Validate(ExistResendingEmail)
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @IsEmail()
  @Trim()
  @IsString()
  readonly email: string;
}

export class EmailResendingDbDto {
  readonly email: string;
  readonly newCode: string;
  readonly newExpDate: string;
}
