import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Авторизация пользователя и получение токенов' })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    schema: {
      example: {
        access_token: 'jwt_token_here',
        refresh_token: 'refresh_token_here',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Обновление Access Token через Refresh Token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Новый Access Token',
    schema: { example: { access_token: 'new_jwt_token_here' } },
  })
  @ApiResponse({ status: 401, description: 'Неверный Refresh Token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Body() { refresh_token }: { refresh_token: string },
  ): Promise<{ access_token: string }> {
    return this.authService.refreshAccessToken(refresh_token);
  }
}
