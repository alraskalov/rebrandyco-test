import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
}
