// backend/src/payments/dto/create-payment.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class LineItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;
}

export class CreatePaymentDto {
  // Or rename to CreateCheckoutSessionDto for clarity
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  cartItems: LineItemDto[];

  @IsString()
  @IsNotEmpty() // Assuming userId is always required for a checkout
  userId: string;

  @IsString()
  @IsOptional()
  couponCode?: string | null;
}
