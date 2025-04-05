import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Courses extends Document {
  @Prop({ required: true, unique: true })
  courseId: string;
  @Prop()
  title: string;

  @Prop()
  description: string;
  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Categories' }] })
  categories: Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
