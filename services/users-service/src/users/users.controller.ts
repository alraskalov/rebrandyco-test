import {
  ConflictException,
  Controller,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-dto';
import { User } from './entities/user.entity';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
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
  async login(
    @Payload() loginDto: LoginDto,
  ): Promise<{ access_token: string }> {
    try {
      return await this.usersService.login(loginDto);
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

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getProfile(@Payload() userId: number): Promise<User | null> {
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
}
