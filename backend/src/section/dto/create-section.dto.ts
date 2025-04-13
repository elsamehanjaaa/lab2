import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsNumber()
  index: number;

  @IsNumber()
  course_id: number;
}
