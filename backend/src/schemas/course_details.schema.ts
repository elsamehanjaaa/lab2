import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class CourseDetails extends Document {
  @Prop()
  declare _id: string; // UUID, matching Supabase

  @Prop({ required: true })
  learn: string; // What you'll learn

  @Prop()
  requirements: string;

  @Prop()
  description: string;

  @Prop({ type: String, default: () => new Date().toISOString() })
  created_at: Date;
}

export const CourseDetailsSchema = SchemaFactory.createForClass(CourseDetails);
