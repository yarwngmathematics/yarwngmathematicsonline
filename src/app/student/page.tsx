"use client";

import { useState, useEffect } from "react";

export default function StudentPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0c10",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#e8e4d9",
        overflowX: "hidden",
      }}
    >
      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          height: "64px",
          background: scrolled ? "rgba(10,12,16,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <img
            src="/Logo.png"
            alt="Yarwng Mathematics Logo"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              fontSize: "1.25rem",
              letterSpacing: "0.02em",
              color: "#e8c97a",
            }}
          >
            Yarwng Mathematics
          </span>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Courses", "Live", "Notes"].map((item) => (
            <button
              key={item}
              style={{
                background: "none",
                border: "none",
                color: "#a09a8e",
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'Georgia', serif",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.color = "#e8e4d9")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.color = "#a09a8e")
              }
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          padding: "0 2.5rem",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(232,201,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,201,122,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,201,122,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "900px",
            zIndex: 1,
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              border: "1px solid rgba(232,201,122,0.3)",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
              marginBottom: "2rem",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#e8c97a",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#e8c97a",
                animation: "pulse 2s infinite",
              }}
            />
            Class 10 · 11 · 12 Now Enrolling
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "0 0 1.5rem",
              fontFamily: "'Georgia', serif",
            }}
          >
            Learn Maths
            <br />
            <em style={{ color: "#e8c97a", fontStyle: "italic" }}>
              with Clarity.
            </em>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#7a7568",
              maxWidth: "520px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontFamily: "'Georgia', serif",
            }}
          >
            Conceptual depth over rote memorisation — live sessions, handcrafted
            notes, and recorded lectures, built for CBSE boards.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              style={{
                background: "#e8c97a",
                color: "#0a0c10",
                border: "none",
                borderRadius: "6px",
                padding: "0.85rem 2.2rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
                fontFamily: "'Georgia', serif",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = "0.85")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = "1")
              }
            >
              Join Classes
            </button>
            <button
              style={{
                background: "transparent",
                color: "#e8e4d9",
                border: "1px solid rgba(232,228,217,0.25)",
                borderRadius: "6px",
                padding: "0.85rem 2.2rem",
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                fontFamily: "'Georgia', serif",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.borderColor =
                  "rgba(232,228,217,0.6)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.borderColor =
                  "rgba(232,228,217,0.25)")
              }
            >
              Explore Courses
            </button>
          </div>
        </div>

        {/* Decorative formula strip */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "3rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "clamp(0.7rem, 1vw, 0.9rem)",
            color: "rgba(232,201,122,0.12)",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            lineHeight: 2.4,
            textAlign: "right",
            userSelect: "none",
            letterSpacing: "0.04em",
          }}
        >
          {[
            "lim(x→∞) (1 + 1/x)ˣ = e",
            "∫₀^π sin(x) dx = 2",
            "∇²φ = ρ/ε₀",
            "eⁱᵖⁱ + 1 = 0",
            "det(AB) = det(A)·det(B)",
            "P(A|B) = P(B|A)·P(A)/P(B)",
          ].map((f) => (
            <div key={f}>{f}</div>
          ))}
        </div>
      </section>

      {/* ─── ANNOUNCEMENTS ─── */}
      <section
        style={{
          padding: "5rem 2.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4a4640",
            marginBottom: "3rem",
          }}
        >
          Announcements
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {[
            {
              tag: "New Batch",
              desc: "Class 12 enrollment now open for the upcoming academic session.",
              cta: "Enroll Now",
              accent: "#e8c97a",
            },
            {
              tag: "Live Classes",
              desc: "Interactive problem-solving sessions streaming every weekday.",
              cta: "Join Live",
              accent: "#7ab8e8",
            },
            {
              tag: "Free Notes",
              desc: "Handwritten PDF notes available for all chapters — no login needed.",
              cta: "Download",
              accent: "#8de87a",
            },
          ].map(({ tag, desc, cta, accent }) => (
            <AnnouncementCard
              key={tag}
              tag={tag}
              desc={desc}
              cta={cta}
              accent={accent}
            />
          ))}
        </div>
      </section>

      {/* ─── LEARNING AREA ─── */}
      <section
        style={{
          padding: "5rem 2.5rem 7rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              fontFamily: "'Georgia', serif",
              margin: 0,
            }}
          >
            Student Learning Area
          </h2>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#4a4640",
            }}
          >
            All resources in one place
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              icon: "▶",
              title: "Recorded Lectures",
              desc: "Full-length chapter videos, revisit any concept at your own pace.",
              cta: "Watch Now",
              accent: "#7ab8e8",
              index: "01",
            },
            {
              icon: "✦",
              title: "Notes",
              desc: "Premium handwritten notes with solved examples and formula sheets.",
              cta: "Open Notes",
              accent: "#e8c97a",
              index: "02",
            },
            {
              icon: "◉",
              title: "Live Classes",
              desc: "Join real-time doubt sessions and guided problem solving with peers.",
              cta: "Enter Class",
              accent: "#8de87a",
              index: "03",
            },
          ].map((card) => (
            <LearningCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src="/Logo.png"
            alt="Yarwng Mathematics Logo"
            style={{
              width: "28px",
              height: "28px",
              objectFit: "contain",
              borderRadius: "4px",
              opacity: 0.85,
            }}
          />
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: "#e8c97a",
              fontSize: "1rem",
            }}
          >
            Yarwng Mathematics
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#3a3630" }}>
          Conceptual clarity for Class 10, 11 &amp; 12
        </span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}

function AnnouncementCard({
  tag,
  desc,
  cta,
  accent,
}: {
  tag: string;
  desc: string;
  cta: string;
  accent: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.035)" : "#0d0f14",
        padding: "2.5rem 2rem",
        cursor: "default",
        transition: "background 0.25s",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: "1rem",
          fontFamily: "'Georgia', serif",
        }}
      >
        {tag}
      </p>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#7a7568",
          lineHeight: 1.65,
          marginBottom: "2rem",
          fontFamily: "'Georgia', serif",
        }}
      >
        {desc}
      </p>
      <button
        style={{
          background: "transparent",
          border: `1px solid ${accent}55`,
          color: accent,
          borderRadius: "4px",
          padding: "0.55rem 1.4rem",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          cursor: "pointer",
          fontFamily: "'Georgia', serif",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = accent + "18";
          (e.target as HTMLButtonElement).style.borderColor = accent;
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = "transparent";
          (e.target as HTMLButtonElement).style.borderColor = accent + "55";
        }}
      >
        {cta}
      </button>
    </div>
  );
}

function LearningCard({
  icon,
  title,
  desc,
  cta,
  accent,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: string;
  accent: string;
  index: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: hov ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${hov ? accent + "40" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "8px",
        padding: "2.5rem 2rem",
        transition: "all 0.3s ease",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* index watermark */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "1.2rem",
          right: "1.5rem",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.08)",
          fontFamily: "'Georgia', serif",
        }}
      >
        {index}
      </span>

      {/* icon */}
      <div
        style={{
          fontSize: "1.6rem",
          color: accent,
          marginBottom: "1.5rem",
          lineHeight: 1,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: 400,
          fontFamily: "'Georgia', serif",
          color: "#e8e4d9",
          margin: "0 0 0.75rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#5c564e",
          lineHeight: 1.65,
          marginBottom: "2.2rem",
          fontFamily: "'Georgia', serif",
        }}
      >
        {desc}
      </p>

      <button
        style={{
          background: accent,
          color: "#0a0c10",
          border: "none",
          borderRadius: "4px",
          padding: "0.6rem 1.5rem",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          cursor: "pointer",
          fontFamily: "'Georgia', serif",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.opacity = "0.8")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLButtonElement).style.opacity = "1")
        }
      >
        {cta}
      </button>
    </div>
  );
}