import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким E-mail уже существует',
  })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Авторизация пользователя и получение JWT токена' })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    schema: {
      example: { access_token: 'jwt_token_here' },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.usersService.login(loginDto);
  }

  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<User> {
    return this.usersService.getProfile(id);
  }
}
