import { IsString, Length, Validate } from 'class-validator';

import { NoExistUser } from '../../../../infra/decorators/auth/no.exist.user';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class LoginDto {
  @Validate(NoExistUser)
  @Trim()
  @IsString()
  readonly loginOrEmail: string;

  @Trim()
  @Length(6, 20)
  @IsString()
  readonly password: string;
}
