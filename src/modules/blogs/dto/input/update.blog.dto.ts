import { IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  readonly blogId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly websiteUrl: string;
}
