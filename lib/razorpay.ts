"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { PAYMENT, Constants } from "@/config";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: PAYMENT.RAZORPAY.KEY_ID,
  key_secret: PAYMENT.RAZORPAY.KEY_SECRET,
});

export async function createOrder(
  amount: number,
  currency: string = PAYMENT.CURRENCY,
  receipt: string,
  notes: Record<string, string> = {}
) {
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt,
      notes,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpayInstance.orders.create(options);
    return {
      success: true,
      order,
      message: Constants.API_RESPONSES.SUCCESS.MESSAGE,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      error,
      code: Constants.ERROR_CODES.PAYMENT_FAILED,
      message: "Failed to create payment order",
    };
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
    // Create a signature verification string
    const text = `${orderId}|${paymentId}`;

    // Verify the signature
    const generated_signature = crypto
      .createHmac("sha256", PAYMENT.RAZORPAY.KEY_SECRET)
      .update(text)
      .digest("hex");

    const isAuthentic = generated_signature === signature;

    return {
      success: isAuthentic,
      message: isAuthentic
        ? "Payment verified successfully"
        : "Invalid payment signature",
    };
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return {
      success: false,
      error,
      code: Constants.ERROR_CODES.PAYMENT_FAILED,
      message: "Failed to verify payment",
    };
  }
}
