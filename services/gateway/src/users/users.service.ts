import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../auth/entities/user.entity';

// Начиная с NestJS v8 toPromise() помечен, как - deprecated, вместо него использую предложенные lastValueFrom | firstValueFrom
@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) {}

  async getUserById(userId: number): Promise<User> {
    return lastValueFrom(this.client.send({ cmd: 'get_user_by_id' }, userId));
  }
}
