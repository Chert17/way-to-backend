import { IsString, Validate } from 'class-validator';

import { ConfirmCodeExist } from '../../../../infra/decorators/auth/confirm.code.exist';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class ConfirmRegisterDto {
  @Validate(ConfirmCodeExist)
  @Trim()
  @IsString()
  readonly code: string;
}
