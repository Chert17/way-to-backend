import { IsString, IsUUID, Length, Validate } from 'class-validator';

import { ExistRecoveryCode } from '../../../../infra/decorators/auth/exist.recovery.code';
import { Trim } from '../../../../infra/decorators/validation/trim';

export class NewPasswordDto {
  @Length(6, 20)
  @Trim()
  @IsString()
  readonly newPassword: string;

  @Validate(ExistRecoveryCode)
  @IsUUID()
  @Trim()
  @IsString()
  readonly recoveryCode: string;
}

export class NewPassServiceDto {
  readonly newPassword: string;
  readonly recoveryCode: string;
}
