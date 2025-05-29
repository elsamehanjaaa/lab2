// backend/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Payments, PaymentsSchema } from '../schemas/payments.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module'; // Import EnrollmentsModule
import { SupabaseService } from 'src/supabase/supabase.service';
import { MongooseService } from 'src/mongoose/mongoose.service';
import { OrdersModule } from 'src/orders/orders.module';
import { OrderItemsModule } from 'src/order_items/order_items.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payments.name, schema: PaymentsSchema },
    ]),
    ConfigModule,
    OrdersModule,
    OrderItemsModule,
    EnrollmentsModule, // Add EnrollmentsModule here
  ],
  providers: [PaymentsService, SupabaseService, MongooseService],
  controllers: [PaymentsController],
  exports: [PaymentsService], // Export if other modules need it
})
export class PaymentsModule {}
