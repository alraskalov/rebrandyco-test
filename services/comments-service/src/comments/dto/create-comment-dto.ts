import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsEnum(['minute', 'hour', 'day', 'week'])
  autoDeleteAfter?: 'minute' | 'hour' | 'day' | 'week';
}
