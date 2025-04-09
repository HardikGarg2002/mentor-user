import { Schema, model, type Document, Types } from "mongoose";

export interface IBooking extends Document {
  mentorId: Types.ObjectId;
  menteeId: Types.ObjectId;

  date: Date; // Calendar date of the booking
  startTime: string; // "14:00"
  timezone: string; // "Asia/Calcutta"

  meetingType: "video" | "call" | "chat";
  status: "pending" | "confirmed" | "cancelled" | "completed";

  paymentId?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // format: "14:00"
    timezone: { type: String, default: "Asia/Calcutta" },

    meetingType: {
      type: String,
      enum: ["video", "call", "chat"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  {
    timestamps: true,
  }
);

export default model<IBooking>("Booking", BookingSchema);
