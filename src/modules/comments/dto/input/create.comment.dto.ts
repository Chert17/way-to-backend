import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class CreateCommentDto {
  @IsString()
  readonly postId: string;

  @IsString()
  @Length(20, 300)
  @Trim()
  readonly content: string;
}
