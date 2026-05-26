import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Yarwng Mathematics",
  description: "Refund and Cancellation Policy for Yarwng Mathematics coaching services.",
};
export default function RefundPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#1f2937" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#060f2e" }}>Refund & Cancellation Policy</h1>
      <p style={{ color: "#6b7280", marginBottom: 40 }}>Last updated: May 2026 · Yarwng Mathematics</p>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>1. Refund Processing</h2>
        <p style={{ color: "#374151" }}>Approved refunds will be processed and credited within <strong>2–5 working days</strong> to the original payment method.</p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>2. How to Request a Refund</h2>
        <p style={{ color: "#374151" }}>To request a refund, please contact us via WhatsApp or email within 7 days of payment with your enrollment details and reason for cancellation.</p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>3. Payment Method</h2>
        <p style={{ color: "#374151" }}>Payments are processed securely via Cashfree Payments. Refunds will be credited back to the same payment source (UPI, Card, Net Banking, or Wallet).</p>
      </div>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px 24px", marginTop: 40 }}>
        <p style={{ fontWeight: 700, color: "#15803d", marginBottom: 4 }}>For Refund Requests</p>
        <p style={{ color: "#374151" }}>📱 WhatsApp: 9366030347</p>
        <p style={{ color: "#374151" }}>✉️ yarwngmathematics@gmail.com</p>
        <p style={{ color: "#374151" }}>Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
      </div>
    </main>
  );
}