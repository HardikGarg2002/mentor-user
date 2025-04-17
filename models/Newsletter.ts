import mongoose, { Schema, type Model, Document } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  name?: string;
  isVerified: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  token?: string;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String },
    isVerified: { type: Boolean, default: false },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    token: { type: String }, // For unsubscribe/verification
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development due to hot reloading
const NewsletterSubscriber =
  (mongoose.models.NewsletterSubscriber as Model<INewsletterSubscriber>) ||
  mongoose.model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema
  );

export default NewsletterSubscriber;
