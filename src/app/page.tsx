"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   PAYMENT CONFIG — edit these freely
───────────────────────────────────────── */
const PAYMENT = {
  upi: "rakeshdebbarmaofficial@okaxis",
  bankName: "SBI",
  accountName: "Rakesh Debbarma",
  accountNo: "43120222789",
  ifsc: "SBIN0064072",
  classes: {
    "Class 10": { original: 700, offer: 600, whatsapp: "https://chat.whatsapp.com/DDdQ4xpOj3SA5RiVlPZ7Ar?s=cl&p=a&mlu=1" },
    "Class 11": { original: 900, offer: 800, whatsapp: "https://chat.whatsapp.com/E9FN3Nh6dLx3dKa7VGENkI?s=cl&p=a&mlu=1" },
    "Class 12": { original: 1000, offer: 900, whatsapp: "https://chat.whatsapp.com/HUe0D5AybDc7aBivxsp426?s=cl&p=a&mlu=1" },
  } as Record<string, { original: number; offer: number; whatsapp: string }>,
};

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

/* ─────────────────────────────────────────
   SLOT DATA
───────────────────────────────────────── */
const SLOTS: Record<string, { days: string; time: string }> = {
  "Class 10": { days: "Monday & Wednesday", time: "5:00 PM – 7:00 PM" },
  "Class 11": { days: "Tuesday & Friday",   time: "5:00 PM – 7:00 PM" },
  "Class 12": { days: "Thursday & Saturday", time: "5:00 PM – 7:00 PM" },
};

/* ─────────────────────────────────────────
   STEP TYPES
───────────────────────────────────────── */
type Step = "form" | "payment" | "utr" | "done";

export default function Home() {
  /* ── UI state ── */
  const [showModal, setShowModal]   = useState(false);
  const [step, setStep]             = useState<Step>("form");
  const [liveDot, setLiveDot]       = useState(true);
  const [adVariant, setAdVariant]   = useState(0);
  const [slotsOpen, setSlotsOpen]   = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  /* ── Form state ── */
  const [name,         setName]         = useState("");
  const [whatsapp,     setWhatsapp]     = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [mode,         setMode]         = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [utr,          setUtr]          = useState("");
  const [utrError,     setUtrError]     = useState("");

  /* ── Prevent double submit ── */
  const submittedRef = useRef(false);

  /* ── Timers ── */
  useEffect(() => {
    const t = setInterval(() => setLiveDot(v => !v), 900);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setAdVariant(v => (v + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  /* ── Reset modal ── */
  const openModal = (preMode?: string) => {
    submittedRef.current = false;
    utrSubmittedRef.current = false;
    setStep("form");
    setName(""); setWhatsapp(""); setStudentClass(""); setMode(preMode ?? ""); setUtr(""); setUtrError("");
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  /* ── Form submit — single-shot guard ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedRef.current || submitting) return;   // block double submit
    submittedRef.current = true;
    setSubmitting(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ name, whatsapp, studentClass, mode }),
      });
    } catch (_) { /* no-cors always "fails" */ }
    setSubmitting(false);
    setStep("payment");
  };

  /* ── UTR submit — validates format then submits to sheet and opens WhatsApp ── */
  const utrSubmittedRef = useRef(false);
  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = utr.trim().toUpperCase();
    // UTR is 12 alphanumeric chars (UPI) or 16-22 digits (IMPS/NEFT)
    if (!/^[A-Z0-9]{10,22}$/.test(cleaned)) {
      setUtrError("Please enter a valid Transaction / UTR ID (10–22 characters).");
      return;
    }
    if (utrSubmittedRef.current) return;
    utrSubmittedRef.current = true;
    setUtrError("");
    // Save UTR to Google Sheet
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ name, whatsapp, studentClass, mode, utr: cleaned, status: "paid" }),
      });
    } catch (_) {}
    setStep("done");
  };

  /* ── Payment info for selected class ── */
  const pay = studentClass ? PAYMENT.classes[studentClass] : null;
  const discount = pay ? Math.round(((pay.original - pay.offer) / pay.original) * 100) : 0;

  /* ── Auto-open WhatsApp when step becomes "done" ── */
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (step !== "done" || !pay?.whatsapp) return;
    setCountdown(3);
    window.open(pay.whatsapp, "_blank", "noopener,noreferrer");
    let c = 3;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  /* ═══════════════════════════════════════
     AD VARIANTS
  ═══════════════════════════════════════ */
  const adVariants = [
    // Variant 1 – bold split
    <div key="v1" className="w-full rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[200px] shadow-lg"
         style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)" }}>
      <div className="flex flex-col justify-center px-8 py-10 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">📢 Enrollment Open</p>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
          Online Classes Start<br /><span className="text-yellow-300">3rd June 2026</span>
        </h3>
        <p className="text-blue-200 text-sm mt-2">Class 10 · 11 · 12 &nbsp;|&nbsp; Via Google Meet</p>

      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-8 bg-white/10 shrink-0">
        <div className="border-2 border-yellow-300 rounded-2xl px-6 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-200 mb-1">Seats Filling Fast</p>
          <p className="text-3xl font-extrabold text-white">🔥 Enroll</p>
          <p className="text-xs text-blue-200 mt-1">Limited spots per batch</p>
        </div>
        <button onClick={() => openModal()} className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3 rounded-2xl font-bold text-base shadow-lg transition">
          Register Now →
        </button>
      </div>
    </div>,

    // Variant 2 – dark indigo
    <div key="v2" className="w-full rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[200px] shadow-lg"
         style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 60%,#3730a3 100%)" }}>
      <div className="flex flex-col justify-center px-8 py-10 flex-1">
        <span className="inline-block bg-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 w-fit">
          🚀 Now Accepting Registrations
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
          Online Classes<br /><span className="text-yellow-300">Starting 3rd June 2026</span>
        </h3>
        <p className="text-indigo-300 text-sm mt-2">Google Meet · Class 10 / 11 / 12</p>

      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-8 border-t md:border-t-0 md:border-l border-indigo-700 bg-white/5 shrink-0">
        <div className="text-center text-white">
          <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Don't miss out</p>
          <p className="text-lg font-bold text-yellow-300">⚡ Enroll Fast</p>
          <p className="text-xs text-indigo-400 mt-1">Seats are limited!</p>
        </div>
        <button onClick={() => openModal()} className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-8 py-3 rounded-2xl font-bold text-base shadow-lg transition">
          Register Now →
        </button>
      </div>
    </div>,

    // Variant 3 – clean white with blue stripe
    <div key="v3" className="w-full rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[200px] border border-gray-200 bg-white shadow-md">
      <div className="w-3 bg-blue-600 shrink-0" />
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 py-10 gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">📣 Announcement</p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            Online Classes Start<br /><span className="text-blue-700">3rd June 2026</span>
          </h3>
          <p className="text-gray-500 text-sm mt-1">Class 10, 11 &amp; 12 · Google Meet · Live Sessions</p>

        </div>
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 text-center">
            <p className="text-xs font-semibold text-blue-600 mb-0.5">Limited Seats Available</p>
            <p className="text-sm font-bold text-blue-800">Enroll Fast 🔥</p>
          </div>
          <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-base shadow transition">
            Register Now →
          </button>
        </div>
      </div>
    </div>,
  ];

  /* ═══════════════════════════════════════
     RENDER
  ═══════════════════════════════════════ */
  return (
    <main className="ym-page min-h-screen bg-white text-gray-900">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .ym-page { font-family: 'DM Sans', sans-serif; }
        .ym-display { font-family: 'Playfair Display', Georgia, serif; }

        /* Hero background animated gradient */
        @keyframes heroShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .hero-bg {
          background: linear-gradient(135deg, #0a0f2e 0%, #0d1b4b 30%, #0f2d6b 55%, #0d1b4b 80%, #0a0f2e 100%);
          background-size: 300% 300%;
          animation: heroShift 12s ease infinite;
        }

        /* Floating math symbols */
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg);  opacity: 0.08; }
          50%  { transform: translateY(-28px) rotate(8deg); opacity: 0.14; }
          100% { transform: translateY(0px) rotate(0deg);  opacity: 0.08; }
        }
        .math-sym { position:absolute; color:#fff; font-weight:900; pointer-events:none; animation: floatUp ease-in-out infinite; }

        /* Stagger fade-in */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .fade-up-1 { animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
        .fade-up-2 { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; }
        .fade-up-3 { animation: fadeUp 0.7s ease both; animation-delay: 0.4s; }
        .fade-up-4 { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
        .fade-up-5 { animation: fadeUp 0.7s ease both; animation-delay: 0.7s; }

        /* Shimmer pill */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-pill {
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 75%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        /* Enroll button glow pulse */
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.45); }
          50%      { box-shadow: 0 0 0 14px rgba(250,204,21,0); }
        }
        .enroll-btn { animation: glowPulse 2.4s ease infinite; }

        /* Card glass */
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.13);
        }

        /* Diagonal cut at bottom of hero */
        .hero-clip {
          clip-path: polygon(0 0, 100% 0, 100% 92%, 0 100%);
        }

        /* Navbar transparent-to-solid */
        .ym-nav {
          background: rgba(10,15,46,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        /* Stats counter card */
        .stat-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: center;
          flex: 1;
          min-width: 100px;
        }
      `}</style>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav className="ym-nav sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-xl ring-1 ring-white/20" />
            <div>
              <h1 className="ym-display text-base md:text-xl font-bold text-white leading-tight">Yarwng Mathematics</h1>
              <p className="text-xs text-blue-300">Rakesh Debbarma · M.Sc, IIT Delhi</p>
            </div>
          </div>
          <a href="/login"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-5 py-2 rounded-xl font-bold text-sm shadow-lg transition">
            Login / Register
          </a>
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hero-bg hero-clip relative overflow-hidden pb-32 pt-20 md:pt-28 px-4">

        {/* Floating math symbols background */}
        {[
          { sym:"∑", top:"8%",  left:"4%",  size:52, dur:"7s",  delay:"0s"   },
          { sym:"π", top:"15%", left:"88%", size:44, dur:"9s",  delay:"1.2s" },
          { sym:"∫", top:"55%", left:"6%",  size:38, dur:"8s",  delay:"2s"   },
          { sym:"√", top:"70%", left:"82%", size:46, dur:"10s", delay:"0.5s" },
          { sym:"∞", top:"30%", left:"92%", size:32, dur:"6s",  delay:"3s"   },
          { sym:"Δ", top:"80%", left:"15%", size:28, dur:"11s", delay:"1.8s" },
          { sym:"θ", top:"22%", left:"48%", size:24, dur:"8s",  delay:"4s"   },
          { sym:"≈", top:"60%", left:"55%", size:22, dur:"7s",  delay:"2.5s" },
        ].map((s,i) => (
          <span key={i} className="math-sym ym-display select-none"
            style={{ top:s.top, left:s.left, fontSize:s.size, animationDuration:s.dur, animationDelay:s.delay }}>
            {s.sym}
          </span>
        ))}

        {/* Radial glow blobs */}
        <div style={{ position:"absolute", top:"10%", right:"5%", width:480, height:480, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"15%", left:"2%", width:320, height:320, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 text-center md:text-left">

              {/* Shimmer pill badge */}
              <div className="fade-up-1 inline-flex items-center gap-2 shimmer-pill border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">IIT Delhi · Tripura</span>
              </div>

              {/* Headline */}
              <h2 className="ym-display fade-up-2 font-black text-white leading-[1.08] mb-5"
                style={{ fontSize:"clamp(2.6rem,5.5vw,4.2rem)" }}>
                Master Mathematics<br />
                <span style={{ color:"#FACC15", textShadow:"0 0 40px rgba(250,204,21,0.35)" }}>
                  With Confidence
                </span>
              </h2>

              {/* Kokborok tagline */}
              <div className="fade-up-3 flex items-center gap-3 mb-6 justify-center md:justify-start">
                <div className="h-px w-8 bg-yellow-400/60" />
                <p className="text-yellow-300/90 italic text-sm font-medium tracking-wide">
                  "Amani Kok Kokborok bai Swrwngwi Mannai"
                </p>
                <div className="h-px w-8 bg-yellow-400/60" />
              </div>

              {/* Subtext */}
              <p className="fade-up-3 text-blue-200 text-base md:text-lg max-w-lg mb-8 leading-relaxed mx-auto md:mx-0">
                Expert coaching for <strong className="text-white">Class 10, 11 &amp; 12</strong> by an
                IIT Delhi graduate — Online via Google Meet &amp; Offline at Khumulwng.
              </p>

              {/* CTA row */}
              <div className="fade-up-4 flex flex-wrap gap-4 justify-center md:justify-start mb-10">
                <button onClick={() => openModal()}
                  className="enroll-btn bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-8 py-4 rounded-2xl font-black text-lg transition">
                  Enroll Now →
                </button>
                <button onClick={() => { document.getElementById("online-session")?.scrollIntoView({behavior:"smooth"}); }}
                  className="glass-card text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 transition">
                  View Schedule
                </button>
              </div>

              {/* Stats row */}
              <div className="fade-up-5 flex gap-3 justify-center md:justify-start flex-wrap">
                {[
                  { num:"3",    label:"Classes"         },
                  { num:"IIT",  label:"Delhi Faculty"   },
                  { num:"2hrs", label:"Per Session"     },
                  { num:"∞",    label:"Doubt Support"   },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <p className="ym-display text-yellow-300 font-bold text-xl leading-none mb-1">{s.num}</p>
                    <p className="text-blue-300 text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Profile card ── */}
            <div className="fade-up-2 w-full md:w-[320px] shrink-0">
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                {/* Card glow accent */}
                <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%",
                  background:"radial-gradient(circle, rgba(250,204,21,0.2) 0%, transparent 70%)", pointerEvents:"none" }} />

                {/* Avatar ring */}
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-blue-900 font-black text-2xl shadow-lg flex-shrink-0">
                    RD
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">Rakesh Debbarma</p>
                    <p className="text-blue-300 text-xs mt-0.5">M.Sc Mathematics</p>
                    <p className="text-yellow-400 text-xs font-semibold">IIT Delhi</p>
                  </div>
                </div>

                <div className="relative z-10 space-y-2.5 mb-5">
                  {[
                    { icon:"🟢", label:"Online",   val:"Google Meet · Live" },
                    { icon:"🏫", label:"Offline",  val:"Khumulwng (Soon)"   },
                    { icon:"📅", label:"Schedule", val:"Structured weekly"  },
                    { icon:"💬", label:"Support",  val:"WhatsApp batches"   },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
                      <span className="text-base">{r.icon}</span>
                      <div>
                        <p className="text-white text-xs font-semibold leading-none">{r.label}</p>
                        <p className="text-blue-300 text-xs mt-0.5">{r.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => openModal()}
                  className="relative z-10 w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black py-3 rounded-xl text-sm shadow transition">
                  🚀 Classes Start 3rd June 2026
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════ LIVE AD BANNER ══════════════════ */}
      <section className="bg-gray-50 border-y border-gray-200 py-8 px-4 relative">
        <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 shadow-sm z-10">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" style={{ opacity: liveDot ? 1 : 0.2, transition:"opacity 0.4s" }} />
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Live</span>
        </div>
        <div className="max-w-6xl mx-auto pt-6">
          <div className="flex justify-center gap-2 mb-4">
            {[0,1,2].map(i => (
              <button key={i} onClick={() => setAdVariant(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${adVariant===i ? "bg-blue-600" : "bg-gray-300"}`} />
            ))}
          </div>
          <div key={adVariant} style={{ animation:"fadeIn 0.4s ease" }}>
            {adVariants[adVariant]}
          </div>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      </section>

      {/* ══════════════════ ONLINE SESSION ══════════════════ */}
      <section id="online-session" className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              🟢 Currently via Google Meet
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Online Session</h2>
            <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">Live interactive classes via Google Meet. Join from anywhere in India.</p>
          </div>

          {/* Class cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {Object.entries(PAYMENT.classes).map(([cls]) => (
                <div key={cls} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="text-3xl mb-3">{cls === "Class 10" ? "📘" : cls === "Class 11" ? "📙" : "📗"}</div>
                  <h3 className="font-black text-gray-900 text-xl mb-1">{cls}</h3>
                  <p className="text-gray-500 text-sm mb-1">{SLOTS[cls].days}</p>
                  <p className="text-gray-500 text-sm mb-6">{SLOTS[cls].time}</p>
                  <button onClick={() => openModal()} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition">
                    Join {cls}
                  </button>
                </div>
            ))}
          </div>

          {/* Slots accordion */}
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => { setSlotsOpen(!slotsOpen); setSelectedSlot(null); }}
              className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow transition mb-4"
            >
              <span>📅 View Detailed Class Slots</span>
              <span className="text-2xl">{slotsOpen ? "−" : "+"}</span>
            </button>
            {slotsOpen && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                {(["Class 10","Class 11","Class 12"] as const).map(cls => (
                  <div key={cls}>
                    <button
                      onClick={() => setSelectedSlot(selectedSlot===cls ? null : cls)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border font-semibold transition ${selectedSlot===cls ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"}`}
                    >
                      <span>{cls}</span><span>{selectedSlot===cls ? "▲" : "▼"}</span>
                    </button>
                    {selectedSlot===cls && (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 space-y-2">
                        <div className="flex items-center gap-3"><span className="text-xl">📆</span><div><p className="font-semibold text-blue-800">{SLOTS[cls].days}</p><p className="text-blue-600 text-sm">Every week</p></div></div>
                        <div className="flex items-center gap-3"><span className="text-xl">🕐</span><div><p className="font-semibold text-blue-800">{SLOTS[cls].time}</p><p className="text-blue-600 text-sm">Evening · 2 hours</p></div></div>
                        <div className="flex items-center gap-3"><span className="text-xl">💰</span><div><p className="font-semibold text-blue-800">₹{PAYMENT.classes[cls].offer}/month</p><p className="text-blue-600 text-sm line-through text-xs">₹{PAYMENT.classes[cls].original}</p></div></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════ OFFLINE SESSION ══════════════════ */}
      <section className="bg-orange-50 border-y border-orange-100 py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🔔 Starting Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Offline Session</h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full mb-8" />
          <div className="bg-white border border-orange-100 rounded-3xl p-8 md:p-12 shadow-sm w-full">
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Physical Classroom</h3>
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold text-lg mb-3">
              📍 Khumulwng, Tripura
            </div>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Face-to-face classes in a structured environment. Personalised attention. Details will be announced soon.
            </p>
            <div className="inline-block bg-orange-100 text-orange-700 px-5 py-2 rounded-xl font-bold text-sm mb-6">
              ⏳ Launching Soon — Limited Seats
            </div>
            <div>
              <button onClick={() => openModal("Offline")} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow transition">
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ WHAT MAKES US DIFFERENT ══════════════════ */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon:"🧠", title:"Conceptual Depth", desc:"We don't just teach formulas — we build intuition and deep understanding that lasts beyond exams." },
              { icon:"👨‍🏫", title:"IIT-Level Expertise", desc:"Faculty trained at one of India's premier institutes brings top-tier rigour to every class." },
              { icon:"🗓️", title:"Structured Timetable", desc:"Fixed weekly slots per class ensure consistency, discipline, and steady progress." },
              { icon:"💬", title:"WhatsApp Support", desc:"Doubt-clearing continues beyond class hours via dedicated WhatsApp groups for every batch." },
              { icon:"🖥️", title:"Google Meet Sessions", desc:"High-quality online classes via Google Meet — join from anywhere with a good connection." },
              { icon:"📝", title:"Regular Assessments", desc:"Frequent tests and detailed feedback help track progress and identify areas needing improvement." },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Know About Yarwng Mathematics</h2>
          <p className="text-blue-600 italic text-base font-medium mb-4">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6"><strong className="text-blue-700">Yarwng Mathematics</strong> was founded to make advanced mathematics accessible and enjoyable for every student in Tripura and beyond.</p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">Led by <strong>Rakesh Debbarma</strong>, an M.Sc graduate from <strong>IIT Delhi</strong>, we bring world-class mathematical thinking to your doorstep.</p>
            <p className="text-gray-600 text-lg leading-relaxed">Our approach combines rigorous conceptual teaching, regular problem-solving, and personalised attention so every student grows confidently.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon:"🎓", label:"IIT Delhi Alumni", sub:"M.Sc Mathematics" },
              { icon:"📚", label:"Classes 10–12", sub:"Full syllabus coverage" },
              { icon:"🌐", label:"Online & Offline", sub:"Flexible modes" },
              { icon:"📈", label:"Proven Results", sub:"High scoring students" },
            ].map(card => (
              <div key={card.label} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{card.icon}</div>
                <p className="font-bold text-blue-800 text-sm">{card.label}</p>
                <p className="text-blue-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ MODAL ══════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-700 px-8 py-6 text-white">
              <button onClick={closeModal} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold">×</button>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                {["form","payment","utr","done"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition ${step === s ? "bg-yellow-400 text-blue-900" : ["form","payment","utr","done"].indexOf(step) > i ? "bg-white/30 text-white" : "bg-white/10 text-white/40"}`}>
                      {["form","payment","utr","done"].indexOf(step) > i ? "✓" : i + 1}
                    </div>
                    {i < 3 && <div className={`h-px w-6 ${["form","payment","utr","done"].indexOf(step) > i ? "bg-white/40" : "bg-white/15"}`} />}
                  </div>
                ))}
              </div>
              <div className="text-3xl mb-1">
                {step === "form" ? "📝" : step === "payment" ? "💳" : step === "utr" ? "🔐" : "✅"}
              </div>
              <h2 className="text-xl font-black">
                {step === "form" ? "Join Yarwng Mathematics" : step === "payment" ? "Complete Your Payment" : step === "utr" ? "Confirm Your Payment" : "Registration Complete!"}
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">
                {step === "form" ? "Fill your details to register" : step === "payment" ? `${studentClass} · ₹${pay?.offer}/month` : step === "utr" ? "Enter your transaction ID to verify" : "Welcome to Yarwng Mathematics"}
              </p>
            </div>

            <div className="p-8">
              {/* ── STEP 1: FORM ── */}
              {step === "form" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="WhatsApp Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required
                    className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={studentClass} onChange={e => setStudentClass(e.target.value)} required
                    className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Class</option>
                    <option>Class 10</option><option>Class 11</option><option>Class 12</option>
                  </select>
                  <select value={mode} onChange={e => setMode(e.target.value)} required
                    className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Mode</option>
                    <option>Online</option><option>Offline</option>
                  </select>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-bold transition">
                    {submitting ? "Submitting…" : "Next: Pay & Join →"}
                  </button>
                </form>
              )}

              {/* ── STEP 2: PAYMENT ── */}
              {step === "payment" && pay && (
                <div className="space-y-5">
                  {/* Fee summary */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-0.5">{studentClass} · {mode}</p>
                      <p className="text-2xl font-black text-blue-700">₹{pay.offer}<span className="text-sm font-normal text-gray-400 ml-1">/month</span></p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-xl">{discount}% OFF<br /><span className="line-through text-gray-400">₹{pay.original}</span></div>
                  </div>

                  {/* UPI pay buttons */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pay via UPI</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name:"Google Pay",  color:"#34A853", icon:"G" },
                        { name:"PhonePe",     color:"#5f259f", icon:"₱" },
                        { name:"Cred Pay",    color:"#1a1a2e", icon:"C" },
                        { name:"UPI ID",      color:"#1d4ed8", icon:"⊕" },
                      ].map(app => (
                        <a key={app.name}
                          href={`upi://pay?pa=${PAYMENT.upi}&pn=${encodeURIComponent(PAYMENT.accountName)}&am=${pay.offer}&cu=INR`}
                          className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition font-semibold text-sm text-gray-700"
                        >
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                            style={{ background: app.color }}>{app.icon}</span>
                          {app.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Bank details */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Bank Transfer</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="font-semibold">{PAYMENT.bankName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-semibold">{PAYMENT.accountName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Account</span><span className="font-mono font-semibold">{PAYMENT.accountNo}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">IFSC</span><span className="font-mono font-semibold">{PAYMENT.ifsc}</span></div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                    <p className="text-yellow-800 text-xs font-semibold mb-1">📌 How to pay:</p>
                    <ol className="text-yellow-700 text-xs space-y-1 list-decimal list-inside">
                      <li>Tap any UPI app above or transfer to the bank account</li>
                      <li>Complete the payment of <strong>₹{pay.offer}</strong></li>
                      <li>Note the <strong>Transaction / UTR ID</strong> from your payment app</li>
                      <li>Tap the button below and enter that ID</li>
                    </ol>
                  </div>

                  <button
                    onClick={() => setStep("utr")}
                    className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-center py-4 rounded-xl text-base font-black shadow-lg transition"
                  >
                    ✅ I've Paid — Enter Transaction ID →
                  </button>
                </div>
              )}

              {/* ── STEP 3: UTR VERIFICATION ── */}
              {step === "utr" && pay && (
                <div className="space-y-5">
                  {/* What is UTR box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                    <p className="text-blue-800 font-bold text-sm mb-2">🔍 Where to find your Transaction ID?</p>
                    <ul className="text-blue-700 text-xs space-y-1">
                      <li>📱 <strong>Google Pay / PhonePe</strong> → Transaction History → tap the payment → copy UPI Ref No.</li>
                      <li>🏦 <strong>Net Banking / IMPS</strong> → Transaction History → copy UTR Number</li>
                      <li>✉️ <strong>SMS / Email</strong> → Check confirmation message for Ref/UTR ID</li>
                    </ul>
                  </div>

                  <form onSubmit={handleUtrSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                        Transaction / UTR ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 426112345678 or T2506221234"
                        value={utr}
                        onChange={e => { setUtr(e.target.value); setUtrError(""); }}
                        required
                        maxLength={25}
                        className={`w-full border p-3.5 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${utrError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                      {utrError && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {utrError}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1.5">10–22 characters · letters and numbers only</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Amount paid</span>
                      <span className="font-black text-blue-700">₹{pay.offer}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Class</span>
                      <span className="font-bold text-gray-800">{studentClass}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-base font-black shadow-lg transition"
                    >
                      💬 Verify & Join WhatsApp Group →
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep("payment")}
                      className="w-full text-gray-400 hover:text-gray-600 text-sm py-1 transition"
                    >
                      ← Back to payment
                    </button>
                  </form>
                </div>
              )}

              {/* ── STEP 3: DONE ── */}
              {step === "done" && pay && (
                <div className="text-center py-4 space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-xl font-black text-gray-900">Welcome, {name}!</h3>
                  <p className="text-gray-500 text-sm">You're now part of Yarwng Mathematics!</p>

                  {/* Auto-redirect notice */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                    <p className="text-green-700 font-bold text-sm mb-1">
                      ✅ Opening {studentClass} WhatsApp Group automatically…
                    </p>
                    {countdown > 0 ? (
                      <p className="text-green-600 text-xs">Redirecting in <strong>{countdown}s</strong></p>
                    ) : (
                      <p className="text-green-600 text-xs">WhatsApp should be open now!</p>
                    )}
                  </div>

                  {/* Fallback button — always visible */}
                  <a
                    href={pay.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-base shadow-lg transition"
                  >
                    💬 Open {studentClass} WhatsApp Group
                  </a>

                  <p className="text-xs text-gray-400">If WhatsApp didn't open, tap the button above.</p>

                  <button onClick={closeModal} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Yarwng Mathematics</h3>
              <p className="text-yellow-400 italic text-sm mb-3">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
              <p className="text-gray-400 text-sm leading-relaxed">Professional Mathematics Coaching for Classes 10, 11 &amp; 12. Conceptual clarity. Proven results.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>👨‍🏫 <strong className="text-gray-200">Rakesh Debbarma</strong></li>
                <li>🎓 M.Sc Mathematics, IIT Delhi</li>
                <li>📱 <a href="tel:9366030347" className="hover:text-white transition">9366030347</a></li>
                <li>✉️ <a href="mailto:yarwngmathematics@gmail.com" className="hover:text-white transition">yarwngmathematics@gmail.com</a></li>
                <li>📍 Khumulwng, Tripura</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Classes Offered</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>📘 Class 10 · Mon &amp; Wed · 5–7 PM · <span className="text-blue-400">₹600</span></li>
                <li>📙 Class 11 · Tue &amp; Fri · 5–7 PM · <span className="text-blue-400">₹800</span></li>
                <li>📗 Class 12 · Thu &amp; Sat · 5–7 PM · <span className="text-blue-400">₹900</span></li>
                <li className="mt-3 text-orange-400">🏫 Offline: Khumulwng (Starting Soon)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Yarwng Mathematics. All rights reserved.</p>
            <p>Managed by Rakesh Debbarma · M.Sc Mathematics, IIT Delhi</p>
          </div>
        </div>
      </footer>
    </main>
  );
}