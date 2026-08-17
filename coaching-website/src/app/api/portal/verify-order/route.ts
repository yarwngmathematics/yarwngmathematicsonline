import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

const TOKEN_URL  = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order";

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.PHONEPE_CLIENT_ID!,
      client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      client_version: process.env.PHONEPE_CLIENT_VERSION ?? "1",
      grant_type: "client_credentials",
    }),
  });
  const rawText = await res.text();
  if (!res.ok) throw new Error(`Token fetch failed ${res.status}: ${rawText}`);
  let data: any;
  try { data = JSON.parse(rawText); } catch { throw new Error("Token not JSON: " + rawText); }
  if (!data.access_token) throw new Error("No access_token: " + JSON.stringify(data));
  return data.access_token as string;
}

// ── GET /api/portal/verify-order?txnId=... ─────────────────
// Confirms payment with PhonePe directly (never trusts the redirect alone),
// then — only on a confirmed COMPLETED state, and only once per order —
// extends the student's paymentDueDate and flips paymentStatus to "active".
export async function GET(req: NextRequest) {
  const txnId = req.nextUrl.searchParams.get("txnId");
  if (!txnId) return NextResponse.json({ error: "Missing txnId" }, { status: 400 });

  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${STATUS_URL}/${txnId}/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `O-Bearer ${accessToken}` },
      cache: "no-store",
    });

    const rawText = await res.text();
    if (!res.ok) {
      return NextResponse.json({ success: false, code: "VERIFICATION_ERROR", status: "ERROR" }, { status: res.status });
    }

    let data: any;
    try { data = JSON.parse(rawText); } catch { throw new Error("Status not JSON: " + rawText); }
    const state = data.state ?? data.status ?? "";
    const code =
      state === "COMPLETED" ? "PAYMENT_SUCCESS"  :
      state === "FAILED"    ? "PAYMENT_DECLINED" :
                               "PAYMENT_PENDING";

    if (state === "COMPLETED") {
      const orderRef = adminDb.collection("paymentOrders").doc(txnId);
      const orderSnap = await orderRef.get();

      // `processed` guard makes this safe to call repeatedly (page refresh,
      // React effect re-firing, etc.) without double-extending the due date.
      if (orderSnap.exists && !orderSnap.data()?.processed) {
        const order = orderSnap.data()!;
        const userRef = adminDb.collection("users").doc(order.uid);
        const userSnap = await userRef.get();
        const existingDue = userSnap.data()?.paymentDueDate ? new Date(userSnap.data()!.paymentDueDate) : null;

        // If they still have time left, extend from that date. Otherwise start from today.
        const base = existingDue && existingDue > new Date() ? existingDue : new Date();
        const newDue = new Date(base);
        if (order.plan === "annual") newDue.setFullYear(newDue.getFullYear() + 1);
        else newDue.setMonth(newDue.getMonth() + 1);

        await userRef.update({
          paymentStatus: "active",
          paymentPlan: order.plan,
          paymentDueDate: newDue.toISOString().slice(0, 10),
          studentClass: order.studentClass,
        });
        await orderRef.update({ processed: true, status: "completed" });
      }
    }

    return NextResponse.json({ success: state === "COMPLETED", code, status: state, amount: data.amount });
  } catch (err: any) {
    console.error("[Portal verify-order] Exception:", err?.message ?? err);
    return NextResponse.json({ success: false, code: "VERIFICATION_ERROR", error: "Verification failed" }, { status: 500 });
  }
}