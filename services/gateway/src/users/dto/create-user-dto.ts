import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'aldolzhenko',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'aldolzhenko@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'aldolzhenko123',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: 'simple',
    required: true,
  })
  @IsString()
  role: 'simple' | 'admin';

  @ApiProperty({
    description: 'Ссылка на аватар пользователя (опционально)',
    example: 'https://example.com/aldolzhenko.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
