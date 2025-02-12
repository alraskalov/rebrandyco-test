import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Config from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(Config), UsersModule],
})
export class AppModule {}
