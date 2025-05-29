import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Orders extends Document {
  @Prop({ type: String, required: true })
  declare _id: string; // UUID nga Supabase ose backend

  @Prop({ type: String })
  user_id: string; // Lista e gjërave që do të mësohen

  @Prop({ type: String })
  status: string; // Lista e gjërave që do të mësohen

  @Prop({ type: Number })
  total_amount: number; // Lista e gjërave që do të mësohen

  @Prop({ type: String })
  currency: string; // Lista e gjërave që do të mësohen

  @Prop({ type: String })
  stripe_checkout_session_id: string; // Lista e gjërave që do të mësohen

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
