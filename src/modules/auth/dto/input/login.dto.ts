import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class LoginDto {
  @IsString()
  @Trim()
  readonly loginOrEmail: string;

  @IsString()
  @Length(6, 20)
  @Trim()
  readonly password: string;
}
