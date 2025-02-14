import { IsString, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @IsNumber()
  id: number;

  @IsString()
  text?: string;
}
