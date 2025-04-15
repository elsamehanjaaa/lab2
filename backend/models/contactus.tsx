import mongoose, { Schema, Document } from 'mongoose';

export interface IContactUs extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactUsSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ContactUs || mongoose.model<IContactUs>('ContactUs', ContactUsSchema);
