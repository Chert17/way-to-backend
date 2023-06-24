import { IsString, Length } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim';

export class UpdateCommentDto {
  @Length(20, 300)
  @Trim()
  @IsString()
  readonly content: string;
}

export class UpdateCommentServiceDto {
  readonly userId: string;
  readonly commentId: string;
  readonly content: string;
}

export class UpdateCommentDbDto {
  readonly commentId: string;
  readonly content: string;
}
