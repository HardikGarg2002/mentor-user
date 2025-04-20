import mongoose from "mongoose";

// Payment status values
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
// Create enum-like objects
export const PaymentStatus = {
  PENDING: "pending" as PaymentStatus,
  COMPLETED: "completed" as PaymentStatus,
  FAILED: "failed" as PaymentStatus,
  REFUNDED: "refunded" as PaymentStatus,
};

export interface IPayment extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The user who made the payment (mentee)
  recipientId: mongoose.Types.ObjectId; // The recipient of the payment (mentor)
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
