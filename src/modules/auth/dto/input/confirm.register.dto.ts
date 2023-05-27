import { IsString } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class ConfirmRegisterDto {
  @IsString()
  @Trim()
  readonly code: string;
}
