import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsString()
  order_id: string;

  @IsUUID()
  @IsString()
  course_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
