import { IVideoMeet, IVideoMeetStatus } from "@/types/videomeet";
import mongoose, { Schema } from "mongoose";

const MeetingSchema = new Schema<IVideoMeet>(
  {
    meetingId: { type: String, required: true, unique: true },
    // meetingLink: { type: String, required: true },
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // Gym member
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
      index: true,
    }, // Gym trainer
    scheduledAt: { type: Date, required: true, index: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(IVideoMeetStatus),
      default: IVideoMeetStatus.SCHEDULED,
    },
  },
  { timestamps: true, collection: "meeting" }
);

// Add compound index for fast retrieval
MeetingSchema.index({ mentorId: 1, scheduledAt: 1 });

export const Meeting = mongoose.model<IVideoMeet>("Meeting", MeetingSchema);
