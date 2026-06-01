"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ fontFamily: "'Outfit', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fu1{animation:fadeUp 0.6s ease both 0.1s} .fu2{animation:fadeUp 0.6s ease both 0.2s} .fu3{animation:fadeUp 0.6s ease both 0.35s} .fu4{animation:fadeUp 0.6s ease both 0.5s}

        /* HERO */
        .about-hero { background: linear-gradient(135deg, #060f2e 0%, #0d1b4b 50%, #0f2d6b 100%); padding: 80px 20px 100px; clip-path: polygon(0 0,100% 0,100% 92%,0 100%); }
        .about-hero-inner { max-width: 900px; margin: 0 auto; text-align: center; }
        .about-tag { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); border-radius: 100px; padding: 6px 16px; margin-bottom: 20px; color: #fcd34d; font-size: 12px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; }
        .about-h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 16px; }
        .about-h1 span { color: #f59e0b; font-family: 'Cormorant Garamond', serif; font-style: italic; }
        .about-tagline { color: rgba(253,211,77,0.8); font-style: italic; font-size: 15px; margin-bottom: 18px; }
        .about-desc { color: #bfdbfe; font-size: 16px; line-height: 1.75; max-width: 620px; margin: 0 auto; }

        /* STORY */
        .about-story { max-width: 1100px; margin: 0 auto; padding: 80px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .story-photo { position: relative; }
        .story-photo-card { background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%); border-radius: 24px; padding: 40px 32px; text-align: center; box-shadow: 0 20px 60px rgba(29,78,216,0.3); }
        .story-avatar { width: 88px; height: 88px; border-radius: 20px; background: #f59e0b; color: #1a0a00; font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
        .story-name { color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
        .story-degree { color: #bfdbfe; font-size: 14px; margin-bottom: 3px; }
        .story-iit { color: #f59e0b; font-size: 14px; font-weight: 700; margin-bottom: 24px; }
        .story-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .story-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 12px; color: #fff; font-size: 12px; font-weight: 500; }
        .story-badge { position: absolute; bottom: -16px; right: -16px; background: #f59e0b; color: #1a0a00; border-radius: 14px; padding: 10px 16px; font-size: 12px; font-weight: 800; box-shadow: 0 4px 16px rgba(245,158,11,0.4); }
        .story-text h2 { font-size: clamp(1.6rem,3vw,2.3rem); font-weight: 800; color: #111827; margin-bottom: 16px; }
        .story-text h2 span { color: #1d4ed8; }
        .story-text p { color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 16px; }
        .story-text blockquote { border-left: 4px solid #f59e0b; padding: 12px 20px; background: #fef3c7; border-radius: 0 12px 12px 0; margin: 24px 0; }
        .story-text blockquote p { color: #92400e; font-style: italic; font-size: 15px; margin: 0; }
        @media(max-width:760px){.about-story{grid-template-columns:1fr;gap:40px}.story-badge{bottom:-12px;right:0}}

        /* VALUES */
        .about-values { background: linear-gradient(180deg,#f9fafb 0%,#fff 100%); padding: 80px 20px; }
        .about-values-inner { max-width: 1100px; margin: 0 auto; }
        .sec-head { text-align: center; margin-bottom: 48px; }
        .sec-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 12px; background: #dbeafe; color: #1d4ed8; }
        .sec-h2 { font-size: clamp(1.6rem,3vw,2.3rem); font-weight: 800; color: #111827; margin-bottom: 10px; }
        .sec-line { width: 48px; height: 4px; border-radius: 2px; margin: 0 auto; }
        .values-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .value-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 28px 24px; transition: all 0.25s; }
        .value-card:hover { border-color: #93c5fd; box-shadow: 0 8px 32px rgba(59,130,246,0.1); transform: translateY(-4px); }
        .value-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
        .value-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .value-desc { color: #6b7280; font-size: 14px; line-height: 1.7; }
        @media(max-width:760px){.values-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.values-grid{grid-template-columns:1fr}}

        /* JOURNEY */
        .about-journey { padding: 80px 20px; background: #fff; }
        .about-journey-inner { max-width: 700px; margin: 0 auto; }
        .timeline { position: relative; padding-left: 32px; }
        .timeline::before { content:''; position:absolute; left:10px; top:0; bottom:0; width:2px; background: linear-gradient(to bottom,#1d4ed8,#f59e0b); border-radius:1px; }
        .tl-item { position: relative; margin-bottom: 36px; }
        .tl-dot { position: absolute; left: -26px; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: #1d4ed8; border: 3px solid #fff; box-shadow: 0 0 0 3px #1d4ed8; }
        .tl-year { font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .tl-title { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 5px; }
        .tl-desc { font-size: 14px; color: #6b7280; line-height: 1.65; }

        /* CTA */
        .about-cta { background: linear-gradient(135deg, #060f2e 0%, #0d1b4b 60%, #0f2d6b 100%); padding: 80px 20px; text-align: center; }
        .about-cta-inner { max-width: 600px; margin: 0 auto; }
        .about-cta h2 { font-size: clamp(1.6rem,3vw,2.3rem); font-weight: 800; color: #fff; margin-bottom: 12px; }
        .about-cta p { color: #bfdbfe; font-size: 15px; margin-bottom: 28px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-gold { background: #f59e0b; color: #1a0a00; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; }
        .btn-gold:hover { background: #fcd34d; transform: translateY(-1px); }
        .btn-ghost { background: rgba(255,255,255,0.07); color: #fff; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); }

        /* FOOTER */
        .ym-footer { background: #030a1f; color: rgba(255,255,255,0.5); padding: 32px 20px; text-align: center; font-size: 12px; }
        .ym-footer a { color: #93c5fd; text-decoration: none; }
      `}</style>

      <Navbar enrollHref="/" />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-tag fu1">🎓 Our Story</div>
          <h1 className="about-h1 fu2">
            About <span>Yarwng Mathematics</span>
          </h1>
          <p className="about-desc fu4">
            Founded with a mission to make world-class mathematics education accessible to every student in Tripura and beyond — taught by an IIT Delhi alumnus.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section style={{ background: "#fff" }}>
        <div className="about-story">
          <div className="story-photo fu2">
            <div className="story-photo-card">
              <div className="story-avatar">RD</div>
              <p className="story-name">Rakesh Debbarma</p>
              <p className="story-degree">M.Sc Mathematics</p>
              <p className="story-iit">IIT Delhi</p>
              <div className="story-chips">
                {["ODE","Numerical optimization","Linear Algebra","Statistics","Topology"].map(c=>(
                  <span key={c} className="story-chip">{c}</span>
                ))}
              </div>
            </div>
            <div className="story-badge">🎓 IIT Delhi Graduate</div>
          </div>

          <div className="story-text fu3">
            <h2>The Person Behind <span>Yarwng Mathematics</span></h2>
            <p>
              Rakesh Debbarma is a proud alumnus of the <strong>Indian Institute of Technology (IIT) Delhi</strong>, where he completed his Master of Science in Mathematics — one of the most rigorous academic programs in the country.
            </p>
            <p>
              Growing up in Tripura, Rakesh witnessed firsthand how limited access to quality mathematics coaching held back talented students. This personal experience became the driving force behind founding <strong>Yarwng Mathematics</strong>.
            </p>
            <blockquote>
              <p>"Amani Kok Kokborok bai Swrwngwi Mannai" — Every student deserves to experience the joy of truly understanding mathematics.</p>
            </blockquote>
            <p>
              Today, Yarwng Mathematics serves students in Classes 10, 11 and 12 through structured online sessions via Google Meet, with offline classes in Khumulwng launching soon.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-values-inner">
          <div className="sec-head fu1">
            <div className="sec-tag">⭐ What We Stand For</div>
            <h2 className="sec-h2">Our Core Values</h2>
            <div className="sec-line" style={{ background: "#1d4ed8" }} />
          </div>
          <div className="values-grid">
            {[
              { icon:"🧠", bg:"#eff6ff", title:"Conceptual First", desc:"We teach the 'why' before the 'how'. Deep understanding beats rote memorisation every time." },
              { icon:"🎯", bg:"#f0fdf4", title:"Result Oriented", desc:"Every session is designed with one goal: your board exam and competitive exam success." },
              { icon:"💬", bg:"#fef3c7", title:"Always Accessible", desc:"Doubt-clearing never stops. WhatsApp support ensures no question goes unanswered." },
              { icon:"🏆", bg:"#fdf2f8", title:"Excellence Standard", desc:"IIT-level rigour applied to school curriculum — we don't settle for 'good enough'." },
              { icon:"❤️", bg:"#fff1f2", title:"Student-Centred", desc:"Every student learns differently. We adapt our approach to ensure each one progresses." },
              { icon:"🌱", bg:"#f0fdf4", title:"Long-term Growth", desc:"We build foundations that last — skills that help in college, career, and life beyond exams." },
            ].map(v=>(
              <div key={v.title} className="value-card">
                <div className="value-icon" style={{ background: v.bg }}>{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="about-journey">
        <div className="about-journey-inner">
          <div className="sec-head fu1">
            <div className="sec-tag" style={{ background:"#fef3c7", color:"#92400e" }}>📅 Our Journey</div>
            <h2 className="sec-h2">How We Got Here</h2>
            <div className="sec-line" style={{ background:"#f59e0b" }} />
          </div>
          <div className="timeline">
            {[
              { year:"2024–2026", title:"IIT Delhi — M.Sc Mathematics", desc:"Rakesh completed his Master's in Mathematics from one of India's premier institutions, building deep expertise in pure and applied mathematics." },
              { year:"2019–2026", title:"Teaching & Research", desc:"Years of teaching experience working with students across different levels, refining a unique conceptual approach to mathematics education." },
              { year:"2026", title:"Yarwng Mathematics Founded", desc:"With a clear vision to democratise quality math education in Northeast India, Yarwng Mathematics was established in Khumulwng, Tripura." },
              { year:"June 2026", title:"Online Classes Launch", desc:"Expanding reach across India via Google Meet — Classes 10, 11 & 12 with structured weekly sessions and WhatsApp support groups." },
              { year:"Coming Soon", title:"Offline Classroom", desc:"A physical learning centre in Khumulwng to serve local students with face-to-face, personalised attention." },
            ].map(t=>(
              <div key={t.year} className="tl-item">
                <div className="tl-dot" />
                <p className="tl-year">{t.year}</p>
                <p className="tl-title">{t.title}</p>
                <p className="tl-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to Start Learning?</h2>
          <p>Classes start 15th June 2026. Limited seats per batch. Join Yarwng Mathematics and experience the difference that real conceptual teaching makes.</p>
          <div className="cta-btns">
            <Link href="/" className="btn-gold">🚀 Enroll Now →</Link>
            <Link href="/classes" className="btn-ghost">View Classes</Link>
          </div>
        </div>
      </section>

      <footer className="ym-footer">
        <p>© {new Date().getFullYear()} Yarwng Mathematics · Rakesh Debbarma, M.Sc IIT Delhi · <a href="/">Home</a></p>
      </footer>
    </main>
  );
}