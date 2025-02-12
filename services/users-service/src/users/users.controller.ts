import { Controller, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { User } from '../auth/entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() userId: number): Promise<User | null> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({
          message: error.message,
          statusCode: 404,
        });
      }

      throw new RpcException({
        message: error.message,
        statusCode: 500,
      });
    }
  }

  @MessagePattern({ cmd: 'update_avatar' })
  async updateAvatar(
    @Payload() { userId, avatarUrl }: { userId: number; avatarUrl: string },
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      if (user) {
        user.avatarUrl = avatarUrl;
        await this.usersService.save(user);
      }

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
