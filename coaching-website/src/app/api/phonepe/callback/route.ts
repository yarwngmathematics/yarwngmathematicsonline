import { NextRequest, NextResponse } from "next/server";

const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, payload: eventPayload, authorization } = body;
    if (authorization !== CLIENT_SECRET) {
      console.warn("PhonePe callback: unauthorized request");
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const {
      merchantOrderId,
      state,
      amount,
    } = eventPayload ?? {};

    console.log(
      `PhonePe webhook | type=${type} | orderId=${merchantOrderId} | state=${state} | amount=${amount}`
    );
   return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("PhonePe callback error:", err?.message ?? err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}