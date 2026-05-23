import { NextRequest, NextResponse } from "next/server";

/*
  PUT YOUR KEYS IN .env.local — never hardcode them here:

  CASHFREE_APP_ID=12897879dde61a1912a5193d1b17879821
  CASHFREE_SECRET_KEY=<your NEW secret key after regenerating>
  NEXT_PUBLIC_DOMAIN=https://yarwngmathematicsonline.vercel.app

  ⚠️  IMPORTANT: Regenerate your secret key in the Cashfree dashboard NOW
  because it was shared in plain text. The App ID is safe to keep.
*/

export async function POST(req: NextRequest) {
  try {
    const { amount, name, phone, studentClass } = await req.json();

    if (!amount || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = `YM_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const res = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id":     process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      },
      body: JSON.stringify({
        order_id:       orderId,
        order_amount:   amount,
        order_currency: "INR",
        customer_details: {
          customer_id:    phone.replace(/\D/g, ""),   // digits only
          customer_name:  name,
          customer_phone: phone.replace(/\D/g, ""),
        },
        order_meta: {
          notify_url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/cashfree/webhook`,
        },
        order_tags: { studentClass },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Cashfree error:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({
      orderId:          data.order_id,
      paymentSessionId: data.payment_session_id,
    });
  } catch (err) {
    console.error("create-order exception:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}