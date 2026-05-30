"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

const WHATSAPP: Record<string, string> = {
  "Class 10": "https://chat.whatsapp.com/DDdQ4xpOj3SA5RiVlPZ7Ar?s=cl&p=a&mlu=1",
  "Class 11": "https://chat.whatsapp.com/E9FN3Nh6dLx3dKa7VGENkI?s=cl&p=a&mlu=1",
  "Class 12": "https://chat.whatsapp.com/HUe0D5AybDc7aBivxsp426?s=cl&p=a&mlu=1",
};

type RegData = {
  name: string;
  whatsapp: string;
  studentClass: string;
  board: string;
  medium: string;
  schoolName: string;
  address: string;
  mode: string;
};

function PaymentSuccessInner() {
  const params = useSearchParams();
  const txnId = params.get("txnId") || params.get("txnid") || "";
  const status = (params.get("status") || "").toLowerCase();

 const [state, setState] = useState<"loading" | "verifying" | "success" | "failed" | "error">("loading");
  const [regData, setRegData] = useState<RegData | null>(null);
  const [utrId, setUtrId] = useState(""); // ← NEW: store UTR from verify response
  const [sheetDone, setSheetDone] = useState(false);
  const [sheetError, setSheetError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const submitted = useRef(false);

  // ── 1. Read registration data from sessionStorage ─────────────────────────
  useEffect(() => {
    if (!txnId) { setState("error"); return; }

    const raw = sessionStorage.getItem(`ym_reg_${txnId}`);
    if (!raw) { setState("error"); return; }

    try {
      const parsed: RegData = JSON.parse(raw);
      setRegData(parsed);
      setState("verifying");
    } catch {
      setState("error");
    }
  }, [txnId]);

  // ── 2. Verify payment server-side ─────────────────────────────────────────
  useEffect(() => {
    if (state !== "verifying" || !txnId) return;

    const verify = async () => {
      try {
        const res = await fetch(`/api/phonepe/verify?txnId=${encodeURIComponent(txnId)}`);
        const data = await res.json();

        console.log("[Status page] verify response:", data);

        if (data.success && data.status === "COMPLETED") {
          // ← Save the UTR/transaction ID returned by PhonePe
          setUtrId(data.utr || data.transactionId || txnId);
          setState("success");
        } else {
          setState("failed");
        }
      } catch {
        if (status === "success") {
          setUtrId(txnId); // fallback
          setState("success");
        } else {
          setState("failed");
        }
      }
    };

    verify();
  }, [state, txnId, status]);

  // ── 3. Submit to Google Sheet once payment confirmed ──────────────────────
  useEffect(() => {
    if (state !== "success" || !regData || submitted.current) return;
    submitted.current = true;

    const submitSheet = async () => {
      try {
        const payload = {
          timestamp: new Date().toISOString(),
          name: regData.name,
          whatsapp: regData.whatsapp,
          studentClass: regData.studentClass,
          board: regData.board,
          medium: regData.medium,
          schoolName: regData.schoolName,
          address: regData.address,
          mode: regData.mode,
          // ← THIS is what was missing — send both IDs to the sheet
          utrOrderId: utrId || txnId,
          merchantOrderId: txnId,
          paymentStatus: "paid_phonepe_pg",
        };

        console.log("[Sheet] Submitting payload:", payload);

        await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setSheetDone(true);
        sessionStorage.removeItem(`ym_reg_${txnId}`);
      } catch (err) {
        setSheetError("Could not save to sheet — please contact support.");
        console.error("Sheet submit error:", err);
      }
    };

    submitSheet();
  }, [state, regData, txnId, utrId]);

  // ── 4. Auto-open WhatsApp + countdown ────────────────────────────────────
  useEffect(() => {
    if (state !== "success" || !regData?.studentClass) return;
    const link = WHATSAPP[regData.studentClass];
    if (!link) return;

    window.open(link, "_blank", "noopener,noreferrer");

    let c = 5;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [state, regData?.studentClass]);

  const waLink = regData ? WHATSAPP[regData.studentClass] : null;

  return (
    <main style={styles.page}>
      <style>{css}</style>

      <div style={styles.card}>
        {/* ── LOADING / VERIFYING ── */}
        {(state === "loading" || state === "verifying") && (
          <div style={styles.center}>
            <div className="ym-spin-ring" />
            <p style={styles.verifyText}>
              {state === "loading" ? "Loading…" : "Verifying your payment…"}
            </p>
            <p style={styles.verifySubText}>Please wait, do not close this tab.</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {state === "success" && regData && (
          <>
            <div style={styles.successIcon}>🎉</div>
            <h1 style={styles.successTitle}>Payment Successful!</h1>
            <p style={styles.successSub}>
              Welcome to <strong>Yarwng Mathematics</strong>, {regData.name}!
            </p>

            <div style={styles.infoBox}>
              <Row label="Order ID" value={txnId} mono />
              {utrId && utrId !== txnId && (
                <Row label="UTR / Txn ID" value={utrId} mono />
              )}
              <Row label="Class" value={regData.studentClass} />
              <Row label="Board" value={regData.board} />
              <Row label="Mode" value={regData.mode} />
            </div>

            <div style={{ ...styles.sheetStatus, background: sheetDone ? "#f0fdf4" : "#fffbeb", borderColor: sheetDone ? "#bbf7d0" : "#fde68a" }}>
              <span style={{ fontSize: 14 }}>{sheetDone ? "✅" : sheetError ? "⚠️" : "⏳"}</span>
              <span style={{ fontSize: 12, color: sheetDone ? "#15803d" : sheetError ? "#b45309" : "#92400e" }}>
                {sheetDone
                  ? "Registration saved successfully."
                  : sheetError || "Saving your registration…"}
              </span>
            </div>

            {waLink && (
              <div style={styles.waBox}>
                <p style={styles.waTitle}>✅ Join your {regData.studentClass} WhatsApp Group</p>
                <p style={styles.waSub}>
                  {countdown > 0
                    ? `Group link opened automatically. Redirected in ${countdown}s`
                    : "Tap below if it didn't open."}
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={styles.waBtn}>
                  💬 Open {regData.studentClass} WhatsApp Group
                </a>
              </div>
            )}

            <a href="/" style={styles.homeLink}>← Back to Home</a>
          </>
        )}

        {/* ── FAILED ── */}
        {state === "failed" && (
          <div style={styles.center}>
            <div style={styles.failIcon}>❌</div>
            <h1 style={styles.failTitle}>Payment Failed</h1>
            <p style={styles.failSub}>
              Your payment could not be processed. No money has been deducted.<br />
              Please try again or contact us on WhatsApp.
            </p>
            <div style={styles.contactBox}>
              <p style={{ fontSize: 13, color: "#374151", marginBottom: 10 }}>Need help?</p>
              <a href="tel:9366030347" style={styles.contactLink}>📱 9366030347</a>
              <a href="mailto:yarwngmathematics@gmail.com" style={styles.contactLink}>✉️ yarwngmathematics@gmail.com</a>
            </div>
            <a href="/" style={styles.retryBtn}>Try Again →</a>
          </div>
        )}

        {/* ── ERROR (missing data) ── */}
        {state === "error" && (
          <div style={styles.center}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h1 style={styles.failTitle}>Something Went Wrong</h1>
            <p style={styles.failSub}>
              We couldn't find your registration details.<br />
              If you were charged, please contact us immediately.
            </p>
            <div style={styles.contactBox}>
              <a href="tel:9366030347" style={styles.contactLink}>📱 9366030347</a>
              <a href="mailto:yarwngmathematics@gmail.com" style={styles.contactLink}>✉️ yarwngmathematics@gmail.com</a>
            </div>
            <a href="/" style={styles.retryBtn}>← Go Home</a>
          </div>
        )}
      </div>

      <p style={styles.brand}>Yarwng Mathematics · Powered by PhonePe</p>
    </main>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={{ ...styles.rowValue, fontFamily: mono ? "monospace" : undefined, fontSize: mono ? 11 : 13 }}>{value}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #060f2e 0%, #0d1b4b 50%, #0f2d6b 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Outfit', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "36px 32px",
    maxWidth: 480,
    width: "100%",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  },
  center: { textAlign: "center" },
  verifyText: { fontSize: 17, fontWeight: 700, color: "#111827", marginTop: 20, marginBottom: 6 },
  verifySubText: { fontSize: 13, color: "#6b7280" },
  successIcon: { fontSize: 56, textAlign: "center", marginBottom: 12 },
  successTitle: { fontSize: 24, fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 6 },
  successSub: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 20 },
  infoBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "14px 18px",
    marginBottom: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  rowValue: { fontSize: 13, color: "#111827", fontWeight: 700 },
  sheetStatus: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid",
    marginBottom: 16,
  },
  waBox: {
    background: "#f0fdf4",
    border: "1.5px solid #bbf7d0",
    borderRadius: 16,
    padding: "18px 20px",
    marginBottom: 18,
    textAlign: "center",
  },
  waTitle: { fontSize: 14, fontWeight: 700, color: "#15803d", marginBottom: 5 },
  waSub: { fontSize: 12, color: "#16a34a", marginBottom: 14 },
  waBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#16a34a",
    color: "#fff",
    padding: "13px 20px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
  },
  homeLink: { display: "block", textAlign: "center", fontSize: 13, color: "#6b7280", textDecoration: "none" },
  failIcon: { fontSize: 52, marginBottom: 14 },
  failTitle: { fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 },
  failSub: { fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 20 },
  contactBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "16px",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  contactLink: { fontSize: 14, color: "#2563eb", textDecoration: "none", fontWeight: 600 },
  retryBtn: {
    display: "inline-block",
    background: "#2563eb",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
  },
  brand: { color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 20 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .ym-spin-ring {
    width: 52px; height: 52px; border-radius: 50%;
    border: 4px solid #e5e7eb;
    border-top-color: #2563eb;
    animation: spin 0.75s linear infinite;
    margin: 0 auto 8px;
  }
`;

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060f2e" }}>
        <div style={{ color: "#fff", fontSize: 16 }}>Loading…</div>
      </main>
    }>
      <PaymentSuccessInner />
    </Suspense>
  );
}