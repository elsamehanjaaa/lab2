// src/dto/create-contactus.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactUsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  content: string;
}
