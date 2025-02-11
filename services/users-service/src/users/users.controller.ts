import {
  ConflictException,
  Controller,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Users')
@Controller()
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
  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error as ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
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
  @MessagePattern('login_user')
  async login(
    @Payload() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    try {
      return await this.usersService.login(loginDto);
    } catch (error) {
      if (error as UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @MessagePattern('get_user_by_id')
  async getProfile(@Payload() userId: number): Promise<User | null> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      if (error as NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
