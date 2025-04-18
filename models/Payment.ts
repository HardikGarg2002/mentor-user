import { IPayment } from "@/types/payment";
import mongoose, { Schema, type Model } from "mongoose";

const PaymentSchema = new Schema<IPayment>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String },
    paymentDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development due to hot reloading
const Payment =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
