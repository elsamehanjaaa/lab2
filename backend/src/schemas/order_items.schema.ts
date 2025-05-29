import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class OrderItems extends Document {
  @Prop({ type: String, required: true })
  declare _id: string; // UUID nga Supabase ose backend

  @Prop({ type: String })
  order_id: string; // Lista e gjërave që do të mësohen

  @Prop({ type: String })
  course_id: string; // Lista e gjërave që do të mësohen

  @Prop({ type: Number })
  quantity: number; // Përshkrimi i kursit

  @Prop({ type: Number })
  price: number; // Përshkrimi i kursit

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;
}

export const OrderItemsSchema = SchemaFactory.createForClass(OrderItems);
