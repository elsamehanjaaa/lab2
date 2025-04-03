import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Categories extends Document {
  @Prop({ required: true, unique: true })
  categoryId: number;
  @Prop()
  name: string;

}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
