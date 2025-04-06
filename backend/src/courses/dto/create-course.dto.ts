import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsPositive,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsBoolean()
  status: boolean = true;

  @IsNumber()
  rating: number;

  @IsDate()
  created_at: Date = new Date();

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[] = [];
}
