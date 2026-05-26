import { NextRequest, NextResponse } from "next/server";

const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // PhonePe new API webhook sends: { type, payload: { ... }, authorization }
    const { type, payload: eventPayload, authorization } = body;

    // Basic authorization check — PhonePe sends your CLIENT_SECRET as bearer
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

    // ── Add server-side actions here if needed ──
    // e.g. send confirmation email, update a database record.
    // Google Sheets submission is handled client-side via /payment-success page
    // because that page has access to sessionStorage with student reg details.

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("PhonePe callback error:", err?.message ?? err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}