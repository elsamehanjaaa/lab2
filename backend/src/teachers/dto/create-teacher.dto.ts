import { IsString, IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateTeacherDto {
  @IsUUID()
  @IsString()
  userId: string;
  @IsString()
  teachingType: string;

  @IsString()
  experienceYears: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ageGroups: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subjects: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tools: string[];

  @IsString()
  createdVideoContent: string;

  @IsString()
  motivation: string;

  @IsString()
  weeklyAvailability: string;

  @IsString()
  publishTime: string;
}
