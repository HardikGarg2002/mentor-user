import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMentorWeeklyAvailability extends Document {
  mentorId: mongoose.Types.ObjectId;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorWeeklyAvailabilitySchema = new Schema<IMentorWeeklyAvailability>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: {
      type: String,
      default: "Asia/Calcutta",
    },
  },
  {
    timestamps: true,
  }
);

MentorWeeklyAvailabilitySchema.index(
  { mentorId: 1, dayOfWeek: 1, startTime: 1 },
  { unique: true }
);

const MentorWeeklyAvailability =
  (mongoose.models
    .MentorWeeklyAvailability as Model<IMentorWeeklyAvailability>) ||
  mongoose.model<IMentorWeeklyAvailability>(
    "MentorWeeklyAvailability",
    MentorWeeklyAvailabilitySchema
  );

export default MentorWeeklyAvailability;
