import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Yarwng Mathematics",
  description: "Terms and Conditions for Yarwng Mathematics coaching services.",
};

const sections = [
  {
    num: "01",
    title: "Acceptance of Terms",
    icon: "📋",
    body: "By accessing or using the website yarwngmathematics.com, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please discontinue use of our services.",
  },
  {
    num: "02",
    title: "User Conduct",
    icon: "🤝",
    body: "You agree not to engage in any activity that disrupts or interferes with the functioning of the website or its services. Respectful conduct toward instructors and fellow students is expected at all times.",
  },
  {
    num: "03",
    title: "Intellectual Property",
    icon: "🔒",
    body: "All content and materials available on the website — including class recordings, notes, and study materials — are protected by intellectual property laws and remain the exclusive property of Yarwng Mathematics.",
  },
  {
    num: "04",
    title: "Limitation of Liability",
    icon: "⚖️",
    body: "Yarwng Mathematics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the website or coaching services.",
  },
  {
    num: "05",
    title: "Indemnification",
    icon: "🛡️",
    body: "You agree to indemnify and hold Yarwng Mathematics harmless from any claims, losses, or damages arising out of your use of the website or violation of these terms.",
  },
  {
    num: "06",
    title: "Governing Law",
    icon: "🏛️",
    body: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in West Tripura.",
  },
];

export default function TermsPage() {
  return (
    <main style={{ fontFamily: "'Outfit', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        .fu { animation: fadeUp 0.6s ease both; }
        .fu1 { animation-delay: 0.1s; }
        .fu2 { animation-delay: 0.2s; }
        .fu3 { animation-delay: 0.3s; }
      `}</style>

      {/* HERO HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #060f2e 0%, #0d1b4b 50%, #0f2d6b 100%)",
        padding: "64px 24px 80px",
        clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)",
        textAlign: "center",
      }}>
        <div className="fu fu1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 100, padding: "6px 18px", marginBottom: 20,
          color: "#fcd34d", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          📋 Legal Document
        </div>
        <h1 className="fu fu2" style={{
          fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
          lineHeight: 1.1, marginBottom: 12,
        }}>
          Terms &amp; <span style={{ color: "#f59e0b", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Conditions</span>
        </h1>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Intro card */}
        <div style={{
          background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 16,
          padding: "20px 24px", marginBottom: 40, marginTop: -20,
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 2px 12px rgba(29,78,216,0.07)",
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>ℹ️</div>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
            Please read these terms carefully before enrolling in any Yarwng Mathematics class or using our website. Your enrollment constitutes acceptance of these terms.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s, i) => (
            <div key={s.num} style={{
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: 16,
              padding: "24px 28px",
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "border-color 0.2s, box-shadow 0.2s",
              animation: `fadeUp 0.5s ease both ${0.1 + i * 0.07}s`,
            }}>
              {/* Number badge */}
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 800, marginBottom: 4,
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                  {s.title}
                </h2>
                <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.75 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
          borderRadius: 20, padding: "28px 32px", marginTop: 40,
          color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>📬</span>
            <p style={{ fontWeight: 700, fontSize: 16 }}>Have Questions?</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>👨‍🏫 Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>📱 <a href="tel:9366030347" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>9366030347</a></p>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>✉️ <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>yarwngmathematics@gmail.com</a></p>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#1d4ed8", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}