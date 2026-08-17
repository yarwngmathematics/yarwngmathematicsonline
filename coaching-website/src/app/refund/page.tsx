import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Yarwng Mathematics",
  description: "Refund and Cancellation Policy for Yarwng Mathematics coaching services.",
};

export default function RefundPage() {
  return (
    <main style={{ fontFamily: "'Outfit', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fadeUp 0.6s ease both; }
        .fu1 { animation-delay: 0.1s; }
        .fu2 { animation-delay: 0.2s; }
        .fu3 { animation-delay: 0.3s; }
        .step-card { transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
        .step-card:hover { border-color: #6ee7b7 !important; box-shadow: 0 6px 24px rgba(16,163,74,0.1) !important; transform: translateY(-2px); }
      `}</style>

      {/* HERO — green tinted for refund context */}
      <div style={{
        background: "linear-gradient(135deg, #060f2e 0%, #0d1b4b 40%, #064e3b 100%)",
        padding: "64px 24px 80px",
        clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
        textAlign: "center",
      }}>
        <div className="fu fu1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 100, padding: "6px 18px", marginBottom: 20,
          color: "#6ee7b7", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          💸 Legal Document
        </div>
        <h1 className="fu fu2" style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
          lineHeight: 1.1, marginBottom: 12,
        }}>
          Refund &amp; <span style={{ color: "#f59e0b", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Cancellation</span> Policy
        </h1>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Quick summary banner */}
        <div style={{
          background: "#fff", border: "1.5px solid #d1fae5", borderRadius: 16,
          padding: "20px 24px", marginBottom: 40, marginTop: -20,
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 2px 12px rgba(16,163,74,0.08)",
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>✅</div>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
            We strive for your satisfaction. If you are unhappy with our service, contact us within <strong>7 days of payment</strong> and we will process your refund fairly and promptly.
          </p>
        </div>

        {/* 3-step process */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20, textAlign: "center" }}>
            How the Refund Process Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              { step: "1", icon: "📩", label: "Contact Us", desc: "Reach out via WhatsApp or email within 7 days of payment" },
              { step: "2", icon: "🔍", label: "We Review", desc: "We verify your enrollment details and reason for cancellation" },
              { step: "3", icon: "💳", label: "Refund Sent", desc: "Approved refunds credited in 2–5 working days to original method" },
            ].map((item, i) => (
              <div key={item.step} className="step-card" style={{
                background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16,
                padding: "22px 18px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                animation: `fadeUp 0.5s ease both ${0.1 + i * 0.1}s`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #059669, #065f46)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 16,
                  margin: "0 auto 10px",
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontWeight: 700, color: "#111827", fontSize: 14, marginBottom: 6 }}>{item.label}</p>
                <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              num: "01", icon: "⏱️", title: "Refund Processing Time",
              body: "Approved refunds will be processed and credited within 2–5 working days to the original payment method used at the time of enrollment.",
              highlight: "2–5 working days",
            },
            {
              num: "02", icon: "📝", title: "How to Request a Refund",
              body: "To request a refund, contact us via WhatsApp or email within 7 days of payment. Please include your enrollment details, registered name, and reason for cancellation.",
              highlight: "Within 7 days of payment",
            },
            {
              num: "03", icon: "💳", title: "Payment Method & Refund Source",
              body: "Payments are processed securely via PhonePe. Refunds will be credited back to the same payment source — UPI, Card, Net Banking, or Wallet — that was used for the original transaction.",
              highlight: "Same payment source",
            },
          ].map((s, i) => (
            <div key={s.num} style={{
              background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16,
              padding: "22px 26px", display: "flex", gap: 18, alignItems: "flex-start",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              animation: `fadeUp 0.5s ease both ${0.3 + i * 0.08}s`,
            }}>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #059669, #065f46)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 800, marginBottom: 4,
                }}>
                  {s.num}
                </div>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{s.title}</h2>
                <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.75, marginBottom: 10 }}>{s.body}</p>
                <span style={{
                  display: "inline-block", background: "#d1fae5", color: "#065f46",
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                }}>
                  ✓ {s.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Contact card — green for refund page */}
        <div style={{
          background: "linear-gradient(135deg, #059669 0%, #065f46 100%)",
          borderRadius: 20, padding: "28px 32px", marginTop: 32, color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <p style={{ fontWeight: 700, fontSize: 16 }}>Request a Refund</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ color: "#a7f3d0", fontSize: 14 }}>👨‍🏫 Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
            <p style={{ color: "#a7f3d0", fontSize: 14 }}>
              📱 WhatsApp: <a href="https://wa.me/919366030347" target="_blank" rel="noopener noreferrer" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>9366030347</a>
            </p>
            <p style={{ color: "#a7f3d0", fontSize: 14 }}>
              ✉️ <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>yarwngmathematics@gmail.com</a>
            </p>
          </div>
          <div style={{
            marginTop: 18, background: "rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "10px 14px", fontSize: 12, color: "#d1fae5",
          }}>
            💡 Tip: WhatsApp gets the fastest response. Include your enrolled name and class when reaching out.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#059669", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}