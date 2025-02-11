import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, username, avatarUrl } = createUserDto;

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
            avatarUrl,
            role: 'simple',
        });

        return await this.usersRepository.save(user);
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        const user = await this.usersRepository.findOne({ where: { email } });
        if (user === null) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async findById(id: number): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } });
    }
}
