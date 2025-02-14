import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comments/comments.module';
import { commentDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => commentDataSource.options,
    }),
    CommentModule,
  ],
})
export class AppModule {}
