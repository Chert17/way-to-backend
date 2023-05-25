import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly login: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
