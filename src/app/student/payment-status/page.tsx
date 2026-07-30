"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PortalPaymentStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const txnId = params.get("txnId") || "";
  const [status, setStatus] = useState<"checking" | "success" | "failed" | "pending">("checking");

  useEffect(() => {
    if (!txnId) { setStatus("failed"); return; }
    const verify = async () => {
      try {
        const res = await fetch(`/api/portal/verify-order?txnId=${encodeURIComponent(txnId)}`);
        const data = await res.json();
        if (data.code === "PAYMENT_SUCCESS" || data.status === "COMPLETED") setStatus("success");
        else if (data.code === "PAYMENT_DECLINED" || data.status === "FAILED") setStatus("failed");
        else setStatus("pending");
      } catch {
        setStatus("pending");
      }
    };
    verify();
  }, [txnId]);

  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
      {status === "checking" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#111827" }}>Verifying Payment…</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Please wait a moment.</p>
        </>
      )}
      {status === "success" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#15803d", marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            Your account has been updated. Notes and live class access are now unlocked.
          </p>
          <button onClick={() => router.push("/student")} style={{ width: "100%", background: "#2563eb", color: "#fff", padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
            Go to My Portal →
          </button>
        </>
      )}
      {status === "failed" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>Payment Failed</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>No amount has been deducted. You can try again from your portal.</p>
          <button onClick={() => router.push("/student")} style={{ width: "100%", background: "#2563eb", color: "#fff", padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
            Back to Portal
          </button>
        </>
      )}
      {status === "pending" && (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#d97706", marginBottom: 8 }}>Payment Pending</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            If money was deducted, it will reflect within 24 hours. Contact us if it doesn't.
          </p>
          <a href="https://wa.me/919366030347" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#16a34a", color: "#fff", padding: 14, borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", marginBottom: 10 }}>
            💬 Contact on WhatsApp
          </a>
          <button onClick={() => router.push("/student")} style={{ width: "100%", background: "#f3f4f6", color: "#374151", padding: 12, borderRadius: 12, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>
            Back to Portal
          </button>
        </>
      )}
    </div>
  );
}

export default function PortalPaymentStatusPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#060f2e,#0d1b4b)", fontFamily: "'Outfit',sans-serif", padding: 20 }}>
      <Suspense fallback={<div style={{ color: "#fff" }}>Loading…</div>}>
        <PortalPaymentStatus />
      </Suspense>
    </main>
  );
}