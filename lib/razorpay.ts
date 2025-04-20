"use server";

import Razorpay from "razorpay";
import crypto from "crypto";

console.log("RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET", process.env.RAZORPAY_KEY_SECRET);
// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});
export async function createOrder(
  amount: number,
  currency: string = "INR",
  receipt: string
) {
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpayInstance.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error };
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    const isAuthentic = generated_signature === signature;

    return { success: isAuthentic };
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return { success: false, error };
  }
}

// export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
