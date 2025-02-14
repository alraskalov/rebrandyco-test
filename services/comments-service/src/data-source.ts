import { Comment } from './comments/entities/comment.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: 'comments-db',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'comments_db',
  entities: [Comment],
  synchronize: true,
};
export const commentDataSource = new DataSource(options);
