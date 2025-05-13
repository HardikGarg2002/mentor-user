import { ISession } from "@/types";
import { SessionStatus } from "@/types/session";
import mongoose, { Schema, type Model } from "mongoose";
import { Constants, DATETIME } from "@/config";

const SessionSchema = new Schema<ISession>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    meeting_type: {
      type: String,
      enum: ["chat", "video", "call"],
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: {
      type: Number,
      required: true,
      default: 60,
      enum: Constants.SESSION_DURATIONS,
    }, // in minutes
    timezone: {
      type: String,
      required: true,
      default: DATETIME.DEFAULT_TIMEZONE,
    },
    status: {
      type: String,
      enum: Object.values(Constants.SESSION_STATUS),
      default: SessionStatus.RESERVED,
    },
    price: { type: Number, required: true },
    rating: {
      type: Number,
      min: Constants.RATING_LEVELS.POOR,
      max: Constants.RATING_LEVELS.EXCELLENT,
    },
    review: { type: String },
    reservationExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes to improve booking query performance
SessionSchema.index({ mentorId: 1, date: 1, startTime: 1, endTime: 1 });
SessionSchema.index({ mentorId: 1, status: 1 });
SessionSchema.index({ status: 1, reservationExpires: 1 }); // For cleanup expired reservations
SessionSchema.index({ menteeId: 1, date: 1 }); // For mentee session listing

// Prevent model overwrite error in development due to hot reloading
const Session =
  (mongoose.models.Session as Model<ISession>) ||
  mongoose.model<ISession>("Session", SessionSchema);

export default Session;
