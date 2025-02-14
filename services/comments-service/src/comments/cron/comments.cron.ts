import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { addHours, addDays, addWeeks, addMinutes } from 'date-fns';

@Injectable()
export class CommentCronService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async autoDeleteComments() {
    try {
      const comments = await this.commentRepository.find({
        where: [
          { autoDeleteAfter: 'minute' },
          { autoDeleteAfter: 'hour' },
          { autoDeleteAfter: 'day' },
          { autoDeleteAfter: 'week' },
        ],
      });

      for (const comment of comments) {
        if (comment.autoDeleteAfter) {
          let deleteAfter: Date | null = null;

          if (comment.autoDeleteAfter === 'minute') {
            deleteAfter = addMinutes(comment.createdAt, 1);
          } else if (comment.autoDeleteAfter === 'hour') {
            deleteAfter = addHours(comment.createdAt, 1);
          } else if (comment.autoDeleteAfter === 'day') {
            deleteAfter = addDays(comment.createdAt, 1);
          } else if (comment.autoDeleteAfter === 'week') {
            deleteAfter = addWeeks(comment.createdAt, 1);
          }

          if (deleteAfter && new Date() >= deleteAfter) {
            await this.commentRepository.remove(comment);
          }
        }
      }
    } catch (error) {
      throw new Error(`Не удалось автоматически удалить комментарий`);
    }
  }
}
