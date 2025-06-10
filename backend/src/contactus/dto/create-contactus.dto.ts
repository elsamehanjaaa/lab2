// src/dto/create-contactus.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;

  @IsNotEmpty()
  content: string;
}