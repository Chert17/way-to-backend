import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim';

export class LoginDto {
  @Trim()
  @IsString()
  readonly loginOrEmail: string;

  @Length(6, 20)
  @Trim()
  @IsString()
  readonly password: string;
}

export class LoginServiceDto {
  readonly loginOrEmail: string;
  readonly password: string;
  readonly ip: string;
  readonly userAgent: string;
}
