import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class updatePostDto {
  @IsString()
  readonly postId: string;

  @IsString()
  readonly blogId: string;

  @IsString()
  @Length(1, 30)
  @Transform(({ value }) => value.trim())
  readonly title: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  readonly shortDescription: string;

  @IsString()
  @Length(1, 1000)
  @Transform(({ value }) => value.trim())
  readonly content: string;
}
