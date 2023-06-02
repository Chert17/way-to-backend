import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class LoginDto {
  @Trim()
  @IsString()
  readonly loginOrEmail: string;

  @Trim()
  @Length(6, 20)
  @IsString()
  readonly password: string;
}

export class LoginServiceDto {
  readonly loginOrEmail: string;
  readonly password: string;
  readonly ip: string;
  readonly userAgent: string;
}
