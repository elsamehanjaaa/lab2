import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Courses extends Document {
  @Prop()
  declare _id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: true }) // ✅ Default true
  status: boolean;

  @Prop()
  rating: number;

  @Prop({ type: [{ type: Number, ref: 'Categories' }] })
  categories: number[];

  @Prop()
  instructor_id: string;
  @Prop()
  thumbnail_url: string;

  @Prop({ type: String, default: () => new Date().toISOString() }) // ✅ Default to current date
  created_at: Date;

  @Prop()
  slug: string;
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
