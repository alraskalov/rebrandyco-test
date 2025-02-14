import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateCommentDto } from './dto/create-comment-dto';
import { Comment } from './entities/comment.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить новый комментарий' })
  @ApiBody({
    description: 'Данные для создания нового комментария',
    type: CreateCommentDto,
  })
  @ApiResponse({ status: 201, description: 'Комментарий успешно добавлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при создании комментария' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  addComment(
    @Request() req: { user: JwtPayload },
    @Body()
    data: {
      text: string;
      autoDeleteAfter?: 'hour' | 'day' | 'week';
    },
  ): Promise<Comment> {
    const currentUserId = req.user.sub;

    return this.commentService.addComment({ userId: currentUserId, ...data });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить комментарий' })
  @ApiBody({
    description: 'Данные для обновления комментария',
    type: UpdateCommentDto,
  })
  @ApiResponse({ status: 200, description: 'Комментарий успешно обновлен' })
  @ApiResponse({
    status: 400,
    description: 'Ошибка при обновлении комментария',
  })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtPayload },
    @Body() data: { text: string },
  ): Promise<boolean> {
    const currentUserId = req.user.sub;

    return this.commentService.updateComment({
      userId: currentUserId,
      ...data,
      id,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить комментарий' })
  @ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const currentUserId = req.user.sub;

    return this.commentService.deleteComment({ userId: currentUserId, id });
  }

  @Get()
  @ApiOperation({ summary: 'Получить свои комментарии' })
  @ApiResponse({ status: 200, description: 'Список комментариев' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMeComments(@Request() req: { user: JwtPayload }): Promise<Comment[]> {
    const { sub } = req.user;

    return this.commentService.getMeComments({ userId: sub });
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить комментарии пользователя по его id' })
  @ApiResponse({ status: 200, description: 'Список комментариев пользователя' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getUserComments(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: { user: JwtPayload },
  ): Promise<Comment[]> {
    const { role } = req.user;

    return this.commentService.getUserComments({ userId, role });
  }
}
