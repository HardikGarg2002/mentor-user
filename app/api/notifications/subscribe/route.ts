import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo; replace with DB in production
const subscriptions: any[] = [];

export async function POST(req: NextRequest) {
  const subscription = await req.json();
  subscriptions.push(subscription);
  return NextResponse.json({ success: true });
}

export { subscriptions };
