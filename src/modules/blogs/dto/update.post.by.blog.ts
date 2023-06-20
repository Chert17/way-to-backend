import { IsString, Length } from 'class-validator';

import { Trim } from '../../../infra/decorators/validation/trim';

export class UpdatePostByBlogDto {
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

export class UpdatePostByBlogServiceDto {
  readonly userId: string;
  readonly blogId: string;
  readonly postId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}

export class UpdatePostDbDto {
  readonly postId: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly content: string;
}
