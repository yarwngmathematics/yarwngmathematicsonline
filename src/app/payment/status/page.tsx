"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

const WHATSAPP_LINKS: Record<string, string> = {
  "Class 10": "https://chat.whatsapp.com/DDdQ4xpOj3SA5RiVlPZ7Ar?s=cl&p=a&mlu=1",
  "Class 11": "https://chat.whatsapp.com/E9FN3Nh6dLx3dKa7VGENkI?s=cl&p=a&mlu=1",
  "Class 12": "https://chat.whatsapp.com/HUe0D5AybDc7aBivxsp426?s=cl&p=a&mlu=1",
};

async function submitToSheet(payload: Record<string, string>) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("Sheet submission failed:", e);
  }
}

function PaymentStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const txnId  = params.get("txnId") || "";

  const [studentClass, setStudentClass] = useState("");
  const [studentName,  setStudentName]  = useState("");
  const [status, setStatus] = useState<"checking" | "success" | "failed" | "pending">("checking");
  const [countdown, setCountdown] = useState(5);
  const sheetDone = useRef(false);
  const waOpened  = useRef(false);

  // ── Single verify call — no polling ──────────────────────────────────────
  useEffect(() => {
    if (!txnId) { setStatus("failed"); return; }

    const verify = async () => {
      try {
        const res  = await fetch(`/api/phonepe/verify-order?txnId=${encodeURIComponent(txnId)}`);
        const data = await res.json();

        if (data.code === "PAYMENT_SUCCESS" || data.status === "COMPLETED") {
          // Read reg data from sessionStorage
          const stored = sessionStorage.getItem(`ym_reg_${txnId}`);
          if (stored && !sheetDone.current) {
            sheetDone.current = true;
            const reg = JSON.parse(stored);
            setStudentClass(reg.studentClass || "");
            setStudentName(reg.name || "");
            await submitToSheet({
              ...reg,
              transactionId: data.transactionId || txnId,
              status:        "paid_phonepe_pg",
              paidAmount:    String((data.amount || 0) / 100),
              timestamp:     new Date().toISOString(),
            });
            sessionStorage.removeItem(`ym_reg_${txnId}`);
          }
          setStatus("success");
          return;
        }

        if (data.code === "PAYMENT_DECLINED" || data.status === "FAILED") {
          setStatus("failed");
          return;
        }

        setStatus("pending");
      } catch {
        setStatus("pending");
      }
    };

    verify();
  }, [txnId]);

  // ── Auto-open WhatsApp + countdown on success ─────────────────────────────
  useEffect(() => {
    if (status !== "success") return;

    const openWA = setTimeout(() => {
      if (!waOpened.current && studentClass && WHATSAPP_LINKS[studentClass]) {
        waOpened.current = true;
        window.open(WHATSAPP_LINKS[studentClass], "_blank", "noopener,noreferrer");
      }
    }, 600);

    let c = 5;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(t); router.push("/"); }
    }, 1000);

    return () => { clearTimeout(openWA); clearInterval(t); };
  }, [status, studentClass, router]);

  const waLink = WHATSAPP_LINKS[studentClass] || "/";

  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "40px 32px",
      maxWidth: 420, width: "100%", textAlign: "center",
      boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
    }}>

      {/* ── CHECKING ── */}
      {status === "checking" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#111827" }}>
            Verifying Payment…
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Please wait a moment.
          </p>
        </>
      )}

      {/* ── SUCCESS ── */}
      {status === "success" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>
            Payment Successful!
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            {studentName ? `Welcome, ${studentName}! ` : ""}
            You're registered for <strong>{studentClass || "your class"}</strong>.
          </p>

          <div style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0",
            borderRadius: 14, padding: 16, marginBottom: 16,
          }}>
            <p style={{ color: "#15803d", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              ✅ {studentClass || "Class"} WhatsApp Group
            </p>
            <p style={{ color: "#16a34a", fontSize: 12 }}>
              {countdown > 0 ? `Redirecting to home in ${countdown}s` : "Redirecting…"}
            </p>
          </div>

          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#16a34a", color: "#fff",
            padding: "14px", borderRadius: 12, fontWeight: 700,
            fontSize: 15, textDecoration: "none", marginBottom: 12,
          }}>
            💬 Open WhatsApp Group
          </a>

          <div style={{
            background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10,
            padding: "10px 14px", fontSize: 11, color: "#9ca3af",
            marginBottom: 12, wordBreak: "break-all", textAlign: "left",
          }}>
            <span style={{ fontWeight: 600 }}>Txn ID: </span>{txnId}
          </div>

          <button onClick={() => router.push("/")} style={{
            width: "100%", background: "#f3f4f6", color: "#374151",
            padding: "12px", borderRadius: 12, fontWeight: 600,
            fontSize: 14, border: "none", cursor: "pointer",
          }}>
            Back to Home
          </button>
        </>
      )}

      {/* ── FAILED ── */}
      {status === "failed" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>
            Payment Failed
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            Your payment could not be completed. No amount has been deducted.
          </p>
          <button onClick={() => router.push("/")} style={{
            width: "100%", background: "#2563eb", color: "#fff",
            padding: "14px", borderRadius: 12, fontWeight: 700,
            fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10,
          }}>
            Try Again
          </button>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Need help? Call us at{" "}
            <a href="tel:9366030347" style={{ color: "#3b82f6" }}>9366030347</a>
          </p>
        </>
      )}

      {/* ── PENDING ── */}
      {status === "pending" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#d97706", marginBottom: 8 }}>
            Payment Pending
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            We couldn't confirm your payment yet. If money was deducted, it
            will be verified within 24 hours.
          </p>
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 12, padding: "12px 16px",
            fontSize: 13, color: "#92400e", marginBottom: 20,
            wordBreak: "break-all",
          }}>
            Transaction ID: <strong>{txnId}</strong>
          </div>
          <a href="https://wa.me/919366030347" target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#16a34a", color: "#fff",
            padding: "14px", borderRadius: 12, fontWeight: 700,
            fontSize: 15, textDecoration: "none", marginBottom: 10,
          }}>
            💬 Contact on WhatsApp
          </a>
          <button onClick={() => router.push("/")} style={{
            width: "100%", background: "#f3f4f6", color: "#374151",
            padding: "12px", borderRadius: 12, fontWeight: 600,
            fontSize: 14, border: "none", cursor: "pointer",
          }}>
            Back to Home
          </button>
        </>
      )}

    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#060f2e,#0d1b4b)",
      fontFamily: "'Outfit',sans-serif",
      padding: "20px",
    }}>
      <Suspense fallback={
        <div style={{
          background: "#fff", borderRadius: 24, padding: "40px 32px",
          maxWidth: 420, width: "100%", textAlign: "center",
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading…</p>
        </div>
      }>
        <PaymentStatus />
      </Suspense>
    </main>
  );
}