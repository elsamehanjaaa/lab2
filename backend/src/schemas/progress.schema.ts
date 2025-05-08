import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Progress extends Document {
  @Prop()
  declare _id: string;

  @Prop({ type: String })
  user_id: string;

  @Prop({ type: String, ref: 'lessons' })
  lesson_id: string;

  @Prop({
    type: String,
    enum: ['not_started', 'incomplete', 'completed'],
    default: 'not_started',
  })
  status: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
