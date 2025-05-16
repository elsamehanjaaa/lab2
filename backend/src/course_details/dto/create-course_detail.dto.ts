import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';

export class CreateCourseDetailDto {
  @IsUUID()
  @IsString()
  course_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  learn: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
