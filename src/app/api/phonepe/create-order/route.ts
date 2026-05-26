import { NextRequest, NextResponse } from "next/server";

const PHONEPE_BASE_URL = "https://api.phonepe.com/apis/hermes";

async function getAccessToken() {
  const res = await fetch(`${PHONEPE_BASE_URL}/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.PHONEPE_CLIENT_ID!,
      client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION!,
      grant_type:    "client_credentials",
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get PhonePe access token");
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, name, phone, studentClass } = await req.json();

    if (!amount || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_DOMAIN!;
    const merchantTransactionId = `YM_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    const accessToken = await getAccessToken();

    const payload = {
      merchantOrderId: merchantTransactionId,
      amount: amountInPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `${studentClass} fee - ${name}`,
        merchantUrls: {
          redirectUrl: `${domain}/payment/status?txnId=${merchantTransactionId}&class=${encodeURIComponent(studentClass)}`,
        },
      },
    };

    const res = await fetch(`${PHONEPE_BASE_URL}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.redirectUrl) {
      console.error("PhonePe create-order error:", data);
      return NextResponse.json({ error: data.message || "PhonePe order creation failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      merchantTransactionId,
      redirectUrl: data.redirectUrl,
    });
  } catch (err) {
    console.error("PhonePe create-order exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}