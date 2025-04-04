
import {
    IsString,
    IsNumber,
    IsArray,
    ArrayNotEmpty,
    IsPositive,
  } from 'class-validator';

  export class CreateCourseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true }) 
    categories: number[] = [];
  }