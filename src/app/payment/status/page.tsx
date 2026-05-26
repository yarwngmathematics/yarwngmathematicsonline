"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

const WHATSAPP_LINKS: Record<string, string> = {
  "Class 10": "https://chat.whatsapp.com/DDdQ4xpOj3SA5RiVlPZ7Ar?s=cl&p=a&mlu=1",
  "Class 11": "https://chat.whatsapp.com/E9FN3Nh6dLx3dKa7VGENkI?s=cl&p=a&mlu=1",
  "Class 12": "https://chat.whatsapp.com/HUe0D5AybDc7aBivxsp426?s=cl&p=a&mlu=1",
};

async function submitToSheet(payload: Record<string, string>) {
  try {
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", keepalive: true, body: JSON.stringify(payload) });
  } catch (e) {
    console.warn("Sheet submission failed:", e);
  }
}

export default function PaymentStatusPage() {
  const params       = useSearchParams();
  const router       = useRouter();
  const txnId        = params.get("txnId") || "";
  const studentClass = params.get("class") || "";

  const [status, setStatus]       = useState<"checking" | "success" | "failed" | "pending">("checking");
  const [attempts, setAttempts]   = useState(0);
  const [countdown, setCountdown] = useState(5);
  const sheetDone = useRef(false);

  useEffect(() => {
    if (!txnId) { setStatus("failed"); return; }
    let tries = 0;
    const maxTries = 8;

    const poll = async () => {
      try {
        const res  = await fetch(`/api/phonepe/verify-order?txnId=${txnId}`);
        const data = await res.json();
        tries++;
        setAttempts(tries);

        if (data.code === "PAYMENT_SUCCESS" || data.status === "COMPLETED") {
          setStatus("success");
          if (!sheetDone.current) {
            sheetDone.current = true;
            const stored = sessionStorage.getItem(`ym_reg_${txnId}`);
            if (stored) {
              const reg = JSON.parse(stored);
              await submitToSheet({ ...reg, transactionId: data.transactionId || txnId, status: "paid_phonepe_pg", paidAmount: String((data.amount || 0) / 100), timestamp: new Date().toISOString() });
              sessionStorage.removeItem(`ym_reg_${txnId}`);
            }
          }
          return;
        }

        if (data.code === "PAYMENT_DECLINED" || data.code === "TIMED_OUT" || data.status === "FAILED") {
          setStatus("failed"); return;
        }

        if (tries < maxTries) setTimeout(poll, 3000);
        else setStatus("pending");
      } catch {
        if (tries < maxTries) setTimeout(poll, 3000);
        else setStatus("pending");
      }
    };

    poll();
  }, [txnId]);

  useEffect(() => {
    if (status !== "success") return;
    const waLink = WHATSAPP_LINKS[studentClass];
    if (waLink) window.open(waLink, "_blank", "noopener,noreferrer");
    let c = 5;
    const t = setInterval(() => { c -= 1; setCountdown(c); if (c <= 0) { clearInterval(t); router.push("/"); } }, 1000);
    return () => clearInterval(t);
  }, [status]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#060f2e,#0d1b4b)", fontFamily: "'Outfit',sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>

        {status === "checking" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Verifying Payment…</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Confirming your payment with PhonePe. Please wait.</p>
            <div style={{ background: "#eff6ff", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#1d4ed8" }}>Check {attempts}/8 · Polling every 3s</div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>You're registered for <strong>{studentClass}</strong>.<br />Opening WhatsApp group now…</p>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <p style={{ color: "#15803d", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>✅ {studentClass} WhatsApp Group</p>
              <p style={{ color: "#16a34a", fontSize: 12 }}>{countdown > 0 ? `Redirecting to home in ${countdown}s` : "Redirecting…"}</p>
            </div>
            <a href={WHATSAPP_LINKS[studentClass] || "/"} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#16a34a", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", marginBottom: 10 }}>💬 Open WhatsApp Group</a>
            <button onClick={() => router.push("/")} style={{ width: "100%", background: "#f3f4f6", color: "#374151", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Back to Home</button>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>Payment Failed</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Your payment could not be completed. No amount has been deducted.</p>
            <button onClick={() => router.push("/")} style={{ width: "100%", background: "#2563eb", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10 }}>Try Again</button>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>Need help? Call us at <a href="tel:9366030347" style={{ color: "#3b82f6" }}>9366030347</a></p>
          </>
        )}

        {status === "pending" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#d97706", marginBottom: 8 }}>Payment Pending</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>We couldn't confirm your payment yet. If money was deducted, it will be verified within 24 hours.</p>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400e", marginBottom: 20 }}>Transaction ID: <strong style={{ wordBreak: "break-all" }}>{txnId}</strong></div>
            <a href="https://wa.me/919366030347" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#16a34a", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", marginBottom: 10 }}>💬 Contact on WhatsApp</a>
            <button onClick={() => router.push("/")} style={{ width: "100%", background: "#f3f4f6", color: "#374151", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Back to Home</button>
          </>
        )}

      </div>
    </main>
  );
}