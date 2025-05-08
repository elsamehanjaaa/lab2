import { IsBoolean, IsIn, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  user_id: string;

  @IsString()
  course_id: string;
}
