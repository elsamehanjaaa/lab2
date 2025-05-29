import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from 'src/schemas/orders.schema';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { OrdersController } from './orders.controller';
import { OrderItemsModule } from 'src/order_items/order_items.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    OrderItemsModule,
    CoursesModule,
  ],
  providers: [OrdersService, SupabaseService, MongooseService],
  controllers: [OrdersController],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
