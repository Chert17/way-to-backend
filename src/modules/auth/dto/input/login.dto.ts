import { IsString, Length, Validate } from 'class-validator';

import { ExistUser } from '../../../../infra/decorators/users/exist.user';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class LoginDto {
  @Validate(ExistUser)
  @Trim()
  @IsString()
  readonly loginOrEmail: string;

  @Validate(ExistUser)
  @Trim()
  @Length(6, 20)
  @IsString()
  readonly password: string;
}
