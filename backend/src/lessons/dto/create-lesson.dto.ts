import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  index?: number;

  @IsString()
  video_url: string;
  @IsString()
  type: string;
  @IsNumber()
  duration: number;
  @IsString()
  url?: string;

  @IsNumber()
  section_id: number;
}
