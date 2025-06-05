import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Enrollments extends Document {
  @Prop()
  declare _id: string;

  @Prop({ type: String })
  user_id: string;

  @Prop({ type: String, ref: 'Courses' })
  course_id: string;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Date, default: () => new Date() })
  enrolled_at: Date;
}

export const EnrollmentsSchema = SchemaFactory.createForClass(Enrollments);
