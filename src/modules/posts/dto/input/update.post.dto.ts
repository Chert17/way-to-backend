import { IsString } from 'class-validator';

export class updatePostDto {
  @IsString()
  readonly postId: string;

  @IsString()
  readonly blogId: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly shortDescription: string;

  @IsString()
  readonly title: string;
}
