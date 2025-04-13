import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsNumber()
  index: number;

  @IsString()
  video_url: string;
  @IsString()
  url: string;

  @IsNumber()
  section_id: number;
}
