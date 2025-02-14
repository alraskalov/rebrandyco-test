import { Module } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
