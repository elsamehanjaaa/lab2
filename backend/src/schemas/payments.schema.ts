import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Payments extends Document {
  @Prop()
  declare _id: string;

  @Prop({ type: String })
  user_id: string;

  @Prop({ type: String, ref: 'Courses' })
  course_id: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop()
  status: string;
  @Prop()
  session_id: string;
  @Prop({ type: String, default: () => new Date().toISOString() })
  created_at: Date;
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments);
