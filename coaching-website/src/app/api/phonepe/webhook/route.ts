import { NextRequest, NextResponse } from "next/server";

const PHONEPE_BASE_URL = "https://api.phonepe.com/apis/hermes";

async function getAccessToken() {
  const res = await fetch(`${PHONEPE_BASE_URL}/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:      process.env.PHONEPE_CLIENT_ID!,
      client_secret:  process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION!,
      grant_type:     "client_credentials",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get PhonePe access token");
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /*
      PhonePe sends a webhook with:
      {
        merchantOrderId: "YM_xxx",
        state: "COMPLETED" | "FAILED" | "PENDING",
        transactionId: "PhonePe transaction ID",
        amount: 90000  (in paise)
      }
    */
    const { merchantOrderId, state, transactionId, amount } = body;

    console.log("PhonePe Webhook received:", { merchantOrderId, state, transactionId, amount });

    // Verify the payment independently using the verify API
    if (state === "COMPLETED" && merchantOrderId) {
      const accessToken = await getAccessToken();

      const verifyRes = await fetch(`${PHONEPE_BASE_URL}/checkout/v2/order/${merchantOrderId}/status`, {
        method: "GET",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `O-Bearer ${accessToken}`,
        },
      });

      const verifyData = await verifyRes.json();

      if (verifyData.state === "COMPLETED") {
        console.log("Payment verified successfully:", merchantOrderId);
        // ── ADD YOUR DB WRITE HERE ──
        // e.g. write to Firestore, mark order as paid
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PhonePe webhook exception:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}