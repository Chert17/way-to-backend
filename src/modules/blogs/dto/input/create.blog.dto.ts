import { IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
  @IsString()
  readonly websiteUrl: string;
}
