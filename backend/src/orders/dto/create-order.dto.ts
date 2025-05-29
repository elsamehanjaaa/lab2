import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsString()
  user_id: string;

  @IsString()
  status: string;

  @IsNumber()
  total_amount: number;

  @IsString()
  currency: string;

  @IsString()
  stripe_checkout_session_id: string;
}
