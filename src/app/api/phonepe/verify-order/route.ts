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

export async function GET(req: NextRequest) {
  const merchantTransactionId = req.nextUrl.searchParams.get("txnId");

  if (!merchantTransactionId) {
    return NextResponse.json({ error: "Missing txnId" }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(`${PHONEPE_BASE_URL}/checkout/v2/order/${merchantTransactionId}/status`, {
      method: "GET",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    /*
      data.state values:
        COMPLETED  — payment successful
        PENDING    — still pending
        FAILED     — payment failed
    */
    return NextResponse.json({
      success: data.state === "COMPLETED",
      code:    data.state === "COMPLETED" ? "PAYMENT_SUCCESS" : data.state === "FAILED" ? "PAYMENT_DECLINED" : "PAYMENT_PENDING",
      status:  data.state,
      amount:  data.amount,
      transactionId:        data.transactionId,
      merchantTransactionId: data.merchantOrderId,
    });
  } catch (err) {
    console.error("PhonePe verify exception:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}