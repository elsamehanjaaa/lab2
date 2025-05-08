import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  user_id: string;

  @IsString()
  course_id: string;

  @IsPositive()
  @IsNumber()
  progress?: number;
}
