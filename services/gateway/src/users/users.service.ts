import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-dto';

// Начиная с NestJS v8 toPromise() помечен, как - deprecated, вместо него использую предложенные lastValueFrom | firstValueFrom
@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return firstValueFrom(
      this.client.send({ cmd: 'create_user' }, createUserDto),
    );
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    return lastValueFrom(this.client.send({ cmd: 'login_user' }, loginDto));
  }

  async getProfile(userId: number): Promise<User> {
    return lastValueFrom(this.client.send({ cmd: 'get_user_by_id' }, userId));
  }
}
