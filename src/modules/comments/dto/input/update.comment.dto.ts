import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class updateCommentDto {
  @Length(20, 300)
  @IsString()
  @Trim()
  readonly content: string;
}
