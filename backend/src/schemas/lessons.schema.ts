import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Double } from 'mongoose';

@Schema({ versionKey: false })
export class Lessons extends Document {
  @Prop()
  declare _id: string;

  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop({ required: true, type: Number })
  index: number;

  @Prop()
  section_id: string;
  @Prop()
  video_url: string;

  @Prop({ type: String, default: () => new Date().toISOString() })
  created_at: Date;

  

}

export const LessonsSchema = SchemaFactory.createForClass(Lessons);
