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
}

export const EnrollmentsSchema = SchemaFactory.createForClass(Enrollments);
