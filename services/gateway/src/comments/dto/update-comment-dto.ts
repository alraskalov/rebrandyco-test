import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Новый текст комментария',
    example: 'Hello World 2!',
    required: true,
  })
  @IsString()
  text: string;
}
