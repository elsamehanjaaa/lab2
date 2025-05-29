import { Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItems, OrderItemsSchema } from 'src/schemas/order_items.schema';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderItems.name, schema: OrderItemsSchema },
    ]),
  ],
  providers: [OrderItemsService, SupabaseService, MongooseService],
  exports: [OrderItemsService, MongooseModule],
})
export class OrderItemsModule {}
