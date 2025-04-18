import mongoose from "mongoose";

export interface IPayment extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The user who made the payment (mentee)
  recipientId: mongoose.Types.ObjectId; // The recipient of the payment (mentor)
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
