"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function WhyUsPage() {
  return (
    <main style={{ fontFamily:"'Outfit',sans-serif", background:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp 0.6s ease both 0.1s}.fu2{animation:fadeUp 0.6s ease both 0.2s}.fu3{animation:fadeUp 0.6s ease both 0.35s}

        .why-hero{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 50%,#0f2d6b 100%);padding:80px 20px 100px;clip-path:polygon(0 0,100% 0,100% 92%,0 100%);text-align:center}
        .why-hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);border-radius:100px;padding:6px 16px;margin-bottom:20px;color:#fcd34d;font-size:12px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase}
        .why-hero h1{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:14px}
        .why-hero h1 span{color:#f59e0b}
        .why-hero p{color:#bfdbfe;font-size:16px;max-width:580px;margin:0 auto;line-height:1.75}

        .why-features{max-width:1100px;margin:0 auto;padding:80px 20px}
        .sec-head{text-align:center;margin-bottom:52px}
        .sec-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:12px}
        .sec-h2{font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;color:#111827;margin-bottom:10px}
        .sec-line{width:48px;height:4px;border-radius:2px;margin:0 auto}

        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:72px}
        .feat-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:20px;padding:28px;transition:all 0.25s}
        .feat-card:hover{border-color:#93c5fd;box-shadow:0 8px 32px rgba(59,130,246,0.1);transform:translateY(-4px)}
        .feat-icon-wrap{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px}
        .feat-title{font-size:17px;font-weight:700;color:#111827;margin-bottom:8px}
        .feat-desc{color:#6b7280;font-size:14px;line-height:1.7}
        @media(max-width:760px){.feat-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.feat-grid{grid-template-columns:1fr}}

        /* COMPARISON TABLE */
        .compare-section{background:linear-gradient(180deg,#f9fafb 0%,#fff 100%);padding:80px 20px}
        .compare-inner{max-width:800px;margin:0 auto}
        .compare-table{width:100%;border-collapse:separate;border-spacing:0;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
        .compare-table th{padding:16px 20px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em}
        .compare-table th:first-child{background:#f3f4f6;color:#6b7280;text-align:left}
        .compare-table th.ym{background:#1d4ed8;color:#fff;text-align:center}
        .compare-table th.others{background:#6b7280;color:#fff;text-align:center}
        .compare-table td{padding:14px 20px;font-size:14px;border-top:1px solid #f3f4f6}
        .compare-table td:first-child{color:#374151;font-weight:500;background:#fafafa}
        .compare-table td.ym{text-align:center;background:#eff6ff;color:#1d4ed8;font-weight:700}
        .compare-table td.others{text-align:center;color:#9ca3af}
        .check{color:#16a34a;font-size:16px}
        .cross{color:#dc2626;font-size:16px}
        @media(max-width:560px){.compare-table{font-size:12px}.compare-table td,.compare-table th{padding:10px 12px}}

        /* STATS */
        .stats-section{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%);padding:72px 20px}
        .stats-inner{max-width:1100px;margin:0 auto}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .stat-card{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:28px;text-align:center}
        .stat-num{font-size:clamp(2rem,4vw,3rem);font-weight:800;color:#f59e0b;font-family:'Cormorant Garamond',serif;line-height:1;margin-bottom:8px}
        .stat-label{color:rgba(255,255,255,0.6);font-size:13px}
        @media(max-width:760px){.stats-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:400px){.stats-grid{grid-template-columns:1fr}}

        /* TESTIMONIAL PLACEHOLDER */
        .testimonial-section{padding:80px 20px;background:#fff}
        .testimonial-inner{max-width:900px;margin:0 auto}
        .test-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px}
        .test-card{background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:18px;padding:24px;transition:all 0.25s}
        .test-card:hover{border-color:#93c5fd;box-shadow:0 4px 20px rgba(59,130,246,0.08)}
        .test-stars{color:#f59e0b;font-size:16px;margin-bottom:12px}
        .test-quote{color:#374151;font-size:14px;line-height:1.7;margin-bottom:16px;font-style:italic}
        .test-name{font-weight:700;color:#111827;font-size:13px}
        .test-sub{color:#9ca3af;font-size:12px}
        @media(max-width:760px){.test-grid{grid-template-columns:1fr}}

        .why-cta{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%);padding:80px 20px;text-align:center}
        .why-cta h2{font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;color:#fff;margin-bottom:12px}
        .why-cta p{color:#bfdbfe;font-size:15px;margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7}
        .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .btn-gold{background:#f59e0b;color:#1a0a00;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-gold:hover{background:#fcd34d;transform:translateY(-1px)}
        .btn-ghost{background:rgba(255,255,255,0.07);color:#fff;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.2s}
        .btn-ghost:hover{background:rgba(255,255,255,0.12)}
        .ym-footer{background:#030a1f;color:rgba(255,255,255,0.5);padding:32px 20px;text-align:center;font-size:12px}
        .ym-footer a{color:#93c5fd;text-decoration:none}
      `}</style>

      <Navbar enrollHref="/" />

      {/* HERO */}
      <section className="why-hero">
        <div className="why-hero-tag fu1">⭐ Our Edge</div>
        <h1 className="fu2">Why Choose <span>Yarwng Mathematics</span>?</h1>
        <p className="fu3">Not all coaching is equal. Here's what makes Yarwng Mathematics different — and why students trust us with their most important subject.</p>
      </section>

      {/* FEATURES */}
      <section className="why-features">
        <div className="sec-head fu1">
          <div className="sec-tag" style={{ background:"#fef3c7", color:"#92400e" }}>🏆 What Sets Us Apart</div>
          <h2 className="sec-h2">The Yarwng Advantage</h2>
          <div className="sec-line" style={{ background:"#f59e0b" }} />
        </div>

        <div className="feat-grid">
          {[
            { icon:"🧠", bg:"#eff6ff", title:"Conceptual Depth", desc:"We go beyond formulas. Every concept is explained with its origin, intuition, and real-world relevance. Students don't just pass — they understand." },
            { icon:"👨‍🏫", bg:"#fef3c7", title:"IIT Delhi alumni", desc:"Direct access to an M.Sc graduate from IIT Delhi. The same rigour that cracked one of India's toughest entrances now teaches your child." },
            { icon:"📅", bg:"#f0fdf4", title:"Structured Timetable", desc:"Fixed weekly sessions per class. No cancellations, no confusion. Consistency builds habits, and habits build toppers." },
            { icon:"💬", bg:"#fdf2f8", title:"24/7 WhatsApp Support", desc:"Got a doubt at 11 PM before an exam? Message us. Every batch has a dedicated WhatsApp group for ongoing support." },
            { icon:"🖥️", bg:"#f0f9ff", title:"Live Google Meet Sessions", desc:"High-quality interactive video sessions. See the board, ask questions in real time, and learn from wherever you are in India." },
            { icon:"📝", bg:"#fff1f2", title:"Regular Assessments", desc:"Weekly mini-tests and monthly full tests. Detailed performance feedback helps you know exactly what to improve." },
            { icon:"📚", bg:"#f9fafb", title:"Syllabus-Aligned Teaching", desc:"Class 10, 11 & 12 curriculum for CBSE, TBSE and ICSE — board exam patterns studied and taught strategically." },
            { icon:"🎯", bg:"#fef3c7", title:"Exam-Focused Practice", desc:"Previous year papers, sample papers, and mock tests. We don't just teach — we prepare you to perform under pressure." },
            { icon:"🌱", bg:"#f0fdf4", title:"Small Batch Sizes", desc:"Limited seats per batch means every student gets personal attention. No one gets lost in a crowd of 50 students." },
          ].map(f=>(
            <div key={f.title} className="feat-card">
              <div className="feat-icon-wrap" style={{ background:f.bg }}>{f.icon}</div>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* COMPARISON */}
        <div className="sec-head fu1">
          <div className="sec-tag" style={{ background:"#dbeafe", color:"#1d4ed8" }}>📊 Honest Comparison</div>
          <h2 className="sec-h2">Us vs. The Rest</h2>
          <div className="sec-line" style={{ background:"#2563eb" }} />
        </div>
      </section>

      <section className="compare-section">
        <div className="compare-inner">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="ym">Yarwng Mathematics</th>
                <th className="others">Typical Coaching</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["IIT-qualified faculty ","✅","❌"],
                ["Live interactive sessions","✅","Sometimes"],
                ["WhatsApp doubt support","✅","❌"],
                ["Small batch (personal attention)","✅","❌"],
                ["Regular test + feedback","✅","Rarely"],
                ["Flexible online access","✅","❌"],
                ["Structured weekly timetable","✅","Sometimes"],
                ["Previous year paper practice","✅","Sometimes"],
                ["Transparent pricing","✅","Hidden fees"],
              ].map(([feat, ym, other])=>(
                <tr key={feat}>
                  <td>{feat}</td>
                  <td className="ym">{ym === "✅" ? <span className="check">✅</span> : ym}</td>
                  <td className="others">{other === "❌" ? <span className="cross">❌</span> : other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-inner">
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="sec-tag" style={{ background:"rgba(255,255,255,0.1)", color:"#93c5fd", display:"inline-flex" }}>📈 By The Numbers</div>
            <h2 style={{ color:"#fff", fontSize:"clamp(1.6rem,3vw,2.3rem)", fontWeight:800, marginTop:10 }}>Our Track Record</h2>
          </div>
          <div className="stats-grid">
            {[
              { num:"3", label:"Classes Offered (10, 11, 12)" },
              { num:"IIT", label:"Delhi Level Expertise" },
              { num:"2 hrs", label:"Per Live Session" },
              { num:"∞", label:"Doubt Support Available" },
            ].map(s=>(
              <div key={s.label} className="stat-card">
                <p className="stat-num">{s.num}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="why-cta">
        <h2>Still Have Questions?</h2>
        <p>Reach out to us directly or enroll now — classes start 15th June 2026 and seats are limited.</p>
        <div className="cta-btns">
          <Link href="/" className="btn-gold">🚀 Enroll Now →</Link>
          <Link href="/contact" className="btn-ghost">Contact Us</Link>
        </div>
      </section>

      <footer className="ym-footer">
        <p>© {new Date().getFullYear()} Yarwng Mathematics · <a href="/">Home</a> · <a href="/classes">Classes</a> · <a href="/contact">Contact</a></p>
      </footer>
    </main>
  );
}