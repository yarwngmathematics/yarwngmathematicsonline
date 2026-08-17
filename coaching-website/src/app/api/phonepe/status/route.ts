// app/api/phonepe/status/route.ts
// PhonePe redirects user here after payment.
// URL: /api/phonepe/status?txnId=YM-xxx

import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const TOKEN_URL  = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const STATUS_URL = (orderId: string) =>
  `https://api.phonepe.com/apis/pg/checkout/v2/order/${orderId}/status`;

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:      CLIENT_ID,
      client_secret:  CLIENT_SECRET,
      client_version: CLIENT_VERSION,
      grant_type:     "client_credentials",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("No token: " + JSON.stringify(data));
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txnId = searchParams.get("txnId");

  if (!txnId) {
    return NextResponse.redirect(`${APP_URL}/payment-success?status=failed&reason=missing_id`);
  }

  try {
    const accessToken = await getAccessToken();

    const statusRes = await fetch(STATUS_URL(txnId), {
      method: "GET",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
    });

    const statusData = await statusRes.json();
    console.log("[PhonePe] Status:", txnId, JSON.stringify(statusData));

    const state = statusData.state ?? statusData.data?.state ?? "UNKNOWN";

    if (state === "COMPLETED") {
      return NextResponse.redirect(`${APP_URL}/payment-success?txnId=${txnId}&status=success`);
    }

    return NextResponse.redirect(
      `${APP_URL}/payment-success?txnId=${txnId}&status=failed&state=${state}`
    );

  } catch (err: any) {
    console.error("[PhonePe] Status error:", err?.message ?? err);
    return NextResponse.redirect(`${APP_URL}/payment-success?txnId=${txnId}&status=error`);
  }
}