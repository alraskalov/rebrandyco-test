import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: 'simple' | 'admin';

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
