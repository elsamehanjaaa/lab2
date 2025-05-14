import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Teachers extends Document {
  @Prop()
  declare _id: string;

  @Prop({ required: true })
  teachingType: string;

  @Prop({ required: true })
  experienceYears: string;

  @Prop({ type: [String], required: true })
  ageGroups: string[];

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ type: [String], required: true })
  tools: string[];

  @Prop({ required: true })
  createdVideoContent: string;

  @Prop({ required: true })
  motivation: string;

  @Prop({ required: true })
  weeklyAvailability: string;

  @Prop({ required: true })
  publishTime: string;

  @Prop({ type: String, default: () => new Date().toISOString() })
  created_at: Date;
}

export const TeachersSchema = SchemaFactory.createForClass(Teachers);
