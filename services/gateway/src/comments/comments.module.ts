import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'COMMENTS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'app', port: 3002 },
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
