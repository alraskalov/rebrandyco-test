import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username, avatarUrl } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'avatarUrl', 'role'],
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким E-mail уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.save({
      email,
      username,
      password: hashedPassword,
      avatarUrl,
      role: 'simple',
    });

    return {
      email,
      username,
      avatarUrl,
      role: 'simple',
    } as User;
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user === null) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    try {
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при авторизации пользователя',
      );
    }
  }
}
