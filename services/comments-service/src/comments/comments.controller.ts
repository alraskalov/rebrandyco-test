import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { CreateCommentDto } from './dto/create-comment-dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern({ cmd: 'add_comment' })
  async addComment(
    @Payload() data: { userId: number } & CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.addComment(data);
  }

  @MessagePattern({ cmd: 'update_comment' })
  async updateComment(
    @Payload() data: { userId: number } & UpdateCommentDto,
  ): Promise<boolean> {
    return this.commentService.updateComment(data);
  }

  @MessagePattern({ cmd: 'delete_comment' })
  async deleteComment(
    @Payload() data: { userId: number; id: number },
  ): Promise<boolean> {
    return this.commentService.deleteComment(data);
  }

  @MessagePattern({ cmd: 'get_me_comments' })
  async getMeComments(@Payload() data: { userId: number }): Promise<Comment[]> {
    return this.commentService.getMeComments(data);
  }

  @MessagePattern({ cmd: 'get_user_comments' })
  async getUserComments(
    @Payload() data: { userId: number; role: string },
  ): Promise<Comment[]> {
    return this.commentService.getUserComments(data);
  }
}
