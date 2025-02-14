import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'node:path';

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
  async getProfile(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Обновить аватар пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Аватар успешно обновлен',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при обновлении аватара',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Загрузите изображение аватара',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  @Post('/avatar')
  async updateAvatar(
    @UploadedFile() file: multer.File,
    @Request() req: { user: JwtPayload },
  ) {
    const currentUserId = req.user.sub;

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const result = await this.usersService.updateAvatar({
      userId: currentUserId,
      avatarUrl,
    });

    if (result.success) {
      return {
        message: 'Аватар успешно обновлен',
        avatarUrl,
      };
    } else {
      throw new Error('Ошибка при обновлении аватара');
    }
  }
}
