// app/api/phonepe/create-order/route.ts
// PhonePe Payment Gateway v2 (2025) — OAuth2 + PG Checkout
//
// ENV VARIABLES needed in Vercel / .env.local:
// PHONEPE_CLIENT_ID=SU260525204137642778219
// PHONEPE_CLIENT_SECRET=<click Show Key in dashboard>
// PHONEPE_CLIENT_VERSION=1
// NEXT_PUBLIC_APP_URL=https://yarwngmathematics.com

import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Correct base URLs for PhonePe PG v2
const TOKEN_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PAY_URL   = "https://api.phonepe.com/apis/pg/checkout/v2/pay";

// ── Get OAuth access token ────────────────────────────────
async function getAccessToken(): Promise<string> {
  console.log("[PhonePe] Fetching token | client_id:", CLIENT_ID, "| has_secret:", !!CLIENT_SECRET);

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

  const rawText = await res.text();
  console.log("[PhonePe] Token response:", res.status, rawText);

  if (!res.ok) {
    throw new Error(`PhonePe token failed ${res.status}: ${rawText}`);
  }

  let data: any;
  try { data = JSON.parse(rawText); } catch {
    throw new Error("Token response not JSON: " + rawText);
  }

  if (!data.access_token) {
    throw new Error("No access_token: " + JSON.stringify(data));
  }
  return data.access_token as string;
}

// ── POST /api/phonepe/create-order ───────────────────────
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
      console.error("[PhonePe] Env vars missing — set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET in Vercel");
      return NextResponse.json(
        { success: false, error: { message: "Payment gateway not configured. Contact support." } },
        { status: 500 }
      );
    }

    // Unique order ID: alphanumeric + hyphens, max 38 chars
    const merchantOrderId = `YM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    // Get token
    const accessToken = await getAccessToken();

    // Build payload
    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: name,
        udf2: phone.replace(/\D/g, "").slice(-10),
        udf3: studentClass,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Yarwng Mathematics - ${studentClass} Enrollment`,
        merchantUrls: {
          redirectUrl: `${APP_URL}/api/phonepe/status?txnId=${merchantOrderId}`,
        },
      },
    };

    console.log("[PhonePe] Creating order:", merchantOrderId, "amount:", amountInPaise);

    const orderRes = await fetch(PAY_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const rawOrder = await orderRes.text();
    console.log("[PhonePe] Order response:", orderRes.status, rawOrder);

    let orderData: any;
    try { orderData = JSON.parse(rawOrder); } catch {
      throw new Error("Order response not JSON: " + rawOrder);
    }

    if (orderRes.ok && orderData.redirectUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: orderData.redirectUrl,
        merchantTransactionId: merchantOrderId,
      });
    }

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
    console.error("[PhonePe] create-order exception:", err?.message ?? err);
    return NextResponse.json(
      { success: false, error: { message: "Server error. Please try again." } },
      { status: 500 }
    );
  }
}