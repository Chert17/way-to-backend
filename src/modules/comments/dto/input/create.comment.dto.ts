import { IsString, Length, Validate } from 'class-validator';

import { ExistPost } from '../../../../infra/decorators/posts/exist.post';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class CreateCommentDto {
  @Validate(ExistPost)
  @IsString()
  readonly postId: string;

  @Length(20, 300)
  @Trim()
  @IsString()
  readonly content: string;
}
