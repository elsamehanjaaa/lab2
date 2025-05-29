import { Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('get-order-by-session')
  async getOrderBySession(sessionId: string) {
    try {
      return await this.ordersService.getOrderBySession(sessionId);
    } catch (error) {
      console.error('Error fetching order by session:', error);
      throw error;
    }
  }
}
