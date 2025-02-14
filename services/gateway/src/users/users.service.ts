import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async getUserById(userId: number): Promise<User> {
    return lastValueFrom(
      this.userClient.send({ cmd: 'get_user_by_id' }, userId),
    );
  }

  async updateAvatar(
    userId: number,
    avatarUrl: string,
  ): Promise<{ success: boolean }> {
    return lastValueFrom(
      this.userClient.send({ cmd: 'update_avatar' }, { userId, avatarUrl }),
    );
  }
}
