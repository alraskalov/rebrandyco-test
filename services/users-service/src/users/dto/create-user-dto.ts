import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'aldolzhenko',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'aldolzhenko@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'aldolzhenko123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Ссылка на аватар пользователя (опционально)',
    example: 'https://example.com/aldolzhenko.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
