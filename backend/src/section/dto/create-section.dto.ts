import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsNumber()
  index: number;

  @IsString()
  course_id: string;
}
