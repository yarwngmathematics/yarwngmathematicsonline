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
  try { data = JSON.parse(rawText); } catch {
    throw new Error("Token response not JSON: " + rawText);
  }
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

    // Log full response to see every field PhonePe returns
    console.log("[PhonePe verify] Full response:", rawText);

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        code:    "VERIFICATION_ERROR",
        status:  "ERROR",
      }, { status: res.status });
    }

    let data: any;
    try { data = JSON.parse(rawText); } catch {
      throw new Error("Status response not JSON: " + rawText);
    }

    // Log all possible merchant order ID fields so we know exactly what PhonePe returns
    console.log("[PhonePe verify] merchantOrder fields:", {
      flat:            data.merchantOrderId,
      nested:          data.merchantOrder,
      nestedOrderId:   data.merchantOrder?.orderId,
      topLevelOrderId: data.orderId,
    });

    // PhonePe v2 sometimes nests the merchant order ID — check all known locations
    const merchantOrderId: string =
      data.merchantOrderId          ||  // flat (some responses)
      data.merchantOrder?.orderId   ||  // nested object (v2 common)
      data.orderId                  ||  // alternate flat field
      orderId;                          // absolute fallback — what we originally sent

    // PhonePe PG v2 returns the UPI transaction ref in multiple possible fields.
    // Try all known field names so the sheet always gets the UTR.
    const utrOrTransactionId: string =
      data.paymentDetails?.[0]?.transactionId  ||  // UPI UTR number
      data.paymentDetails?.[0]?.utr            ||  // alternate UTR field
      data.paymentDetails?.[0]?.rrn            ||  // RRN (some payment modes)
      data.transactionId                       ||  // top-level transaction ID
      merchantOrderId;                             // fallback to merchant order ID

    const state: string = data.state ?? data.status ?? "";

    console.log("[PhonePe verify] state:", state, "| utr:", utrOrTransactionId, "| merchantOrderId:", merchantOrderId);

    const code =
      state === "COMPLETED" ? "PAYMENT_SUCCESS"  :
      state === "FAILED"    ? "PAYMENT_DECLINED" :
                              "PAYMENT_PENDING";

    return NextResponse.json({
      success:               state === "COMPLETED",
      code,
      status:                state,
      amount:                data.amount,

      // UTR / bank reference — returned under both names so client always finds it
      transactionId:         utrOrTransactionId,
      utr:                   utrOrTransactionId,

      // Merchant order ID — this is what should go into your Google Sheet
      merchantTransactionId: merchantOrderId,
      orderId:               merchantOrderId,      // alias so sheet code always finds it
    });

  } catch (err: any) {
    console.error("[PhonePe verify] Exception:", err?.message ?? err);
    return NextResponse.json(
      { success: false, code: "VERIFICATION_ERROR", error: "Verification failed" },
      { status: 500 }
    );
  }
}