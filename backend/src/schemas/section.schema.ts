import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Section extends Document {
  @Prop()
  declare _id: string;

  @Prop()
  name: string;

  @Prop({ required: true, type: Number })
  index: number;

  @Prop()
  course_id: string;

  @Prop({ type: String, default: () => new Date().toISOString() })
  created_at: Date;

  

}

export const SectionSchema = SchemaFactory.createForClass(Section);
