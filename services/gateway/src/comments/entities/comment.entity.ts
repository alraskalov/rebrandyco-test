import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  userId: number;

  @Column({
    nullable: true,
    enum: ['minute', 'hour', 'day', 'week'],
    default: null,
  })
  autoDeleteAfter?: 'minute' | 'hour' | 'day' | 'week';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
