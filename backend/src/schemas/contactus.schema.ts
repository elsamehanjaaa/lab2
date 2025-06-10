// src/schemas/contactus.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class ContactUs extends Document {
  @Prop()
  declare _id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  created_at: Date;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);