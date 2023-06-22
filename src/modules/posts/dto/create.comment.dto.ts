import { IsString, Length } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim';

export class createCommentDto {
  @Length(20, 300)
  @Trim()
  @IsString()
  readonly content: string;
}

export class CreateCommentServiceDto {
  readonly content: string;
  readonly postId: string;
  readonly userId: string;
}

export class CreateCommentDbDto {
  readonly content: string;
  readonly postId: string;
  readonly userId: string;
  readonly createdAt: string;
}
