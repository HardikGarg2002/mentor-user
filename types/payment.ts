import mongoose from "mongoose";
import { Constants, PAYMENT } from "@/config";

// Payment status values - derive from Constants
export type PaymentStatus =
  (typeof Constants.PAYMENT_STATUS)[keyof typeof Constants.PAYMENT_STATUS];

// Create enum-like objects using Constants
export const PaymentStatus = {
  PENDING: Constants.PAYMENT_STATUS.PENDING as PaymentStatus,
  COMPLETED: Constants.PAYMENT_STATUS.COMPLETED as PaymentStatus,
  FAILED: Constants.PAYMENT_STATUS.FAILED as PaymentStatus,
  REFUNDED: Constants.PAYMENT_STATUS.REFUNDED as PaymentStatus,
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
