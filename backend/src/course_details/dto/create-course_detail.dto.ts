import {
    IsString,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  
  export class CreateCourseDetailDto {
    @IsString()
    readonly _id: string;
  
    @IsString()
    readonly learn: string;
  
    @IsOptional()
    @IsString()
    readonly requirements?: string; 
  
    @IsOptional()
    @IsString()
    readonly description?: string; 
  
    @IsDateString()
    created_at: Date = new Date();
  }
  