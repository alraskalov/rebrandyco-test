import { User } from './auth/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: 'users-db',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'users_db',
  entities: [User],
  synchronize: true,
};
export const userDataSource = new DataSource(options);
