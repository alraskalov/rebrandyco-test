import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comments.module';

@Module({
  imports: [UsersModule, CommentModule, AuthModule],
})
export class AppModule {}
