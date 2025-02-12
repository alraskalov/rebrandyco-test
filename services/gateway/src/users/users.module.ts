import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'USERS_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'app',
            port: 3001,
          },
        }),
    },
  ],
})
export class UsersModule {}
