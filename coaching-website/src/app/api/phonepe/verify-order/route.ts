import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL  = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order";

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
  if (!res.ok) throw new Error(`Token fetch failed ${res.status}: ${rawText}`);
  let data: any;
  try { data = JSON.parse(rawText); } catch { throw new Error("Token not JSON: " + rawText); }
  if (!data.access_token) throw new Error("No access_token: " + JSON.stringify(data));
  return data.access_token as string;
}

export async function GET(req: NextRequest) {
  const txnId = req.nextUrl.searchParams.get("txnId");
  if (!txnId) return NextResponse.json({ error: "Missing txnId" }, { status: 400 });

  // Strip -F suffix from fallback orders
  const orderId = txnId.endsWith("-F") ? txnId.slice(0, -2) : txnId;

  try {
    const accessToken = await getAccessToken();
    const url = `${STATUS_URL}/${orderId}/status`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const rawText = await res.text();

    // ── Log the FULL response so we can see every field PhonePe returns ──
    console.log("[PhonePe verify] Full raw response:", rawText);

    if (!res.ok) {
      return NextResponse.json({
        success: false, code: "VERIFICATION_ERROR", status: "ERROR",
      }, { status: res.status });
    }

    let data: any;
    try { data = JSON.parse(rawText); } catch { throw new Error("Status not JSON: " + rawText); }

    const state = data.state ?? data.status ?? "";

    // ── Try every known field name PhonePe uses for the UTR/transaction ID ──
    const pd = data.paymentDetails?.[0]
            || data.paymentDetail?.[0]
            || data.payment?.[0]
            || {};

    console.log("[PhonePe verify] paymentDetails[0]:", JSON.stringify(pd));
    console.log("[PhonePe verify] top-level keys:", Object.keys(data).join(", "));

    const utrOrOrderId =
      pd.transactionId      ||  // UPI UTR — PG v2 primary field
      pd.utr                ||  // alternate
      pd.bankTransactionId  ||  // bank ref
      pd.pgTransactionId    ||  // PG internal ref
      pd.rrn                ||  // RRN number (some banks)
      data.transactionId    ||  // top-level fallback
      data.data?.transactionId ||
      data.merchantOrderId  ||  // our order ID
      orderId;                   // absolute fallback

    console.log("[PhonePe verify] resolved utrOrOrderId:", utrOrOrderId);

    const code =
      state === "COMPLETED" ? "PAYMENT_SUCCESS"  :
      state === "FAILED"    ? "PAYMENT_DECLINED" :
                              "PAYMENT_PENDING";

    return NextResponse.json({
      success:               state === "COMPLETED",
      code,
      status:                state,
      amount:                data.amount,
      transactionId:         utrOrOrderId,
      utr:                   utrOrOrderId,
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