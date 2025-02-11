import { Controller } from '@nestjs/common';
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
  @ApiBody({ type: CreateUserDto })
  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
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
  @MessagePattern('login_user')
  async login(
    @Payload() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    return this.usersService.login(loginDto);
  }

  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  @MessagePattern('get_user_by_id')
  async getProfile(@Payload() userId: number): Promise<User | null> {
    return this.usersService.findById(userId);
  }
}
