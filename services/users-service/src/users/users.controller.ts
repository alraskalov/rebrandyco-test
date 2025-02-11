import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Создать нового пользователя' })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно создан',
        type: User,
    })
    @ApiBody({ type: CreateUserDto })
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Авторизация пользователя и получение JWT токена' })
    @ApiResponse({
        status: 200,
        description: 'Успешная авторизация',
        schema: {
            example: { access_token: 'jwt_token_here' },
        },
    })
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }

    @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
    @ApiResponse({
        status: 200,
        description: 'Информация о пользователе',
        type: User,
    })
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('ID пользователя не был передан');
        }

        const user = await this.usersService.findById(userId);
        if (user === null) {
            throw new Error('Пользователь не найден');
        }

        return user;
    }
}
