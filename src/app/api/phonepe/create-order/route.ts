import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID      = process.env.PHONEPE_CLIENT_ID!;
const CLIENT_SECRET  = process.env.PHONEPE_CLIENT_SECRET!;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION ?? "1";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL!;

const TOKEN_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PAY_URL   = "https://api.phonepe.com/apis/pg/checkout/v2/pay";

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

  if (!res.ok) throw new Error(`PhonePe token failed ${res.status}: ${rawText}`);

  let data: any;
  try { data = JSON.parse(rawText); } catch {
    throw new Error("Token response not JSON: " + rawText);
  }
  if (!data.access_token) throw new Error("No access_token: " + JSON.stringify(data));
  return data.access_token as string;
}

function isMobileUA(userAgent: string): boolean {
  return /android|iphone|ipad|ipod|mobile|phone/i.test(userAgent);
}

// ── POST /api/phonepe/create-order ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, name, phone, studentClass, board, medium, schoolName, address, mode } = body;

    const userAgent = req.headers.get("user-agent") || "";
    // page.tsx sends isMobile from window.navigator so it's more accurate than UA sniffing
    const isMobile  = body.isMobile ?? isMobileUA(userAgent);

    if (!amount || !name || !phone || !studentClass) {
      return NextResponse.json(
        { success: false, error: { message: "Missing required fields." } },
        { status: 400 }
      );
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("[PhonePe] Env vars missing");
      return NextResponse.json(
        { success: false, error: { message: "Payment gateway not configured. Contact support." } },
        { status: 500 }
      );
    }

    const merchantOrderId = `YM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const amountInPaise   = Math.round(Number(amount) * 100);
    const cleanPhone      = phone.replace(/\D/g, "").slice(-10);
    const redirectUrl     = `${APP_URL}/payment/status?txnId=${merchantOrderId}`;

    const regData = { name, whatsapp: phone, studentClass, board, medium, schoolName, address, mode };

    const accessToken = await getAccessToken();

    // ── Mobile: INTENT flow opens UPI apps directly (GPay, PhonePe, Paytm…) ──
    // ── Desktop: PG_CHECKOUT shows QR / UPI ID entry page ────────────────────
    const paymentFlow = isMobile
      ? {
          type:      "INTENT",
          targetApp: "PHONEPE_SWITCH",
          message:   `Yarwng Mathematics - ${studentClass} Enrollment`,
          merchantUrls: { redirectUrl },
        }
      : {
          type:    "PG_CHECKOUT",
          message: `Yarwng Mathematics - ${studentClass} Enrollment`,
          merchantUrls: { redirectUrl },
        };

    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: name,
        udf2: cleanPhone,
        udf3: studentClass,
      },
      paymentFlow,
    };

    console.log("[PhonePe] Creating order:", merchantOrderId, "| amount:", amountInPaise, "| mobile:", isMobile);

    const orderRes  = await fetch(PAY_URL, {
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

    // ── INTENT: PhonePe returns intentUrl (upi://pay?…) ──────────────────────
    if (isMobile && orderRes.ok && orderData.intentUrl) {
      return NextResponse.json({
        success:               true,
        intentUrl:             orderData.intentUrl,
        redirectUrl,
        merchantTransactionId: merchantOrderId,
        regData,
        flowType:              "intent",
      });
    }

    // ── PG_CHECKOUT: PhonePe returns a hosted redirectUrl ────────────────────
    if (orderRes.ok && orderData.redirectUrl) {
      return NextResponse.json({
        success:               true,
        redirectUrl:           orderData.redirectUrl,
        merchantTransactionId: merchantOrderId,
        regData,
        flowType:              "checkout",
      });
    }

    // ── INTENT failed → fall back to PG_CHECKOUT ─────────────────────────────
    if (isMobile) {
      console.warn("[PhonePe] INTENT failed, falling back to PG_CHECKOUT");
      const fbOrderId = merchantOrderId + "-F";
      const fbRes = await fetch(PAY_URL, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `O-Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...payload,
          merchantOrderId: fbOrderId,
          paymentFlow: {
            type:    "PG_CHECKOUT",
            message: `Yarwng Mathematics - ${studentClass} Enrollment`,
            merchantUrls: { redirectUrl: `${APP_URL}/payment/status?txnId=${fbOrderId}` },
          },
        }),
      });
      const fbData = await fbRes.json();
      if (fbRes.ok && fbData.redirectUrl) {
        return NextResponse.json({
          success:               true,
          redirectUrl:           fbData.redirectUrl,
          merchantTransactionId: fbOrderId,
          regData,
          flowType:              "checkout",
        });
      }
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