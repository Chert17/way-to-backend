import { IsString, IsUUID, Validate } from 'class-validator';

import { ExistConfirmCode } from '../../../../infra/decorators/auth/exist.comfirm.code';
import { Trim } from '../../../../infra/decorators/validation/trim';

export class ConfirmRegisterDto {
  @Validate(ExistConfirmCode)
  @IsUUID()
  @Trim()
  @IsString()
  readonly code: string;
}
