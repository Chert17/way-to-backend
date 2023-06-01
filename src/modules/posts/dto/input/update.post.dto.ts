import { IsString, Length, Validate } from 'class-validator';

import { ExistBlog } from '../../../../infra/decorators/blogs/exist.blog';
import { Trim } from '../../../../infra/decorators/validation/trim.decorator';

export class updatePostDto {
  @IsString()
  readonly postId: string;

  @Validate(ExistBlog)
  @IsString()
  readonly blogId: string;

  @Length(1, 30)
  @Trim()
  @IsString()
  readonly title: string;

  @Length(1, 100)
  @Trim()
  @IsString()
  readonly shortDescription: string;

  @Length(1, 1000)
  @Trim()
  @IsString()
  readonly content: string;
}
