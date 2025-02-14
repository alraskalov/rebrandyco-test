import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { userDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => userDataSource.options,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
