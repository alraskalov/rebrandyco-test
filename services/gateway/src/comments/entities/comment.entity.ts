import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  userId: number;

  @Column({ nullable: true, enum: ['hour', 'day', 'week'], default: null })
  autoDeleteAfter?: 'hour' | 'day' | 'week';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
