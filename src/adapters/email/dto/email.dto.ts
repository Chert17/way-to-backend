import { IsEmail, IsString } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim.decorator';

export class EmailDto {
  @IsString()
  @IsEmail()
  @Trim()
  readonly email: string;

  @IsString()
  @Trim()
  readonly subject: string;

  @IsString()
  @Trim()
  readonly message: string;
}
