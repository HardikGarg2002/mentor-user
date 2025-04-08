import { ISession } from "@/types";
import mongoose, { Schema, type Model } from "mongoose";

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
    duration: { type: Number, required: true, default: 60 }, // default to 60 minutes
    timezone: { type: String, required: true, default: "UTC" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    price: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development due to hot reloading
const Session =
  (mongoose.models.Session as Model<ISession>) ||
  mongoose.model<ISession>("Session", SessionSchema);

export default Session;
