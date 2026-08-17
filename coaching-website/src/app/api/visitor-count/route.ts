import { NextResponse } from "next/server";

// ── CounterAPI v2 config ──────────────────────────────────────────────
// v1 was retired on Aug 7, 2026. v2 requires a workspace + Bearer token.
// 1. Sign up at https://counterapi.dev and create a workspace.
// 2. Create an access token in the dashboard.
// 3. Set these as environment variables (e.g. in .env.local / your host's
//    env settings) — NEVER hardcode the token or prefix it with NEXT_PUBLIC_,
//    or it will be exposed to the browser.
//
//    COUNTERAPI_WORKSPACE=yarwngmathematics
//    COUNTERAPI_TOKEN=your_access_token_here
// ────────────────────────────────────────────────────────────────────

const WORKSPACE = process.env.COUNTERAPI_WORKSPACE;
const TOKEN = process.env.COUNTERAPI_TOKEN;
const COUNTER_NAME = "site-visitors-2026";

export async function GET() {
  if (!WORKSPACE || !TOKEN) {
    console.error(
      "Visitor counter misconfigured: COUNTERAPI_WORKSPACE / COUNTERAPI_TOKEN env vars are missing."
    );
    return NextResponse.json({ success: false }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER_NAME}/up`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    // v2 response shape: { code, data: { up_count, down_count, value, ... } }
    const count =
      typeof json?.data?.value === "number"
        ? json.data.value
        : typeof json?.data?.up_count === "number"
        ? json.data.up_count
        : null;

    if (count === null) throw new Error("Unexpected response shape");

    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("Visitor counter (v2) failed:", err);

    // Fallback: try a non-incrementing read so a transient /up failure
    // doesn't wipe out the displayed count.
    try {
      const res = await fetch(
        `https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER_NAME}`,
        {
          headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
          cache: "no-store",
        }
      );
      const json = await res.json();
      const count =
        typeof json?.data?.value === "number" ? json.data.value : null;
      if (count !== null) {
        return NextResponse.json({ success: true, count });
      }
    } catch {
      // fall through
    }

    return NextResponse.json({ success: false }, { status: 502 });
  }
}