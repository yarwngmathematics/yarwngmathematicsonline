"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const SLOTS = {
  "Class 10": { days:"Monday & Wednesday", time:"5:00 PM – 7:00 PM", icon:"📘", color:"#1d4ed8", bg:"#eff6ff", original:700, offer:600,
    topics:["Real Numbers & Polynomials","Quadratic Equations","Arithmetic Progressions","Triangles & Coordinate Geometry","Trigonometry","Circles & Constructions","Areas & Surface Volumes","Statistics & Probability","Regular tests and doubt sessions included."] },
  "Class 11": { days:"Tuesday & Friday", time:"5:00 PM – 7:00 PM", icon:"📙", color:"#d97706", bg:"#fef3c7", original:900, offer:800,
    topics:["Sets, Relations & Functions","Trigonometric Functions","Principle of Mathematical Induction","Complex Numbers","Linear Inequalities & Permutations","Binomial Theorem & Sequences","Straight Lines & Conic Sections","3D Geometry Intro","Calculus Basics — Limits & Derivatives","Statistics & Probability","Strong foundation for Class 12 and competitive exams."] },
  "Class 12": { days:"Thursday & Saturday", time:"5:00 PM – 7:00 PM", icon:"📗", color:"#16a34a", bg:"#f0fdf4", original:1000, offer:900,
    topics:["Relations & Functions","Inverse Trigonometric Functions","Matrices & Determinants","Continuity & Differentiability","Applications of Derivatives","Integrals & Applications","Differential Equations","Vectors & 3D Geometry","Linear Programming","Probability","Board exam focused — previous year paper practice included."] },
};

export default function ClassesPage() {
  const [open, setOpen] = useState<string|null>(null);

  return (
    <main style={{ fontFamily:"'Outfit',sans-serif", background:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp 0.6s ease both 0.1s}.fu2{animation:fadeUp 0.6s ease both 0.2s}.fu3{animation:fadeUp 0.6s ease both 0.35s}

        .cls-hero{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 50%,#0f2d6b 100%);padding:80px 20px 100px;clip-path:polygon(0 0,100% 0,100% 92%,0 100%);text-align:center}
        .cls-hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);border-radius:100px;padding:6px 16px;margin-bottom:20px;color:#fcd34d;font-size:12px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase}
        .cls-hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,5vw,3.6rem);font-weight:700;color:#fff;line-height:1.12;margin-bottom:14px}
        .cls-hero h1 span{color:#f59e0b}
        .cls-hero p{color:#bfdbfe;font-size:16px;max-width:580px;margin:0 auto;line-height:1.75}
        .cls-hero-pills{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px}
        .cls-pill{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:7px 16px;color:#fff;font-size:13px;font-weight:500}

        .cls-grid-section{max-width:1100px;margin:0 auto;padding:80px 20px}
        .sec-head{text-align:center;margin-bottom:52px}
        .sec-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:12px}
        .sec-h2{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.4vw,2.6rem);font-weight:700;color:#111827;margin-bottom:10px}
        .sec-line{width:48px;height:3px;border-radius:2px;margin:0 auto;position:relative}
        .sec-line::after{content:'';position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:inherit;transform:translate(14px,-50%)}

        .cls-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:60px}
        .cls-card{border-radius:14px;overflow:hidden;border:2px solid #e5e7eb;transition:all 0.25s;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .cls-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.1)}
        .cls-card-head{padding:28px 24px 20px;text-align:center}
        .cls-card-icon{font-size:44px;margin-bottom:10px}
        .cls-card-name{font-size:24px;font-weight:800;margin-bottom:4px}
        .cls-card-days{font-size:13px;opacity:0.7;margin-bottom:2px}
        .cls-card-time{font-size:12px;opacity:0.6;margin-bottom:0}
        .cls-card-body{background:#fff;padding:20px 24px 24px}
        .cls-card-price-row{display:flex;align-items:baseline;gap:6px;margin-bottom:6px}
        .cls-card-price{font-size:32px;font-weight:800;color:#1d4ed8}
        .cls-card-price-unit{font-size:13px;color:#9ca3af}
        .cls-card-original{font-size:13px;color:#9ca3af;text-decoration:line-through;margin-bottom:16px}
        .cls-card-btn{width:100%;padding:13px;border-radius:12px;font-weight:700;font-size:14px;border:none;cursor:pointer;transition:all 0.2s;color:#fff}
        .cls-card-btn:hover{opacity:0.9;transform:translateY(-1px)}
        .cls-card-featured-badge{display:inline-block;background:rgba(255,255,255,0.2);color:#fff;font-size:11px;font-weight:700;padding:3px 12px;border-radius:100px;margin-bottom:10px}
        @media(max-width:760px){.cls-cards{grid-template-columns:1fr;max-width:400px;margin-left:auto;margin-right:auto}}
        @media(min-width:560px) and (max-width:760px){.cls-cards{grid-template-columns:repeat(2,1fr);max-width:100%}}

        .cls-accordion{max-width:720px;margin:0 auto}
        .acc-item{border:1.5px solid #e5e7eb;border-radius:16px;margin-bottom:10px;overflow:hidden;transition:border-color 0.2s}
        .acc-item.open{border-color:#93c5fd}
        .acc-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#fff;border:none;cursor:pointer;font-size:15px;font-weight:700;color:#111827;font-family:'Outfit',sans-serif;transition:background 0.2s}
        .acc-btn:hover{background:#f9fafb}
        .acc-icon{font-size:20px;margin-right:10px}
        .acc-chevron{font-size:18px;transition:transform 0.3s;color:#6b7280}
        .acc-body{padding:20px 24px 24px;background:#f9fafb;border-top:1px solid #e5e7eb}
        .acc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .acc-info-item{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px}
        .acc-info-label{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em}
        .acc-info-val{font-size:13px;font-weight:700;color:#111827;margin-top:1px}
        .acc-topics{display:flex;flex-direction:column;gap:6px}
        .acc-topic{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#374151;line-height:1.5}
        .acc-topic-dot{color:#2563eb;font-size:15px;line-height:1.4;flex-shrink:0}
        @media(max-width:560px){.acc-grid{grid-template-columns:1fr}}

        .cls-info{background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border:1px solid #bae6fd;border-radius:24px;padding:40px;margin-bottom:60px;display:flex;gap:40px;align-items:center;flex-wrap:wrap}
        .cls-info-icon{font-size:52px;flex-shrink:0}
        .cls-info-text h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#0c4a6e;margin-bottom:8px}
        .cls-info-text p{color:#0369a1;font-size:14px;line-height:1.7}
        .cls-info-items{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px}
        .cls-info-badge{background:#fff;border:1px solid #bae6fd;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;color:#0369a1}

        .cls-cta{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%);padding:80px 20px;text-align:center}
        .cls-cta h2{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.4vw,2.6rem);font-weight:700;color:#fff;margin-bottom:12px}
        .cls-cta p{color:#bfdbfe;font-size:15px;margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7}
        .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .btn-gold{background:#f59e0b;color:#1a0a00;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-gold:hover{background:#fcd34d;transform:translateY(-1px)}
        .btn-ghost{background:rgba(255,255,255,0.07);color:#fff;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.2s}
        .btn-ghost:hover{background:rgba(255,255,255,0.12)}
        .ym-footer{background:#030a1f;color:rgba(255,255,255,0.5);padding:30px 20px;text-align:center;font-size:12px;border-top:3px solid #f59e0b}
        .ym-footer a{color:#93c5fd;text-decoration:none}
        .ym-footer a:hover{color:#fcd34d}
      `}</style>

      <Navbar enrollHref="/" />

      {/* HERO */}
      <section className="cls-hero">
        <div className="cls-hero-tag fu1">📚 All Classes</div>
        <h1 className="fu2">Our <span>Mathematics Classes</span></h1>
        <p className="fu3">Structured, live online sessions via Google Meet for Classes 10, 11 & 12. Each batch has a fixed timetable and dedicated WhatsApp support.</p>
        <div className="cls-hero-pills fu3">
          {["🟢 Online via Google Meet","📅 Starts 15th June 2026","⏰ 2 Hours per Session","💬 WhatsApp Support Included","🔒 Limited Seats"].map(p=>(
            <span key={p} className="cls-pill">{p}</span>
          ))}
        </div>
      </section>

      {/* CARDS + ACCORDION */}
      <section className="cls-grid-section">
        <div className="sec-head fu1">
          <div className="sec-tag" style={{ background:"#dcfce7", color:"#15803d" }}>🟢 Online Classes</div>
          <h2 className="sec-h2">Choose Your Class</h2>
          <div className="sec-line" style={{ background:"#22c55e" }} />
        </div>

        {/* Class Cards */}
        <div className="cls-cards">
          {Object.entries(SLOTS).map(([cls, s], idx)=>(
            <div key={cls} className="cls-card" style={{ borderColor: idx===1 ? s.color : "#e5e7eb" }}>
              <div className="cls-card-head" style={{ background:`linear-gradient(135deg, ${s.color} 0%, ${s.color}cc 100%)` }}>
                {idx===1 && <div className="cls-card-featured-badge">⭐ Most Popular</div>}
                <div className="cls-card-icon">{s.icon}</div>
                <h3 className="cls-card-name" style={{ color:"#fff" }}>{cls}</h3>
                <p className="cls-card-days" style={{ color:"rgba(255,255,255,0.85)" }}>{s.days}</p>
                <p className="cls-card-time" style={{ color:"rgba(255,255,255,0.7)" }}>{s.time}</p>
              </div>
              <div className="cls-card-body">
                <div className="cls-card-price-row">
                  <span className="cls-card-price">₹{s.offer}</span>
                  <span className="cls-card-price-unit">/month</span>
                </div>
                <p className="cls-card-original">Regular: ₹{s.original}/month</p>
                <Link href="/" className="cls-card-btn" style={{ background:s.color, display:"block", textAlign:"center", textDecoration:"none" }}>
                  Join {cls} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div className="cls-info fu2">
          <span className="cls-info-icon">🎯</span>
          <div className="cls-info-text">
            <h3>Everything Included in Every Class</h3>
            <p>No hidden fees. Your monthly fee covers everything you need to excel.</p>
            <div className="cls-info-items">
              {["Live Google Meet Sessions","WhatsApp Doubt Support","Regular Tests & Quizzes","Detailed Feedback","Study Material","Previous Year Papers"].map(i=>(
                <span key={i} className="cls-info-badge">✅ {i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion Details */}
        <div className="sec-head fu1">
          <div className="sec-tag" style={{ background:"#dbeafe", color:"#1d4ed8" }}>📋 Detailed Syllabus</div>
          <h2 className="sec-h2">What You'll Learn</h2>
          <div className="sec-line" style={{ background:"#2563eb" }} />
        </div>

        <div className="cls-accordion">
          {Object.entries(SLOTS).map(([cls, s])=>(
            <div key={cls} className={`acc-item${open===cls?" open":""}`}>
              <button className="acc-btn" onClick={()=>setOpen(open===cls?null:cls)}>
                <span><span className="acc-icon">{s.icon}</span>{cls} — {s.days}</span>
                <span className="acc-chevron" style={{ transform:open===cls?"rotate(180deg)":"none" }}>▼</span>
              </button>
              {open===cls&&(
                <div className="acc-body">
                  <div className="acc-grid">
                    <div className="acc-info-item">
                      <span style={{ fontSize:20 }}>📅</span>
                      <div><p className="acc-info-label">Days</p><p className="acc-info-val">{s.days}</p></div>
                    </div>
                    <div className="acc-info-item">
                      <span style={{ fontSize:20 }}>🕐</span>
                      <div><p className="acc-info-label">Time</p><p className="acc-info-val">{s.time}</p></div>
                    </div>
                    <div className="acc-info-item">
                      <span style={{ fontSize:20 }}>💰</span>
                      <div><p className="acc-info-label">Fee</p><p className="acc-info-val">₹{s.offer}/month</p></div>
                    </div>
                    <div className="acc-info-item">
                      <span style={{ fontSize:20 }}>🖥️</span>
                      <div><p className="acc-info-label">Mode</p><p className="acc-info-val">Google Meet</p></div>
                    </div>
                  </div>
                  <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Topics Covered</p>
                  <div className="acc-topics">
                    {s.topics.map((t,i)=>(
                      <div key={i} className="acc-topic">
                        <span className="acc-topic-dot">›</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/" style={{ display:"inline-flex", alignItems:"center", marginTop:18, background:s.color, color:"#fff", padding:"11px 22px", borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none", transition:"all 0.2s" }}>
                    Enroll in {cls} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cls-cta">
        <h2>Ready to Enroll?</h2>
        <p>Classes start 15th June 2026. Seats are limited per batch. Register now to secure your spot.</p>
        <div className="cta-btns">
          <Link href="/" className="btn-gold">🚀 Enroll Now →</Link>
          <Link href="/contact" className="btn-ghost">Contact Us</Link>
        </div>
      </section>

      <footer className="ym-footer">
        <p>© {new Date().getFullYear()} Yarwng Mathematics · <a href="/">Home</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
      </footer>
    </main>
  );
}