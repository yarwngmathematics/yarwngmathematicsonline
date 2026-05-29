"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", email:"", cls:"", msg:"" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can wire this to your Google Sheet script
    setSent(true);
  };

  return (
    <main style={{ fontFamily:"'Outfit',sans-serif", background:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp 0.6s ease both 0.1s}.fu2{animation:fadeUp 0.6s ease both 0.2s}.fu3{animation:fadeUp 0.6s ease both 0.35s}

        .con-hero{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 50%,#0f2d6b 100%);padding:80px 20px 100px;clip-path:polygon(0 0,100% 0,100% 92%,0 100%);text-align:center}
        .con-hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);border-radius:100px;padding:6px 16px;margin-bottom:20px;color:#fcd34d;font-size:12px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase}
        .con-hero h1{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:14px}
        .con-hero h1 span{color:#f59e0b}
        .con-hero p{color:#bfdbfe;font-size:16px;max-width:540px;margin:0 auto;line-height:1.75}

        .con-body{max-width:1100px;margin:0 auto;padding:80px 20px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
        @media(max-width:760px){.con-body{grid-template-columns:1fr;gap:48px}}

        /* INFO SIDE */
        .con-info-title{font-size:24px;font-weight:800;color:#111827;margin-bottom:6px}
        .con-info-tagline{color:#f59e0b;font-style:italic;font-size:14px;margin-bottom:28px}
        .con-row{display:flex;align-items:center;gap:14px;margin-bottom:20px}
        .con-icon{width:44px;height:44px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .con-val{color:#111827;font-size:15px;font-weight:600}
        .con-val a{color:#2563eb;text-decoration:none}
        .con-val a:hover{text-decoration:underline}
        .con-sub{color:#9ca3af;font-size:12px;margin-top:2px}
        .con-wa-btn{display:inline-flex;align-items:center;gap:8px;background:#16a34a;color:#fff;padding:13px 24px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;transition:all 0.2s;margin-top:8px}
        .con-wa-btn:hover{background:#15803d;transform:translateY(-1px)}
        .con-quick-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
        .con-chip{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:7px 13px;font-size:12px;color:#374151;font-weight:500}

        /* FORM SIDE */
        .con-form-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:24px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
        .con-form-title{font-size:20px;font-weight:800;color:#111827;margin-bottom:4px}
        .con-form-sub{color:#6b7280;font-size:13px;margin-bottom:24px}
        .form-stack{display:flex;flex-direction:column;gap:14px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .form-label{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;display:block}
        .form-input{width:100%;border:1.5px solid #e5e7eb;padding:11px 14px;border-radius:11px;font-size:14px;font-family:'Outfit',sans-serif;color:#111827;outline:none;transition:border-color 0.2s;background:#fff}
        .form-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1)}
        .form-input::placeholder{color:#9ca3af}
        .form-submit{width:100%;background:#2563eb;color:#fff;padding:14px;border-radius:12px;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .form-submit:hover{background:#1d4ed8;transform:translateY(-1px)}
        @media(max-width:460px){.form-row{grid-template-columns:1fr}}

        /* SUCCESS */
        .con-success{text-align:center;padding:40px 20px}
        .con-success-icon{font-size:56px;margin-bottom:16px}
        .con-success h3{font-size:22px;font-weight:800;color:#111827;margin-bottom:8px}
        .con-success p{color:#6b7280;font-size:14px;line-height:1.7}

        /* MAP / LOCATION CARD */
        .location-section{background:linear-gradient(180deg,#f9fafb 0%,#fff 100%);padding:60px 20px}
        .location-inner{max-width:1100px;margin:0 auto}
        .loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .loc-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:20px;padding:28px;display:flex;gap:16px;align-items:flex-start;transition:all 0.25s}
        .loc-card:hover{border-color:#93c5fd;box-shadow:0 4px 20px rgba(59,130,246,0.08)}
        .loc-icon{font-size:32px;flex-shrink:0}
        .loc-title{font-size:16px;font-weight:700;color:#111827;margin-bottom:5px}
        .loc-desc{font-size:13px;color:#6b7280;line-height:1.65}
        @media(max-width:640px){.loc-grid{grid-template-columns:1fr}}

        .con-cta{background:linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%);padding:72px 20px;text-align:center}
        .con-cta h2{font-size:clamp(1.6rem,3vw,2.3rem);font-weight:800;color:#fff;margin-bottom:12px}
        .con-cta p{color:#bfdbfe;font-size:15px;margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7}
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
      <section className="con-hero">
        <div className="con-hero-tag fu1">📬 Get In Touch</div>
        <h1 className="fu2">Contact <span>Yarwng Mathematics</span></h1>
        <p className="fu3">Have a question about classes, fees, or schedules? We're here to help. Reach out and we'll respond promptly.</p>
      </section>

      {/* BODY */}
      <div className="con-body">
        {/* INFO */}
        <div className="fu2">
          <h2 className="con-info-title">Yarwng Mathematics</h2>
          <p className="con-info-tagline">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>

          {[
            { icon:"👨‍🏫", val:"Rakesh Debbarma", sub:"M.Sc Mathematics, IIT Delhi" },
            { icon:"📱", val:<a href="tel:9366030347">9366030347</a>, sub:"Call or WhatsApp — available daily" },
            { icon:"✉️", val:<a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a>, sub:"We reply within 24 hours" },
            { icon:"📍", val:"Khumulwng, West Tripura", sub:"Offline classes launching soon" },
            { icon:"🕐", val:"Mon–Sat, 9 AM – 8 PM", sub:"Response time: within a few hours" },
          ].map((r,i)=>(
            <div key={i} className="con-row">
              <div className="con-icon">{r.icon}</div>
              <div>
                <p className="con-val">{r.val}</p>
                <p className="con-sub">{r.sub}</p>
              </div>
            </div>
          ))}

          <a href="https://wa.me/919366030347?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Yarwng%20Mathematics%20classes" target="_blank" rel="noopener noreferrer" className="con-wa-btn">
            💬 Chat on WhatsApp
          </a>

          <div className="con-quick-chips">
            <span className="con-chip">📘 Class 10 · ₹600/mo</span>
            <span className="con-chip">📙 Class 11 · ₹800/mo</span>
            <span className="con-chip">📗 Class 12 · ₹900/mo</span>
            <span className="con-chip">🗓️ Starts 3rd June 2026</span>
          </div>
        </div>

        {/* FORM */}
        <div className="fu3">
          {sent ? (
            <div className="con-form-card">
              <div className="con-success">
                <div className="con-success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Rakesh sir will get back to you on WhatsApp or email within a few hours.</p>
              </div>
            </div>
          ) : (
            <div className="con-form-card">
              <h3 className="con-form-title">Send Us a Message</h3>
              <p className="con-form-sub">Fill this form and we'll reach out to you directly.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-stack">
                  <div className="form-row">
                    <div>
                      <label className="form-label">Your Name *</label>
                      <input className="form-input" type="text" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp No. *</label>
                      <input className="form-input" type="tel" placeholder="10-digit number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email (optional)</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Interested Class *</label>
                    <select className="form-input" value={form.cls} onChange={e=>setForm({...form,cls:e.target.value})} required>
                      <option value="">Select a class</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Your Message *</label>
                    <textarea className="form-input" rows={4} placeholder="Tell us about your query — fees, schedule, syllabus, etc." value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} required style={{ resize:"vertical" }} />
                  </div>
                  <button type="submit" className="form-submit">Send Message →</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* LOCATION CARDS */}
      <section className="location-section">
        <div className="location-inner">
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div className="sec-tag" style={{ background:"#ffedd5", color:"#c2410c", display:"inline-flex", padding:"5px 14px", borderRadius:"100px", fontSize:12, fontWeight:600, marginBottom:12 }}>📍 Find Us</div>
            <h2 style={{ fontSize:"clamp(1.6rem,3vw,2.3rem)", fontWeight:800, color:"#111827" }}>Where We Teach</h2>
          </div>
          <div className="loc-grid">
            {[
              { icon:"🖥️", title:"Online — Google Meet", desc:"Live sessions accessible from anywhere in India. Join from home with any device. Sessions are interactive, recorded on request, and fully structured." },
              { icon:"🏫", title:"Offline — Khumulwng, Tripura", desc:"Physical classroom sessions launching soon at Khumulwng. Face-to-face teaching with personalised attention. Register your interest now." },
              { icon:"💬", title:"WhatsApp Groups", desc:"Every batch has a dedicated WhatsApp group. Doubts, notes, test schedules, and announcements — all in one place." },
              { icon:"📧", title:"Email & Direct Contact", desc:"Prefer email? Write to yarwngmathematics@gmail.com. For quick queries, WhatsApp at 9366030347 gets the fastest response." },
            ].map(l=>(
              <div key={l.title} className="loc-card">
                <span className="loc-icon">{l.icon}</span>
                <div>
                  <p className="loc-title">{l.title}</p>
                  <p className="loc-desc">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="con-cta">
        <h2>Ready to Enroll?</h2>
        <p>Skip the inquiry and go straight to registration. Classes start 3rd June 2026.</p>
        <div className="cta-btns">
          <Link href="/" className="btn-gold">🚀 Enroll Now →</Link>
          <Link href="/classes" className="btn-ghost">View Classes</Link>
        </div>
      </section>

      <footer className="ym-footer">
        <p>© {new Date().getFullYear()} Yarwng Mathematics · <a href="/">Home</a> · <a href="/about">About</a> · <a href="/classes">Classes</a></p>
      </footer>
    </main>
  );
}