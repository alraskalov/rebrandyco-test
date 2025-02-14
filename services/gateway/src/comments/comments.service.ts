import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENTS_SERVICE') private readonly commentClient: ClientProxy,
  ) {}

  addComment(data: {
    userId: number;
    text: string;
    autoDeleteAfter?: 'minute' | 'hour' | 'day' | 'week';
  }): Promise<Comment> {
    return lastValueFrom(this.commentClient.send({ cmd: 'add_comment' }, data));
  }

  updateComment(data: {
    id: number;
    text: string;
    userId: number;
  }): Promise<boolean> {
    return lastValueFrom(
      this.commentClient.send({ cmd: 'update_comment' }, data),
    );
  }

  deleteComment(data: { userId: number; id: number }): Promise<boolean> {
    return lastValueFrom(
      this.commentClient.send({ cmd: 'delete_comment' }, data),
    );
  }

  getMeComments(data: { userId: number }): Promise<Comment[]> {
    return lastValueFrom(
      this.commentClient.send({ cmd: 'get_me_comments' }, data),
    );
  }

  async getUserComments(data: {
    userId: number;
    role: string;
  }): Promise<Comment[]> {
    return lastValueFrom(
      this.commentClient.send({ cmd: 'get_user_comments' }, data),
    );
  }
}
