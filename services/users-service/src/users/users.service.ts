import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'avatarUrl', 'role'],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'avatarUrl', 'role'],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с E-mail ${email} не найден`);
    }
    return user;
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
