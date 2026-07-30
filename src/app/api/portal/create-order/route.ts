import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL!;

const TOKEN_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PAY_URL   = "https://api.phonepe.com/apis/pg/checkout/v2/pay";

// Monthly prices mirror the homepage offer prices.
// Annual = 11x monthly (one month free). Change this if you want a different annual discount.
const MONTHLY_PRICE: Record<string, number> = {
  "Class 10": 600,
  "Class 11": 800,
  "Class 12": 900,
};

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      client_version: CLIENT_VERSION,
      grant_type: "client_credentials",
    }),
  });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`PhonePe token failed ${res.status}: ${rawText}`);
  let data: any;
  try { data = JSON.parse(rawText); } catch { throw new Error("Token response not JSON: " + rawText); }
  if (!data.access_token) throw new Error("No access_token: " + JSON.stringify(data));
  return data.access_token as string;
}

// ── POST /api/portal/create-order ─────────────────────────
// Requires: Authorization: Bearer <firebase-id-token>
// Body: { plan: "monthly" | "annual", studentClass: "Class 10" | "Class 11" | "Class 12" }
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken) {
      return NextResponse.json({ success: false, error: { message: "Please log in again." } }, { status: 401 });
    }

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ success: false, error: { message: "Session expired. Please log in again." } }, { status: 401 });
    }

    const { plan, studentClass } = await req.json();
    if (!plan || !["monthly", "annual"].includes(plan) || !studentClass || !MONTHLY_PRICE[studentClass]) {
      return NextResponse.json({ success: false, error: { message: "Invalid plan or class." } }, { status: 400 });
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ success: false, error: { message: "Payment gateway not configured." } }, { status: 500 });
    }

    const monthly = MONTHLY_PRICE[studentClass];
    const amount = plan === "annual" ? monthly * 11 : monthly;
    const amountInPaise = amount * 100;

    const merchantOrderId = `YMP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const redirectUrl = `${APP_URL}/student/payment-status?txnId=${merchantOrderId}`;

    // Record intent BEFORE calling PhonePe. Verification looks this doc up
    // by order ID to know which student + plan to grant — never trusts the client.
    await adminDb.collection("paymentOrders").doc(merchantOrderId).set({
      uid,
      plan,
      studentClass,
      amount,
      status: "pending",
      processed: false,
      createdAt: new Date().toISOString(),
    });

    const accessToken = await getAccessToken();

    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      metaInfo: { udf1: uid, udf2: plan, udf3: studentClass },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Yarwng Mathematics - ${studentClass} ${plan} renewal`,
        merchantUrls: { redirectUrl },
      },
    };

    const orderRes = await fetch(PAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `O-Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    });

    const rawOrder = await orderRes.text();
    let orderData: any;
    try { orderData = JSON.parse(rawOrder); } catch { throw new Error("Order response not JSON: " + rawOrder); }

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
        message: orderData.message || orderData.error?.description || "Payment initiation failed. Please try again.",
        code: orderData.code ?? orderRes.status,
      },
    });
  } catch (err: any) {
    console.error("[Portal create-order] Exception:", err?.message ?? err);
    return NextResponse.json({ success: false, error: { message: "Server error. Please try again." } }, { status: 500 });
  }
}