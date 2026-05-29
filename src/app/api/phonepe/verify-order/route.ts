import { NextRequest, NextResponse } from "next/server";

// ✅ Correct base URLs for PhonePe PG v2 API
const TOKEN_URL  = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order"; // /{orderId}/status

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:      process.env.PHONEPE_CLIENT_ID!,
      client_secret:  process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION ?? "1",
      grant_type:     "client_credentials",
    }),
  });

  const rawText = await res.text();
  console.log("[PhonePe verify] Token response:", res.status, rawText);

  if (!res.ok) throw new Error(`Token fetch failed ${res.status}: ${rawText}`);

  let data: any;
  try { data = JSON.parse(rawText); } catch {
    throw new Error("Token response not JSON: " + rawText);
  }

  if (!data.access_token) throw new Error("No access_token in response: " + JSON.stringify(data));
  return data.access_token as string;
}

export async function GET(req: NextRequest) {
  const txnId = req.nextUrl.searchParams.get("txnId");

  if (!txnId) {
    return NextResponse.json({ error: "Missing txnId" }, { status: 400 });
  }

  // Strip the -F suffix added by the fallback flow so we check the right order
  const orderId = txnId.endsWith("-F") ? txnId.slice(0, -2) : txnId;

  try {
    const accessToken = await getAccessToken();

    const url = `${STATUS_URL}/${orderId}/status`;
    console.log("[PhonePe verify] Checking status:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
      // No caching — always fetch fresh status
      cache: "no-store",
    });

    const rawText = await res.text();
    console.log("[PhonePe verify] Status response:", res.status, rawText);

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        code:    "VERIFICATION_ERROR",
        status:  "ERROR",
        raw:     rawText,
      }, { status: res.status });
    }

    let data: any;
    try { data = JSON.parse(rawText); } catch {
      throw new Error("Status response not JSON: " + rawText);
    }

    /*
      PhonePe PG v2 state values:
        COMPLETED — payment successful
        PENDING   — still processing
        FAILED    — payment failed
    */
    const state = data.state ?? data.status ?? "";

    const code =
      state === "COMPLETED" ? "PAYMENT_SUCCESS"  :
      state === "FAILED"    ? "PAYMENT_DECLINED" :
                              "PAYMENT_PENDING";

    return NextResponse.json({
      success:               state === "COMPLETED",
      code,
      status:                state,
      amount:                data.amount,
      transactionId:         data.transactionId,
      merchantTransactionId: data.merchantOrderId ?? orderId,
    });

  } catch (err: any) {
    console.error("[PhonePe verify] Exception:", err?.message ?? err);
    return NextResponse.json(
      { success: false, code: "VERIFICATION_ERROR", error: "Verification failed" },
      { status: 500 }
    );
  }
}