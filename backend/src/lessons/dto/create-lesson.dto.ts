import {
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsNumber()
  index: number;

  @IsDate()
  created_at: Date = new Date();

  @IsString()
  video_url: string;

  @IsNumber()
  section_id: number;

}
