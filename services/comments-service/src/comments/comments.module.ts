import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentCronService } from './cron/comments.cron';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ScheduleModule.forRoot()],
  providers: [CommentService, CommentCronService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
