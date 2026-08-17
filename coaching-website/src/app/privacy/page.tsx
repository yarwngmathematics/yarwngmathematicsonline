import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Yarwng Mathematics",
  description: "Privacy Policy for Yarwng Mathematics coaching services.",
};

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    icon: "📥",
    color: "#eff6ff",
    accent: "#1d4ed8",
    body: "We collect personal information such as your name, WhatsApp number, school details, and payment information when you enroll or register on our platform. This data is used solely to provide our services.",
  },
  {
    num: "02",
    title: "How We Use Your Information",
    icon: "⚙️",
    color: "#f0fdf4",
    accent: "#16a34a",
    body: "We use your information to process enrollments, communicate with you about class schedules and updates, send batch-related announcements via WhatsApp, and improve our coaching services.",
  },
  {
    num: "03",
    title: "Cookies",
    icon: "🍪",
    color: "#fef3c7",
    accent: "#92400e",
    body: "We use cookies to personalise content, analyse site traffic, and improve your browsing experience. You may choose to disable cookies in your browser settings, though some site features may be affected.",
  },
  {
    num: "04",
    title: "Data Security",
    icon: "🔐",
    color: "#fdf4ff",
    accent: "#7e22ce",
    body: "We take appropriate technical and organisational precautions to protect your personal information. Payment processing is handled securely by PhonePe's encrypted payment gateway — we do not store card or UPI credentials.",
  },
  {
    num: "05",
    title: "Changes to This Privacy Policy",
    icon: "🔄",
    color: "#fff7ed",
    accent: "#c2410c",
    body: "We reserve the right to update or change our Privacy Policy at any time. Any changes will be posted on this page with a revised date. Continued use of our services after changes implies acceptance.",
  },
  {
    num: "06",
    title: "Ownership",
    icon: "🏫",
    color: "#f0fdf4",
    accent: "#15803d",
    body: "This website is owned and operated by Rakesh Debbarma, M.Sc Mathematics, IIT Delhi. All policies, content, and services are managed under his direction and responsibility.",
  },
];

export default function PrivacyPage() {
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
        .policy-card:hover { border-color: #93c5fd !important; box-shadow: 0 6px 24px rgba(59,130,246,0.1) !important; transform: translateY(-2px); transition: all 0.25s; }
      `}</style>

      {/* HERO */}
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
          🔒 Legal Document
        </div>
        <h1 className="fu fu2" style={{
          fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
          lineHeight: 1.1, marginBottom: 12,
        }}>
          Privacy <span style={{ color: "#f59e0b", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Policy</span>
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
          <div style={{ fontSize: 28, flexShrink: 0 }}>🛡️</div>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it. We are committed to keeping your information safe and transparent.
          </p>
        </div>

        {/* Grid of cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {sections.map((s, i) => (
            <div key={s.num} className="policy-card" style={{
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: 16,
              padding: "22px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              animation: `fadeUp 0.5s ease both ${0.1 + i * 0.07}s`,
              cursor: "default",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: s.color, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: s.accent,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>§ {s.num}</span>
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                {s.title}
              </h2>
              <p style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Contact card */}
        <div style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
          borderRadius: 20, padding: "28px 32px", marginTop: 24,
          color: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>📬</span>
            <p style={{ fontWeight: 700, fontSize: 16 }}>Privacy Concerns? Contact Us</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>👨‍🏫 Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>📱 <a href="tel:9366030347" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>9366030347</a></p>
            <p style={{ color: "#bfdbfe", fontSize: 14 }}>✉️ <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#fcd34d", textDecoration: "none", fontWeight: 600 }}>yarwngmathematics@gmail.com</a></p>
          </div>
        </div>

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