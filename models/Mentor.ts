import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMentor extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  about: string;
  specialties: string[];
  experience: {
    company: string;
    role: string;
    period: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  pricing: {
    chat: number;
    video: number;
    call: number;
  };
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    specialties: [{ type: String }],
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        period: { type: String, required: true },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String, required: true },
      },
    ],
    pricing: {
      chat: { type: Number, required: true },
      video: { type: Number, required: true },
      call: { type: Number, required: true },
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development due to hot reloading
const Mentor =
  (mongoose.models.Mentor as Model<IMentor>) ||
  mongoose.model<IMentor>("Mentor", MentorSchema);

export default Mentor;
