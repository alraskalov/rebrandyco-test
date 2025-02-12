import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';

export const Config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'users-db',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'users_db',
  entities: [User],
  synchronize: true,
};

export default Config;
