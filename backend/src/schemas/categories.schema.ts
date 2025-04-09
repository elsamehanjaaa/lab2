import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Categories extends Document {
  @Prop()
  declare _id: string;

  @Prop()
  name: string;
  @Prop()
  slug: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
