import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class newPasswordDto {
  @IsString()
  @Length(6, 20)
  @Trim()
  readonly newPassword: string;

  @IsString()
  @Trim()
  readonly recoveryCode: string;
}
