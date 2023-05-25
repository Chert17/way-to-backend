import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly postId: string;
  @IsString()
  readonly content: string;
}
