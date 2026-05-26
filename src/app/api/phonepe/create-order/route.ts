
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const PHONEPE_BASE = "https://api.phonepe.com/apis/pg";

// ── Step 1: Get short-lived OAuth token ──────────────────
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PhonePe token fetch failed ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`No access_token returned: ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
}

// ── POST /api/phonepe/create-order ───────────────────────
// Body: { amount: number, name: string, phone: string, studentClass: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, name, phone, studentClass } = body;

    if (!amount || !name || !phone || !studentClass) {
      return NextResponse.json(
        { success: false, error: { message: "Missing required fields." } },
        { status: 400 }
      );
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("PhonePe env vars not set — check PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET");
      return NextResponse.json(
        { success: false, error: { message: "Payment gateway not configured. Contact support." } },
        { status: 500 }
      );
    }

    // Unique order ID — max 38 chars, alphanumeric + hyphens only
    const merchantOrderId = `YM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // PhonePe requires amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    // Get OAuth access token
    const accessToken = await getAccessToken();

    // Build checkout payload
    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200, // seconds — 20 minutes
      metaInfo: {
        udf1: name,
        udf2: phone.replace(/\D/g, "").slice(-10),
        udf3: studentClass,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Yarwng Mathematics – ${studentClass} Enrollment`,
        merchantUrls: {
          redirectUrl: `${APP_URL}/api/phonepe/status?txnId=${merchantOrderId}`,
        },
      },
    };

    // Initiate payment order
    const orderRes = await fetch(`${PHONEPE_BASE}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const orderData = await orderRes.json();

    // Success — PhonePe returns a redirectUrl to the payment page
    if (orderRes.ok && orderData.redirectUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: orderData.redirectUrl,
        merchantTransactionId: merchantOrderId,
      });
    }

    // PhonePe returned an error
    console.error("PhonePe order error:", JSON.stringify(orderData));
    return NextResponse.json({
      success: false,
      error: {
        message:
          orderData.message ||
          orderData.error?.description ||
          "Payment initiation failed. Please try again.",
        code: orderData.code ?? orderRes.status,
      },
    });

  } catch (err: any) {
    console.error("PhonePe create-order exception:", err?.message ?? err);
    return NextResponse.json(
      { success: false, error: { message: "Server error. Please try again." } },
      { status: 500 }
    );
  }
}