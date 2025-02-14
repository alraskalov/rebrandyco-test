import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async addComment(
    data: { userId: number } & CreateCommentDto,
  ): Promise<Comment> {
    const { userId, text, autoDeleteAfter } = data;

    try {
      const comment = this.commentRepository.create({
        userId,
        text,
        autoDeleteAfter,
      });

      return await this.commentRepository.save(comment);
    } catch (error) {
      throw new Error(`Не удалось создать комментарий`);
    }
  }

  async updateComment(
    data: { userId: number } & UpdateCommentDto,
  ): Promise<boolean> {
    const { userId, id, text } = data;
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException(`Комментарий с ID ${id} не найден`);
    }

    if (comment.text === text || text === '') {
      return true;
    }

    try {
      await this.commentRepository.update(id, { text });

      return true;
    } catch (error) {
      throw new Error(`Не удалось обновить комментарий`);
    }
  }

  async deleteComment(data: { userId: number; id: number }): Promise<boolean> {
    const { userId, id } = data;
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException(`Комментарий с ID ${id} не найден`);
    }

    try {
      await this.commentRepository.remove(comment);
      return true;
    } catch (error) {
      throw new Error(`Не удалось удалить комментарии`);
    }
  }

  async getMeComments(data: { userId: number }): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { userId: data.userId },
      });
    } catch (error) {
      throw new Error(`Не удалось получить комментарии`);
    }
  }

  async getUserComments(data: {
    userId: number;
    role: string;
  }): Promise<Comment[]> {
    const { userId, role } = data;

    if (role === 'admin') {
      throw new ForbiddenException('Недостаточно прав');
    }

    try {
      return await this.commentRepository.find({ where: { userId } });
    } catch (error) {
      throw new Error(`Не удалось получить комментарии`);
    }
  }
}
