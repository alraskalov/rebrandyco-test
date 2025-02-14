import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USERS_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return firstValueFrom(
      this.userClient.send({ cmd: 'register_user' }, createUserDto),
    );
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;

    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'login_user' }, { email, password }),
    );

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await firstValueFrom(
        this.userClient.send({ cmd: 'get_user_by_id' }, payload.sub),
      );

      const newAccessToken = this.generateAccessToken(user);

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Неверный Refresh Token');
    }
  }
}
