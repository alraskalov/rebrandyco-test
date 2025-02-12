import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получить информацию о текущем авторизованном пользователе',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о текущем пользователе',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: { user: JwtPayload }): Promise<User> {
    const userId = req.user.sub;
    return this.usersService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Получить информацию о пользователе по id' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
