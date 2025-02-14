import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CommentDto {
  @IsNumber()
  id: number;

  @IsString()
  text: string;

  @IsOptional()
  @IsEnum(['hour', 'day', 'week'])
  autoDeleteAfter?: 'hour' | 'day' | 'week';

  @IsNumber()
  userId: number;

  @IsDate()
  createdAt: Date;
}
