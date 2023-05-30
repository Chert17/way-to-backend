import { IsEmail, IsString, Matches, Validate } from 'class-validator';

import { ResendingEmailExist } from '../../../../infra/decorators/auth/resending.email.exist';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class EmailResendingDto {
  @Validate(ResendingEmailExist)
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  @IsEmail()
  @Trim()
  @IsString()
  readonly email: string;
}
