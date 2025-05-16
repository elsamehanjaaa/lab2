import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class CourseDetails extends Document {
  @Prop({ type: String, required: true })
  declare _id: string; // UUID nga Supabase ose backend

  @Prop({ type: [String], required: true })
  learn: string[]; // Lista e gjërave që do të mësohen

  @Prop({ type: [String], default: [] })
  requirements: string[]; // Kërkesat për kursin

  @Prop({ type: String })
  description: string; // Përshkrimi i kursit

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;
}

export const CourseDetailsSchema = SchemaFactory.createForClass(CourseDetails);
