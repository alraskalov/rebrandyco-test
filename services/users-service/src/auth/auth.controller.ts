import {
  ConflictException,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register_user' })
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new RpcException({
          message: error.message,
          statusCode: 409,
        });
      }

      throw new RpcException({
        message: error.message,
        statusCode: 500,
      });
    }
  }

  @MessagePattern({ cmd: 'login_user' })
  async login(@Payload() loginDto: LoginDto): Promise<User> {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new RpcException({
          message: error.message,
          statusCode: 401,
        });
      }

      throw new RpcException({
        message: error.message,
        statusCode: 500,
      });
    }
  }
}
