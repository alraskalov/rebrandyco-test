import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст комментария',
    example: 'Hello World!',
    required: true,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Опция авто удаления комментария',
    example: 'hour',
    required: true,
  })
  @IsOptional()
  @IsEnum(['minute', 'minute', 'hour', 'day', 'week'])
  autoDeleteAfter?: 'minute' | 'hour' | 'day' | 'week';
}
