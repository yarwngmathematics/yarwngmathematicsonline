import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const PHONEPE_BASE = "https://api.phonepe.com/apis/pg";

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${PHONEPE_BASE}/v1/oauth/token`, {
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

    // Check order status using merchantOrderId
    const statusRes = await fetch(
      `${PHONEPE_BASE}/checkout/v2/order/${txnId}/status`,
      {
        method: "GET",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `O-Bearer ${accessToken}`,
        },
      }
    );

    const statusData = await statusRes.json();

    // New API: state = "COMPLETED" means paid successfully
    const state = statusData.state ?? statusData.data?.state ?? "UNKNOWN";

    if (state === "COMPLETED") {
      return NextResponse.redirect(
        `${APP_URL}/payment-success?txnId=${txnId}&status=success`
      );
    }

    // FAILED, PENDING, CANCELLED, etc.
    return NextResponse.redirect(
      `${APP_URL}/payment-success?txnId=${txnId}&status=failed&state=${state}`
    );

  } catch (err: any) {
    console.error("PhonePe status error:", err?.message ?? err);
    return NextResponse.redirect(
      `${APP_URL}/payment-success?txnId=${txnId}&status=error`
    );
  }
}