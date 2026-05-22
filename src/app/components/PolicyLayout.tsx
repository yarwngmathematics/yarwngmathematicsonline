"use client";

import Link from "next/link";

interface Section {
  title: string;
  items: string[];
}

interface PolicyLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  intro: string;
  sections: Section[];
  contactNote?: string;
}

export default function PolicyLayout({
  badge,
  title,
  subtitle,
  effectiveDate,
  intro,
  sections,
  contactNote,
}: PolicyLayoutProps) {
  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f9fc", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .ym-display { font-family: 'Playfair Display', Georgia, serif; }

        .ym-nav {
          background: rgba(10,15,46,0.96);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .policy-hero {
          background: linear-gradient(135deg, #0a0f2e 0%, #0d1b4b 40%, #0f2d6b 70%, #0d1b4b 100%);
          padding: 60px 16px 80px;
          position: relative;
          overflow: hidden;
        }

        .policy-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: #f8f9fc;
          clip-path: ellipse(55% 100% at 50% 100%);
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fbbf24;
          margin-bottom: 20px;
        }

        .policy-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e8eaf0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          padding: 36px 40px;
          margin-bottom: 20px;
          transition: box-shadow 0.2s;
        }

        .policy-card:hover {
          box-shadow: 0 4px 28px rgba(13,27,75,0.10);
        }

        .section-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
          margin-right: 12px;
        }

        .section-title {
          font-size: 17px;
          font-weight: 700;
          color: #0d1b4b;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .policy-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f0f2f8;
          font-size: 14px;
          line-height: 1.65;
          color: #4a5568;
        }

        .policy-item:last-child { border-bottom: none; }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2563eb;
          flex-shrink: 0;
          margin-top: 8px;
        }

        .nav-links {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .nav-link {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #93c5fd;
          border-radius: 8px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .nav-link:hover { background: rgba(255,255,255,0.15); color: #fff; }

        .contact-box {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 24px 32px;
          margin-top: 8px;
        }

        @media (max-width: 640px) {
          .policy-card { padding: 24px 20px; }
          .contact-box { padding: 20px 16px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="ym-nav">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/Logo.png" alt="Logo" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }} />
            <div>
              <div className="ym-display" style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Yarwng Mathematics</div>
              <div style={{ color: "#93c5fd", fontSize: 11 }}>Rakesh Debbarma · IIT Delhi</div>
            </div>
          </Link>
          <div className="nav-links">
            <Link href="/terms" className="nav-link">Terms</Link>
            <Link href="/privacy" className="nav-link">Privacy</Link>
            <Link href="/refund" className="nav-link">Refund</Link>
            <Link href="/" style={{ background: "#facc15", color: "#1e3a8a", border: "none", borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>← Home</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="policy-hero">
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="hero-glow" style={{ top: -60, right: -80, width: 300, height: 300, background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />
          <div className="hero-glow" style={{ bottom: 20, left: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)" }} />
          <div className="badge">📄 {badge}</div>
          <h1 className="ym-display" style={{ color: "#fff", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}>{title}</h1>
          <p style={{ color: "#93c5fd", fontSize: 15, marginBottom: 8 }}>{subtitle}</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600 }}>Effective Date: {effectiveDate}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* Intro card */}
        <div className="policy-card" style={{ background: "linear-gradient(135deg,#0d1b4b,#1e3a8a)", border: "none", marginBottom: 28 }}>
          <p style={{ color: "#bfdbfe", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{intro}</p>
        </div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="policy-card">
            <div className="section-title">
              <span className="section-number">{idx + 1}</span>
              {section.title}
            </div>
            {section.items.map((item, i) => (
              <div key={i} className="policy-item">
                <span className="bullet-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Contact note */}
        {contactNote && (
          <div className="contact-box">
            <p style={{ fontWeight: 700, color: "#1e3a8a", marginBottom: 8, fontSize: 14 }}>📬 Contact Us</p>
            <p style={{ color: "#3b5bdb", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{contactNote}</p>
            <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 13 }}>✉️ yarwngmathematics@gmail.com</a>
              <a href="tel:9366030347" style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 13 }}>📱 9366030347</a>
            </div>
          </div>
        )}

        {/* Footer note */}
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 32 }}>
          © {new Date().getFullYear()} Yarwng Mathematics · Khumulwng, Tripura ·{" "}
          <Link href="/" style={{ color: "#2563eb" }}>Back to Home</Link>
        </p>
      </div>
    </main>
  );
}