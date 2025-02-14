import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsEnum(['hour', 'day', 'week'])
  autoDeleteAfter?: 'hour' | 'day' | 'week';
}
