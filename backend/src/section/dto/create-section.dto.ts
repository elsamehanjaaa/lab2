import {
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsDate()
  created_at: Date = new Date();

  @IsNumber()
  index: number; 

  @IsNumber()
  course_id: number;

}
