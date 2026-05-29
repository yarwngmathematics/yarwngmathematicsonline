"use client";

import { useState, useEffect, useRef } from "react";
const TEST_MODE = true;

const PAYMENT = {
  classes: {
    "Class 10": { original: 700, offer: TEST_MODE ? 1 : 600, whatsapp: "https://chat.whatsapp.com/DDdQ4xpOj3SA5RiVlPZ7Ar?s=cl&p=a&mlu=1" },
    "Class 11": { original: 900, offer: TEST_MODE ? 1 : 800, whatsapp: "https://chat.whatsapp.com/E9FN3Nh6dLx3dKa7VGENkI?s=cl&p=a&mlu=1" },
    "Class 12": { original: 1000, offer: TEST_MODE ? 1 : 900, whatsapp: "https://chat.whatsapp.com/HUe0D5AybDc7aBivxsp426?s=cl&p=a&mlu=1" },
  },
};

const DOMAIN = "https://yarwngmathematics.com";
const POLICY = {
  terms: `${DOMAIN}/terms`,
  privacy: `${DOMAIN}/privacy`,
  refund: `${DOMAIN}/refund`,
};

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

const COUNTER_NAMESPACE = "yarwngmathematics";
const COUNTER_KEY = "site-visitors-2026";
const COUNTER_HIT_URL = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/up`;

const SLOTS = {
  "Class 10": {
    days: "Monday & Wednesday",
    time: "5:00 PM – 7:00 PM",
    desc: ["Algebra", "Geometry", "Trigonometry", "Statistics & more", "Regular tests and doubt sessions included."],
  },
  "Class 11": {
    days: "Tuesday & Friday",
    time: "5:00 PM – 7:00 PM",
    desc: ["Sets & Relations", "Trigonometry", "Calculus basics", "Statistics & Probability", "Strong foundation for Class 12 and competitive exams."],
  },
  "Class 12": {
    days: "Thursday & Saturday",
    time: "5:00 PM – 7:00 PM",
    desc: ["Calculus", "Vectors", "3D Geometry", "Probability & Linear Programming", "Board exam focused with previous year paper practice."],
  },
};

const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Classes", href: "#classes", id: "classes" },
  { label: "Why Us", href: "#why-us", id: "why-us" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("form");
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [liveDot, setLiveDot] = useState(true);
  const [adVariant, setAdVariant] = useState(0);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [payError, setPayError] = useState("");

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [board, setBoard] = useState("");
  const [medium, setMedium] = useState("English");
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [mode, setMode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [counterLoading, setCounterLoading] = useState(true);
  const [counterError, setCounterError] = useState(false);

  const counterHitRef = useRef(false);

  useEffect(() => {
    if (counterHitRef.current) return;
    counterHitRef.current = true;
    const hitCounter = async () => {
      setCounterLoading(true);
      setCounterError(false);
      try {
        const response = await fetch(COUNTER_HIT_URL, { method: "GET", headers: { "Accept": "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data && typeof data.count === "number") setVisitorCount(data.count);
        else throw new Error("Unexpected response format");
      } catch (err) {
        console.warn("Visitor counter failed:", err);
        setCounterError(true);
        try {
          const getUrl = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/get`;
          const res = await fetch(getUrl, { headers: { "Accept": "application/json" } });
          const data = await res.json();
          if (data && typeof data.count === "number") { setVisitorCount(data.count); setCounterError(false); }
        } catch { }
      } finally {
        setCounterLoading(false);
      }
    };
    hitCounter();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
      let current = "home";
      sections.forEach((sec) => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { const t = setInterval(() => setLiveDot((v) => !v), 900); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setAdVariant((v) => (v + 1) % 3), 5000); return () => clearInterval(t); }, []);

  const scrollToSection = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };

  const openModal = (preMode?: string) => {
    setStep("form");
    setName(""); setWhatsapp(""); setStudentClass(""); setBoard("");
    setMedium("English"); setSchoolName(""); setAddress(""); setMode(preMode ?? "");
    setPayError("");
    setSubmitting(false);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

 // Replace your entire handleSubmit in page.tsx with this clean version.
// No isMobile, no intentUrl — just PG_CHECKOUT for all devices.

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (submitting) return;
  setSubmitting(true);
  setPayError("");

  try {
    const res = await fetch("/api/phonepe/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: pay?.offer,
        name,
        phone: whatsapp,
        studentClass,
        board,
        medium,
        schoolName,
        address,
        mode,
      }),
    });

    const data = await res.json();

    if (!data.success || !data.redirectUrl) {
      setPayError(data.error?.message || "Could not initiate payment. Please try again.");
      setSubmitting(false);
      return;
    }

    // Save registration data so payment/status page can submit to Google Sheet
    sessionStorage.setItem(
      `ym_reg_${data.merchantTransactionId}`,
      JSON.stringify({ name, whatsapp, studentClass, board, medium, schoolName, address, mode })
    );

    // Redirect to PhonePe hosted checkout (works on both mobile and desktop)
    window.location.href = data.redirectUrl;

  } catch {
    setPayError("Network error. Please try again.");
    setSubmitting(false);
  }
};

  const pay = studentClass ? PAYMENT.classes[studentClass as keyof typeof PAYMENT.classes] : null;
  const discount = pay ? Math.round(((pay.original - pay.offer) / pay.original) * 100) : 0;

  useEffect(() => {
    if (step !== "done" || !pay?.whatsapp) return;
    setCountdown(3);
    window.open(pay.whatsapp, "_blank", "noopener,noreferrer");
    let c = 3;
    const t = setInterval(() => { c -= 1; setCountdown(c); if (c <= 0) clearInterval(t); }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const displayCount = (count: number | null) => { if (count === null) return "—"; return count.toLocaleString("en-IN"); };
  const realOffer = (cls: string) => { const p = PAYMENT.classes[cls as keyof typeof PAYMENT.classes]; return p.offer === 1 ? p.original : p.offer; };

  const adVariants = [
    <div key="v1" className="ym-ad-card ym-ad-dark">
      <div className="ym-ad-content">
        <p className="ym-ad-eyebrow">📢 Enrollment Open Now</p>
        <h3 className="ym-ad-headline">Online Classes Starting<br /><span className="ym-ad-accent">3rd June 2026</span></h3>
        <p className="ym-ad-sub">Class 10 · 11 · 12 &nbsp;|&nbsp; Via Google Meet</p>
      </div>
      <div className="ym-ad-cta">
        <div className="ym-ad-badge"><p className="ym-ad-badge-label">Limited Seats</p><p className="ym-ad-badge-val">🔥 Enroll Fast</p></div>
        <button onClick={() => openModal()} className="ym-btn-yellow">Register Now →</button>
      </div>
    </div>,
    <div key="v2" className="ym-ad-card ym-ad-indigo">
      <div className="ym-ad-content">
        <span className="ym-ad-pill">🚀 Accepting Registrations</span>
        <h3 className="ym-ad-headline" style={{ marginTop: "12px" }}>Mathematics Coaching<br /><span className="ym-ad-accent">Start 3rd June 2026</span></h3>
        <p className="ym-ad-sub">Google Meet · Class 10 / 11 / 12</p>
      </div>
      <div className="ym-ad-cta">
        <p className="ym-ad-urgency">⚡ Don't miss out — seats limited!</p>
        <button onClick={() => openModal()} className="ym-btn-yellow">Register Now →</button>
      </div>
    </div>,
    <div key="v3" className="ym-ad-card ym-ad-white">
      <div className="ym-ad-stripe" />
      <div className="ym-ad-content" style={{ flex: 1 }}>
        <p className="ym-ad-eyebrow" style={{ color: "#2563eb" }}>📣 Announcement</p>
        <h3 className="ym-ad-headline" style={{ color: "#111827" }}>Online Classes Start<br /><span style={{ color: "#1d4ed8" }}>3rd June 2026</span></h3>
        <p className="ym-ad-sub" style={{ color: "#6b7280" }}>Class 10, 11 & 12 · Google Meet · Live</p>
      </div>
      <div className="ym-ad-cta">
        <div className="ym-ad-white-badge"><p>Limited Seats 🔥</p></div>
        <button onClick={() => openModal()} className="ym-btn-blue-solid">Register Now →</button>
      </div>
    </div>,
  ];

  return (
    <main id="home" className="ym-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #060f2e; --navy-mid: #0d1b4b; --blue-bright: #1d4ed8; --blue-light: #3b82f6;
          --gold: #f59e0b; --gold-light: #fcd34d; --gold-pale: #fef3c7; --white: #ffffff;
          --gray-50: #f9fafb; --gray-100: #f3f4f6; --gray-200: #e5e7eb; --gray-400: #9ca3af;
          --gray-500: #6b7280; --gray-600: #4b5563; --gray-700: #374151; --gray-800: #1f2937;
          --gray-900: #111827; --green: #16a34a; --green-light: #dcfce7; --red: #dc2626;
          --red-light: #fee2e2; --radius-sm: 8px; --radius-md: 12px; --radius-lg: 20px;
          --radius-xl: 28px; --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.1); --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
          --purple: #5b21b6;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; color: var(--gray-900); background: #fff; }
        .ym-page { font-family: 'Outfit', sans-serif; }
        .ym-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        /* ── NAVBAR ── */
        .ym-nav { position: sticky; top: 0; z-index: 100; background: rgba(6,15,46,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); transition: box-shadow 0.3s; }
        .ym-nav.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .ym-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .ym-nav-logo { width: 38px; height: 38px; object-fit: contain; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: #ffffff; }
        .ym-nav-name { font-weight: 700; font-size: 15px; color: #fff; line-height: 1.2; }
        .ym-nav-sub { font-size: 10px; color: #93c5fd; font-weight: 400; }
        .ym-nav-links { display: flex; align-items: center; gap: 2px; }
        .ym-nav-link { padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.2s; background: transparent; border: none; text-decoration: none; }
        .ym-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .ym-nav-link.active { color: #fff; background: rgba(59,130,246,0.2); }
        .ym-nav-link.active-dot { position: relative; }
        .ym-nav-link.active-dot::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }
        .ym-nav-enroll { background: linear-gradient(135deg, #1d4ed8, #1e40af); color: #fff; padding: 8px 18px; border-radius: 9px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .ym-nav-enroll:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-1px); }
        .ym-hamburger { display: none; background: transparent; border: none; cursor: pointer; padding: 6px; flex-direction: column; gap: 5px; }
        .ym-hamburger span { display: block; width: 20px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; }
        .ym-mobile-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: rgba(6,15,46,0.98); backdrop-filter: blur(20px); z-index: 99; flex-direction: column; padding: 20px; gap: 6px; overflow-y: auto; }
        .ym-mobile-menu.open { display: flex; }
        .ym-mobile-link { padding: 13px 16px; border-radius: 11px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8); cursor: pointer; background: transparent; border: none; text-align: left; transition: all 0.2s; }
        .ym-mobile-link:hover, .ym-mobile-link.active { background: rgba(59,130,246,0.15); color: #fff; }
        .ym-mobile-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 6px 0; }
        @media (max-width: 900px) { .ym-nav-links { display: none; } .ym-hamburger { display: flex; } }
        @media (max-width: 500px) { .ym-nav-enroll { font-size: 11px; padding: 7px 12px; } .ym-nav-name { font-size: 13px; } .ym-nav-sub { display: none; } }

        /* ── HERO ── */
        @keyframes heroShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes floatUp { 0%,100%{transform:translateY(0) rotate(0deg); opacity:0.06} 50%{transform:translateY(-20px) rotate(6deg); opacity:0.11} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.4)} 50%{box-shadow:0 0 0 12px rgba(245,158,11,0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes countUp { from{opacity:0;transform:translateY(10px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .hero-section { background: linear-gradient(135deg, #060f2e 0%, #0d1b4b 40%, #0f2d6b 65%, #0d1b4b 85%, #060f2e 100%); background-size: 300% 300%; animation: heroShift 14s ease infinite; clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%); position: relative; overflow: hidden; padding: 64px 20px 110px; }
        .math-sym { position: absolute; color: #fff; font-weight: 900; pointer-events: none; animation: floatUp ease-in-out infinite; font-family: 'Cormorant Garamond', serif; }
        .hero-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 48px; }
        .hero-left { flex: 1; min-width: 0; }
        .hero-right { width: 290px; flex-shrink: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); border-radius: 100px; padding: 6px 14px; margin-bottom: 18px; }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
        .hero-badge-text { color: #fcd34d; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; }
        .hero-h1 { font-size: clamp(2rem, 4.5vw, 3.4rem); font-weight: 800; color: #fff; line-height: 1.08; margin-bottom: 14px; }
        .hero-h1-accent { color: var(--gold); }
        .hero-tagline-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .hero-tagline-line { height: 1px; width: 28px; background: rgba(245,158,11,0.5); flex-shrink: 0; }
        .hero-tagline { color: rgba(253,211,77,0.8); font-style: italic; font-size: 13px; }
        .hero-desc { color: #bfdbfe; font-size: 15px; line-height: 1.7; max-width: 460px; margin-bottom: 28px; }
        .hero-btns { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 36px; }
        .ym-btn-gold { background: var(--gold); color: #1a0a00; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; animation: glowPulse 2.4s ease infinite; }
        .ym-btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
        .ym-btn-ghost { background: rgba(255,255,255,0.07); color: #fff; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; transition: all 0.2s; }
        .ym-btn-ghost:hover { background: rgba(255,255,255,0.12); }
        .hero-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-stat { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; text-align: center; flex: 1; min-width: 80px; }
        .hero-stat-num { font-family: 'Cormorant Garamond', serif; color: var(--gold-light); font-weight: 700; font-size: 20px; line-height: 1; margin-bottom: 3px; }
        .hero-stat-label { color: #93c5fd; font-size: 10px; font-weight: 500; }
        .hero-card { background: rgba(255,255,255,0.07); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.13); border-radius: 20px; padding: 22px; position: relative; overflow: hidden; }
        .hero-card-glow { position: absolute; top: -30px; right: -30px; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%); pointer-events: none; }
        .hero-card-avatar { width: 52px; height: 52px; border-radius: 12px; background: var(--gold); color: #1a0a00; font-size: 17px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hero-card-name { color: #fff; font-weight: 700; font-size: 15px; }
        .hero-card-degree { color: #bfdbfe; font-size: 11px; margin-top: 2px; }
        .hero-card-iit { color: var(--gold); font-size: 11px; font-weight: 600; }
        .hero-card-row { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 8px 12px; }
        .hero-card-row-label { color: #fff; font-size: 11px; font-weight: 600; line-height: 1; }
        .hero-card-row-val { color: #93c5fd; font-size: 10px; margin-top: 2px; }
        .hero-card-btn { width: 100%; background: var(--gold); color: #1a0a00; font-weight: 800; padding: 11px; border-radius: 10px; border: none; cursor: pointer; font-size: 13px; transition: all 0.2s; margin-top: 16px; }
        .hero-card-btn:hover { background: var(--gold-light); }
        .fade-up-1 { animation: fadeUp 0.6s ease both 0.1s; }
        .fade-up-2 { animation: fadeUp 0.6s ease both 0.2s; }
        .fade-up-3 { animation: fadeUp 0.6s ease both 0.35s; }
        .fade-up-4 { animation: fadeUp 0.6s ease both 0.5s; }
        .fade-up-5 { animation: fadeUp 0.6s ease both 0.65s; }
        @media (max-width: 860px) {
          .hero-section { padding: 48px 16px 90px; clip-path: polygon(0 0, 100% 0, 100% 97%, 0 100%); }
          .hero-inner { flex-direction: column; gap: 32px; }
          .hero-right { width: 100%; max-width: 380px; margin: 0 auto; }
          .hero-h1 { font-size: clamp(1.7rem, 6vw, 2.4rem); }
          .hero-desc { font-size: 14px; }
          .ym-btn-gold, .ym-btn-ghost { padding: 12px 22px; font-size: 14px; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 36px 14px 80px; }
          .hero-h1 { font-size: clamp(1.5rem, 7vw, 2rem); }
        }

        /* ── SECTIONS ── */
        .ym-section { padding: 80px 20px; }
        .ym-section-inner { max-width: 1100px; margin: 0 auto; }
        .ym-section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 14px; }
        .ym-section-tag.green { background: #dcfce7; color: #15803d; }
        .ym-section-tag.blue { background: #dbeafe; color: #1d4ed8; }
        .ym-section-tag.orange { background: #ffedd5; color: #c2410c; }
        .ym-section-tag.gold { background: #fef3c7; color: #92400e; }
        .ym-section-h2 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; color: var(--gray-900); margin-bottom: 10px; }
        .ym-section-line { width: 48px; height: 4px; border-radius: 2px; margin: 0 auto 14px; }
        .ym-section-desc { color: var(--gray-500); font-size: 15px; max-width: 500px; margin: 0 auto; line-height: 1.7; }
        .ym-section-head { text-align: center; margin-bottom: 48px; }

        /* ── AD BANNER ── */
        .ym-ad-section { background: var(--gray-50); border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); padding: 28px 20px; position: relative; }
        .ym-live-pill { position: absolute; top: 10px; left: 16px; display: flex; align-items: center; gap: 5px; background: #fff; border: 1px solid #fecaca; border-radius: 100px; padding: 4px 10px; box-shadow: var(--shadow-sm); z-index: 10; }
        .ym-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; transition: opacity 0.4s; }
        .ym-live-text { font-size: 10px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.06em; }
        .ym-ad-inner { max-width: 1100px; margin: 0 auto; padding-top: 24px; }
        .ym-ad-dots { display: flex; justify-content: center; gap: 7px; margin-bottom: 14px; }
        .ym-ad-dot { width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-ad-card { width: 100%; border-radius: 18px; overflow: hidden; display: flex; flex-direction: row; min-height: 170px; animation: fadeIn 0.4s ease; }
        .ym-ad-dark { background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%); box-shadow: var(--shadow-md); }
        .ym-ad-indigo { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%); box-shadow: var(--shadow-md); }
        .ym-ad-white { background: #fff; border: 1px solid var(--gray-200); box-shadow: var(--shadow-md); display: flex; flex-direction: row; }
        .ym-ad-stripe { width: 5px; background: #2563eb; flex-shrink: 0; }
        .ym-ad-content { flex: 1; padding: 28px 32px; display: flex; flex-direction: column; justify-content: center; }
        .ym-ad-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #bfdbfe; margin-bottom: 8px; }
        .ym-ad-headline { font-size: clamp(1.3rem, 2.5vw, 2rem); font-weight: 800; color: #fff; line-height: 1.15; }
        .ym-ad-accent { color: var(--gold-light); }
        .ym-ad-sub { color: #bfdbfe; font-size: 13px; margin-top: 7px; }
        .ym-ad-pill { display: inline-block; background: rgba(99,102,241,0.35); color: #c7d2fe; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px; }
        .ym-ad-urgency { color: #fcd34d; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
        .ym-ad-cta { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px 28px; background: rgba(255,255,255,0.08); flex-shrink: 0; min-width: 185px; }
        .ym-ad-badge { border: 2px solid #fcd34d; border-radius: 12px; padding: 10px 16px; text-align: center; }
        .ym-ad-badge-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fcd34d; margin-bottom: 3px; }
        .ym-ad-badge-val { font-size: 16px; font-weight: 800; color: #fff; }
        .ym-ad-white-badge { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px 14px; color: #1d4ed8; font-size: 12px; font-weight: 700; text-align: center; }
        .ym-btn-yellow { background: var(--gold); color: #1a0a00; padding: 10px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .ym-btn-yellow:hover { background: var(--gold-light); }
        .ym-btn-blue-solid { background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .ym-btn-blue-solid:hover { background: #1d4ed8; }
        @media (max-width: 640px) { .ym-ad-card { flex-direction: column; } .ym-ad-cta { padding: 16px; min-width: unset; background: rgba(255,255,255,0.05); } .ym-ad-stripe { width: 100%; height: 4px; } .ym-ad-content { padding: 20px; } }

        /* ── CLASSES ── */
        .ym-classes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .ym-class-card { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 18px; padding: 24px 20px; text-align: center; transition: all 0.25s; box-shadow: var(--shadow-sm); }
        .ym-class-card:hover { border-color: #93c5fd; box-shadow: var(--shadow-md); transform: translateY(-3px); }
        .ym-class-card.featured { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1), var(--shadow-md); }
        .ym-class-icon { font-size: 36px; margin-bottom: 12px; }
        .ym-class-name { font-size: 20px; font-weight: 800; color: var(--gray-900); margin-bottom: 3px; }
        .ym-class-days { color: var(--gray-500); font-size: 13px; margin-bottom: 2px; }
        .ym-class-time { color: var(--gray-400); font-size: 12px; margin-bottom: 18px; }
        .ym-class-price-row { display: flex; align-items: baseline; justify-content: center; gap: 6px; margin-bottom: 18px; }
        .ym-class-price { font-size: 26px; font-weight: 800; color: #2563eb; }
        .ym-class-price-unit { font-size: 13px; color: var(--gray-400); }
        .ym-class-btn { width: 100%; padding: 11px; border-radius: 11px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-class-btn-primary { background: #2563eb; color: #fff; }
        .ym-class-btn-primary:hover { background: #1d4ed8; }
        .ym-class-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-bottom: 10px; }
        @media (max-width: 760px) { .ym-classes-grid { grid-template-columns: 1fr; max-width: 380px; margin-left: auto; margin-right: auto; } }
        @media (min-width: 560px) and (max-width: 760px) { .ym-classes-grid { grid-template-columns: repeat(2, 1fr); max-width: 100%; } }

        /* ── SLOTS ── */
        .ym-slots-wrap { max-width: 640px; margin: 0 auto; }
        .ym-slots-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; background: #2563eb; color: #fff; padding: 14px 22px; border-radius: 14px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: background 0.2s; margin-bottom: 10px; }
        .ym-slots-toggle:hover { background: #1d4ed8; }
        .ym-slots-body { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; }
        .ym-slot-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 11px; border: 1px solid var(--gray-200); background: #fff; font-weight: 600; font-size: 14px; color: var(--gray-800); cursor: pointer; transition: all 0.2s; }
        .ym-slot-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .ym-slot-btn:hover:not(.active) { border-color: #93c5fd; }
        .ym-slot-detail { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 11px; padding: 14px 18px; margin-top: 5px; display: flex; flex-direction: column; gap: 10px; }
        .ym-slot-row { display: flex; align-items: flex-start; gap: 10px; }
        .ym-slot-row-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .ym-slot-row-label { font-weight: 600; color: #1e40af; font-size: 13px; }
        .ym-slot-row-sub { color: #3b82f6; font-size: 11px; margin-top: 2px; }

        /* ── OFFLINE ── */
        .ym-offline-section { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%); border-top: 1px solid #fed7aa; border-bottom: 1px solid #fed7aa; }
        .ym-offline-card { background: #fff; border: 1.5px solid #fed7aa; border-radius: 24px; padding: 48px 40px; text-align: center; box-shadow: var(--shadow-sm); max-width: 580px; margin: 0 auto; }
        .ym-offline-loc { display: inline-flex; align-items: center; gap: 6px; color: #c2410c; font-weight: 700; font-size: 16px; margin-bottom: 10px; }
        .ym-btn-orange { background: #ea580c; color: #fff; padding: 13px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-btn-orange:hover { background: #c2410c; }

        /* ── WHY US ── */
        .ym-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .ym-why-card { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 18px; padding: 24px; transition: all 0.25s; box-shadow: var(--shadow-sm); }
        .ym-why-card:hover { border-color: #93c5fd; box-shadow: var(--shadow-md); transform: translateY(-3px); }
        .ym-why-icon { font-size: 32px; margin-bottom: 12px; }
        .ym-why-title { font-size: 16px; font-weight: 700; color: var(--gray-900); margin-bottom: 7px; }
        .ym-why-desc { color: var(--gray-500); font-size: 13px; line-height: 1.65; }
        @media (max-width: 760px) { .ym-why-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .ym-why-grid { grid-template-columns: 1fr; } }

        /* ── ABOUT ── */
        .ym-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .ym-about-text p { color: var(--gray-600); font-size: 16px; line-height: 1.8; margin-bottom: 18px; }
        .ym-about-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ym-about-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 18px; text-align: center; }
        .ym-about-card-icon { font-size: 26px; margin-bottom: 7px; }
        .ym-about-card-label { font-weight: 700; color: #1e3a8a; font-size: 13px; }
        .ym-about-card-sub { color: #3b82f6; font-size: 11px; margin-top: 3px; }
        @media (max-width: 760px) { .ym-about-grid { grid-template-columns: 1fr; gap: 36px; } }

        /* ── VISITOR SECTION ── */
        .ym-visitor-section { background: linear-gradient(135deg, #060f2e 0%, #0d1b4b 50%, #0a1f5e 100%); padding: 56px 20px; position: relative; overflow: hidden; }
        .ym-visitor-section::before { content: ''; position: absolute; top: -60px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%); pointer-events: none; }
        .ym-visitor-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 28px; position: relative; z-index: 1; }
        .ym-visitor-eyebrow { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 5px 14px; color: #93c5fd; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
        .ym-visitor-title { color: #fff; font-size: clamp(1.2rem, 2.5vw, 1.7rem); font-weight: 700; margin-bottom: 5px; text-align: center; }
        .ym-visitor-subtitle { color: rgba(255,255,255,0.4); font-size: 13px; text-align: center; }
        .ym-visitor-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 36px 52px; display: flex; align-items: center; gap: 20px; box-shadow: 0 8px 40px rgba(0,0,0,0.25); min-width: 280px; }
        .ym-visitor-card-dot { width: 12px; height: 12px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        @keyframes visitorPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .ym-visitor-card-dot.error { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); animation: none; }
        .ym-visitor-card-divider { width: 1px; height: 52px; background: rgba(255,255,255,0.12); }
        .ym-visitor-card-count { font-size: clamp(2.6rem, 7vw, 4.2rem); font-weight: 800; color: #fff; line-height: 1; font-family: 'Cormorant Garamond', serif; animation: countUp 0.6s ease both; }
        .ym-visitor-card-label { color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 5px; }
        .ym-visitor-stats { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .ym-visitor-stat-pill { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 11px; padding: 9px 14px; }
        .ym-visitor-stat-pill-icon { font-size: 14px; }
        .ym-visitor-stat-pill-text { color: rgba(255,255,255,0.5); font-size: 12px; }
        .ym-visitor-stat-pill-val { color: #fff; font-weight: 700; font-size: 12px; }
        .ym-visitor-poweredby { color: rgba(255,255,255,0.18); font-size: 10px; text-align: center; }
        @media (max-width: 460px) { .ym-visitor-card { padding: 24px 28px; min-width: unset; flex-direction: column; text-align: center; gap: 14px; } .ym-visitor-card-divider { display: none; } }

        /* ── CONTACT ── */
        .ym-contact-section { background: var(--navy); }
        .ym-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
        .ym-contact-info h3 { color: #fff; font-size: 24px; font-weight: 700; margin-bottom: 7px; }
        .ym-contact-tagline { color: #fcd34d; font-style: italic; font-size: 14px; margin-bottom: 28px; }
        .ym-contact-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .ym-contact-icon { width: 40px; height: 40px; border-radius: 11px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .ym-contact-val { color: #fff; font-size: 14px; font-weight: 500; }
        .ym-contact-val a { color: #93c5fd; text-decoration: none; }
        .ym-contact-val a:hover { color: #fff; }
        .ym-contact-sub { color: rgba(255,255,255,0.4); font-size: 11px; }
        .ym-contact-cta { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
        .ym-contact-cta-title { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 3px; }
        .ym-contact-cta-sub { color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 6px; }
        .ym-contact-enroll-btn { width: 100%; background: var(--gold); color: #1a0a00; padding: 15px; border-radius: 13px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-contact-enroll-btn:hover { background: var(--gold-light); }
        @media (max-width: 760px) { .ym-contact-grid { grid-template-columns: 1fr; gap: 32px; } }

        /* ── FOOTER ── */
        .ym-footer { background: #030a1f; color: rgba(255,255,255,0.5); padding: 44px 20px 22px; }
        .ym-footer-inner { max-width: 1100px; margin: 0 auto; }
        .ym-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 36px; margin-bottom: 36px; }
        .ym-footer-brand-name { color: #fff; font-weight: 700; font-size: 18px; margin-bottom: 5px; }
        .ym-footer-brand-tagline { color: #fcd34d; font-style: italic; font-size: 12px; margin-bottom: 10px; }
        .ym-footer-brand-desc { font-size: 12px; line-height: 1.7; }
        .ym-footer-badges { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
        .ym-footer-badge { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 7px; padding: 5px 10px; font-size: 11px; }
        .ym-footer-h4 { color: rgba(255,255,255,0.75); font-weight: 600; font-size: 13px; margin-bottom: 12px; }
        .ym-footer-item { font-size: 12px; margin-bottom: 7px; line-height: 1.5; }
        .ym-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin-bottom: 18px; }
        .ym-footer-visitor-bar { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 24px; margin-bottom: 24px; flex-wrap: wrap; }
        .ym-footer-visitor-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        .ym-footer-visitor-dot.error { background: #f59e0b; animation: none; }
        .ym-footer-visitor-count { color: #fff; font-weight: 700; font-size: 18px; font-family: 'Cormorant Garamond', serif; }
        .ym-footer-visitor-label { color: rgba(255,255,255,0.35); font-size: 12px; }
        .ym-footer-visitor-sep { color: rgba(255,255,255,0.13); font-size: 16px; }
        .ym-skeleton { display: inline-block; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% auto; animation: skeletonShimmer 1.5s linear infinite; border-radius: 4px; height: 1em; width: 40px; vertical-align: middle; }
        @keyframes skeletonShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .ym-footer-policy-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; margin-bottom: 14px; }
        .ym-footer-policy-link { font-size: 11px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; padding: 4px 12px; border-right: 1px solid rgba(255,255,255,0.1); }
        .ym-footer-policy-link:last-child { border-right: none; }
        .ym-footer-policy-link:hover { color: #93c5fd; }
        .ym-footer-copy { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 11px; text-align: center; }
        @media (max-width: 760px) { .ym-footer-grid { grid-template-columns: 1fr; gap: 28px; } }

        /* ── MODAL ── */
        .ym-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 14px; backdrop-filter: blur(4px); }
        .ym-modal { background: #fff; border-radius: 24px; width: 100%; max-width: 460px; box-shadow: 0 24px 80px rgba(0,0,0,0.3); overflow: hidden; max-height: 94vh; overflow-y: auto; position: relative; }
        .ym-modal-head { background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%); padding: 24px 28px 20px; color: #fff; position: sticky; top: 0; z-index: 10; }
        .ym-modal-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 30px; height: 30px; border-radius: 7px; font-size: 17px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .ym-modal-close:hover { background: rgba(255,255,255,0.25); }
        .ym-modal-steps { display: flex; align-items: center; gap: 7px; margin-bottom: 16px; }
        .ym-modal-step { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.3s; }
        .ym-modal-step.current { background: var(--gold); color: #1a0a00; }
        .ym-modal-step.done { background: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .ym-modal-step.future { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .ym-modal-step-line { flex: 1; height: 2px; border-radius: 1px; max-width: 36px; }
        .ym-modal-step-line.done { background: rgba(255,255,255,0.3); }
        .ym-modal-step-line.future { background: rgba(255,255,255,0.1); }
        .ym-modal-emoji { font-size: 28px; margin-bottom: 7px; }
        .ym-modal-title { font-size: 20px; font-weight: 800; }
        .ym-modal-sub { color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 3px; }
        .ym-modal-body { padding: 24px 28px 28px; }
        .ym-form-info { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 11px; padding: 10px 14px; display: flex; gap: 7px; font-size: 12px; color: #1e40af; margin-bottom: 18px; }
        .ym-form-label { font-size: 11px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; display: block; }
        .ym-form-group { display: flex; flex-direction: column; }
        .ym-input { width: 100%; border: 1.5px solid var(--gray-200); padding: 11px 14px; border-radius: 11px; font-size: 14px; font-family: 'Outfit', sans-serif; color: var(--gray-900); outline: none; transition: border-color 0.2s; background: #fff; }
        .ym-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .ym-input::placeholder { color: var(--gray-400); }
        .ym-form-stack { display: flex; flex-direction: column; gap: 12px; }
        .ym-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ym-policy-text { font-size: 11px; color: var(--gray-400); text-align: center; line-height: 1.6; }
        .ym-policy-text a { color: #3b82f6; text-decoration: none; }
        .ym-submit-btn { width: 100%; background: #2563eb; color: #fff; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; margin-top: 3px; }
        .ym-submit-btn:hover { background: #1d4ed8; }
        .ym-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── PAYMENT STEP ── */
        .ym-pay-summary { background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ym-pay-class { font-size: 11px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
        .ym-pay-amount { font-size: 26px; font-weight: 800; color: #1d4ed8; }
        .ym-pay-unit { font-size: 12px; color: var(--gray-400); }
        .ym-pay-discount { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 10px; text-align: center; }
        .ym-confirm-btn { width: 100%; background: #5b21b6; color: #fff; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ym-confirm-btn:hover:not(:disabled) { background: #4c1d95; }
        .ym-confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-err { background: #fee2e2; border: 1px solid #fecaca; border-radius: 11px; padding: 11px 14px; color: #dc2626; font-size: 13px; text-align: center; margin-top: 10px; }
        .ym-pay-secure { text-align: center; margin-top: 12px; font-size: 11px; color: var(--gray-400); }
        .ym-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

        /* ── DONE ── */
        .ym-done-wrap { text-align: center; padding: 14px 0; }
        .ym-done-confetti { font-size: 52px; margin-bottom: 14px; }
        .ym-done-name { font-size: 20px; font-weight: 800; color: var(--gray-900); margin-bottom: 5px; }
        .ym-done-sub { color: var(--gray-500); font-size: 14px; margin-bottom: 20px; }
        .ym-done-wa-box { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 16px; margin-bottom: 18px; }
        .ym-done-wa-title { color: #15803d; font-weight: 700; font-size: 14px; margin-bottom: 3px; }
        .ym-done-wa-sub { color: #16a34a; font-size: 12px; }
        .ym-done-wa-btn { width: 100%; background: #16a34a; color: #fff; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 7px; margin-bottom: 12px; transition: background 0.2s; }
        .ym-done-wa-btn:hover { background: #15803d; }
        .ym-done-close-btn { width: 100%; background: var(--gray-100); color: var(--gray-700); padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .ym-done-close-btn:hover { background: var(--gray-200); }
      `}</style>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav className={`ym-nav${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="ym-nav-inner">
          <a href="#home" className="ym-nav-brand" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
            <img src="/Logo.png" alt="Yarwng Mathematics Logo" className="ym-nav-logo" />
            <div>
              <div className="ym-nav-name">Yarwng Mathematics</div>
              <div className="ym-nav-sub">Rakesh Debbarma · M.Sc, IIT Delhi</div>
            </div>
          </a>
          <div className="ym-nav-links" role="menubar">
            {NAV_LINKS.map((l) => (
              <button key={l.id} role="menuitem" onClick={() => scrollToSection(l.id)}
                className={`ym-nav-link${activeSection === l.id ? " active active-dot" : ""}`}
                aria-current={activeSection === l.id ? "page" : undefined}>
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => openModal()} className="ym-nav-enroll">Enroll Now →</button>
            <button className="ym-hamburger" onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
              <span style={{ transform: mobileMenuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
              <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ transform: mobileMenuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`ym-mobile-menu${mobileMenuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        {NAV_LINKS.map((l) => (
          <button key={l.id} onClick={() => scrollToSection(l.id)} className={`ym-mobile-link${activeSection === l.id ? " active" : ""}`}>
            {l.label}
          </button>
        ))}
        <div className="ym-mobile-divider" />
        <button onClick={() => { openModal(); setMobileMenuOpen(false); }} className="ym-nav-enroll" style={{ borderRadius: "11px", padding: "14px" }}>
          Enroll Now →
        </button>
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hero-section" aria-label="Hero — Yarwng Mathematics">
        {[
          { sym: "∑", top: "10%", left: "3%", size: 44, dur: "7s", delay: "0s" },
          { sym: "π", top: "12%", left: "88%", size: 38, dur: "9s", delay: "1.2s" },
          { sym: "∫", top: "58%", left: "5%", size: 32, dur: "8s", delay: "2s" },
          { sym: "√", top: "68%", left: "83%", size: 38, dur: "10s", delay: "0.5s" },
          { sym: "∞", top: "32%", left: "91%", size: 26, dur: "6s", delay: "3s" },
          { sym: "Δ", top: "78%", left: "14%", size: 22, dur: "11s", delay: "1.8s" },
        ].map((s, i) => (
          <span key={i} className="math-sym" aria-hidden="true" style={{ top: s.top, left: s.left, fontSize: s.size, animationDuration: s.dur, animationDelay: s.delay }}>{s.sym}</span>
        ))}
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge fade-up-1">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">Mathematics · English Medium</span>
            </div>
            <h1 className="hero-h1 fade-up-2">Master Mathematics<br /><span className="hero-h1-accent">With Confidence</span></h1>
            <div className="hero-tagline-row fade-up-3">
              <div className="hero-tagline-line" />
              <p className="hero-tagline">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
              <div className="hero-tagline-line" />
            </div>
            <p className="hero-desc fade-up-3">Expert coaching for <strong style={{ color: "#fff" }}>Class 10, 11 & 12</strong> by an IIT Delhi graduate — Online via Google Meet & Offline at Khumulwng.</p>
            <div className="hero-btns fade-up-4">
              <button onClick={() => openModal()} className="ym-btn-gold">Enroll Khwlaidi →</button>
              <button onClick={() => scrollToSection("classes")} className="ym-btn-ghost">View Schedule</button>
            </div>
            <div className="hero-stats fade-up-5">
              {[
                { num: "3", label: "Classes" },
                { num: "IIT", label: "Delhi Alumni" },
                { num: "2hrs", label: "Per Session" },
                { num: "∞", label: "Doubt Support" },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <p className="hero-stat-num">{s.num}</p>
                  <p className="hero-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right fade-up-2">
            <div className="hero-card">
              <div className="hero-card-glow" />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", position: "relative" }}>
                <div className="hero-card-avatar">RD</div>
                <div>
                  <p className="hero-card-name">Rakesh Debbarma</p>
                  <p className="hero-card-degree">M.Sc Mathematics</p>
                  <p className="hero-card-iit">IIT Delhi</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px", position: "relative" }}>
                {[
                  { icon: "🟢", label: "Online", val: "Google Meet · Live" },
                  { icon: "🏫", label: "Offline", val: "Khumulwng (Soon)" },
                  { icon: "📅", label: "Schedule", val: "Structured weekly" },
                  { icon: "💬", label: "Support", val: "WhatsApp batches" },
                ].map((r) => (
                  <div key={r.label} className="hero-card-row">
                    <span style={{ fontSize: "14px" }}>{r.icon}</span>
                    <div>
                      <p className="hero-card-row-label">{r.label}</p>
                      <p className="hero-card-row-val">{r.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => openModal()} className="hero-card-btn">🚀 Classes Start 3rd June 2026</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ LIVE AD BANNER ══════════════════ */}
      <div className="ym-ad-section">
        <div className="ym-live-pill">
          <span className="ym-live-dot" style={{ opacity: liveDot ? 1 : 0.15 }} />
          <span className="ym-live-text">Live</span>
        </div>
        <div className="ym-ad-inner">
          <div className="ym-ad-dots">
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => setAdVariant(i)} className="ym-ad-dot"
                style={{ background: adVariant === i ? "#2563eb" : "#d1d5db" }} aria-label={`Ad variant ${i + 1}`} />
            ))}
          </div>
          {adVariants[adVariant]}
        </div>
      </div>

      {/* ══════════════════ CLASSES ══════════════════ */}
      <section id="classes" className="ym-section" style={{ background: "#fff" }}>
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag green">🟢 Currently via Google Meet</div>
            <h2 className="ym-section-h2">Online Classes</h2>
            <div className="ym-section-line" style={{ background: "#22c55e" }} />
            <p className="ym-section-desc">Live interactive sessions via Google Meet. Join from anywhere across India.</p>
          </div>
          <div className="ym-classes-grid">
            {Object.entries(PAYMENT.classes).map(([cls], idx) => (
              <div key={cls} className={`ym-class-card${idx === 1 ? " featured" : ""}`}>
                {idx === 1 && <div className="ym-class-badge">Most Popular</div>}
                <div className="ym-class-icon">{cls === "Class 10" ? "📘" : cls === "Class 11" ? "📙" : "📗"}</div>
                <h3 className="ym-class-name">{cls}</h3>
                <p className="ym-class-days">{SLOTS[cls as keyof typeof SLOTS].days}</p>
                <p className="ym-class-time">{SLOTS[cls as keyof typeof SLOTS].time}</p>
                <div className="ym-class-price-row">
                  <span className="ym-class-price">₹{realOffer(cls)}</span>
                  <span className="ym-class-price-unit">/month</span>
                </div>
                <button onClick={() => openModal()} className="ym-class-btn ym-class-btn-primary">Join {cls}</button>
              </div>
            ))}
          </div>

          {/* ── SLOTS ACCORDION ── */}
          <div className="ym-slots-wrap">
            <button onClick={() => { setSlotsOpen(!slotsOpen); setSelectedSlot(null); }} className="ym-slots-toggle">
              <span>📅 View Detailed Class Slots</span>
              <span style={{ fontSize: "20px" }}>{slotsOpen ? "−" : "+"}</span>
            </button>
            {slotsOpen && (
              <div className="ym-slots-body">
                {(["Class 10", "Class 11", "Class 12"] as const).map((cls) => {
                  const p = PAYMENT.classes[cls];
                  const offerPrice = p.offer === 1 ? p.original : p.offer;
                  return (
                    <div key={cls}>
                      <button onClick={() => setSelectedSlot(selectedSlot === cls ? null : cls)}
                        className={`ym-slot-btn${selectedSlot === cls ? " active" : ""}`}>
                        <span>{cls}</span>
                        <span>{selectedSlot === cls ? "▲" : "▼"}</span>
                      </button>
                      {selectedSlot === cls && (
                        <div className="ym-slot-detail">
                          <div className="ym-slot-row">
                            <span className="ym-slot-row-icon">📋</span>
                            <div style={{ flex: 1 }}>
                              <p className="ym-slot-row-label">What you'll learn</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "5px" }}>
                                {(SLOTS[cls].desc as string[]).map((item, i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                                    <span style={{ color: "#2563eb", fontSize: "15px", lineHeight: "1.4", flexShrink: 0 }}>›</span>
                                    <span style={{ color: "#1e40af", fontSize: "12px", lineHeight: "1.65" }}>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="ym-slot-row">
                            <span className="ym-slot-row-icon">📆</span>
                            <div>
                              <p className="ym-slot-row-label">{SLOTS[cls].days}</p>
                              <p className="ym-slot-row-sub">Every week</p>
                            </div>
                          </div>
                          <div className="ym-slot-row">
                            <span className="ym-slot-row-icon">🕐</span>
                            <div>
                              <p className="ym-slot-row-label">{SLOTS[cls].time}</p>
                              <p className="ym-slot-row-sub">Evening · 2 hours</p>
                            </div>
                          </div>
                          <div className="ym-slot-row">
                            <span className="ym-slot-row-icon">💰</span>
                            <div>
                              <p className="ym-slot-row-label">₹{offerPrice}/month</p>
                              <p className="ym-slot-row-sub">Regular: ₹{p.original}/month</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════ OFFLINE ══════════════════ */}
      <section className="ym-section ym-offline-section">
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag orange">🔔 Starting Soon</div>
            <h2 className="ym-section-h2">Offline Session</h2>
            <div className="ym-section-line" style={{ background: "#f97316" }} />
          </div>
          <div className="ym-offline-card">
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🏫</div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "7px" }}>Physical Classroom</h3>
            <div className="ym-offline-loc">📍 Khumulwng, Tripura</div>
            <p style={{ color: "#6b7280", marginBottom: "20px", maxWidth: "400px", margin: "0 auto 20px", lineHeight: 1.7, fontSize: "14px" }}>
              Face-to-face classes in a structured environment. Personalised attention. Details will be announced soon.
            </p>
            <div style={{ display: "inline-block", background: "#ffedd5", color: "#c2410c", padding: "7px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", marginBottom: "20px" }}>
              ⏳ Launching Soon — Limited Seats
            </div>
            <br />
            <button onClick={() => openModal("Offline")} className="ym-btn-orange">Register Interest</button>
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY US ══════════════════ */}
      <section id="why-us" className="ym-section" style={{ background: "linear-gradient(180deg, #f9fafb 0%, #fff 100%)" }}>
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag gold">⭐ Our Edge</div>
            <h2 className="ym-section-h2">What Makes Us Different</h2>
            <div className="ym-section-line" style={{ background: "#f59e0b" }} />
          </div>
          <div className="ym-why-grid">
            {[
              { icon: "🧠", title: "Conceptual Depth", desc: "We don't just teach formulas — we build intuition and deep understanding that lasts beyond exams." },
              { icon: "👨‍🏫", title: "IIT-Level Expertise", desc: "Faculty trained at one of India's premier institutes brings top-tier rigour to every class." },
              { icon: "🗓️", title: "Structured Timetable", desc: "Fixed weekly slots per class ensure consistency, discipline, and steady progress." },
              { icon: "💬", title: "WhatsApp Support", desc: "Doubt-clearing continues beyond class hours via dedicated WhatsApp groups for every batch." },
              { icon: "🖥️", title: "Google Meet Sessions", desc: "High-quality online classes via Google Meet — join from anywhere with a good connection." },
              { icon: "📝", title: "Regular Assessments", desc: "Frequent tests and detailed feedback help track progress and identify areas needing improvement." },
            ].map((item) => (
              <div key={item.title} className="ym-why-card">
                <div className="ym-why-icon">{item.icon}</div>
                <h3 className="ym-why-title">{item.title}</h3>
                <p className="ym-why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section id="about" className="ym-section" style={{ background: "#fff" }}>
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag blue">🎓 Our Story</div>
            <h2 className="ym-section-h2">Know About Yarwng Mathematics</h2>
            <div className="ym-section-line" style={{ background: "#2563eb" }} />
            <p className="ym-section-desc" style={{ fontStyle: "italic", color: "#2563eb" }}>"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
          </div>
          <div className="ym-about-grid">
            <div className="ym-about-text">
              <p><strong style={{ color: "#1d4ed8" }}>Yarwng Mathematics</strong> was founded to make advanced mathematics accessible and enjoyable for every student in Tripura and beyond.</p>
              <p>Led by <strong>Rakesh Debbarma</strong>, an M.Sc graduate from <strong>IIT Delhi</strong>, we bring world-class mathematical thinking to your doorstep.</p>
              <p>Our approach combines rigorous conceptual teaching, regular problem-solving, and personalised attention so every student grows confidently.</p>
              <button onClick={() => openModal()} className="ym-btn-gold" style={{ marginTop: "6px" }}>Start Learning Today →</button>
            </div>
            <div className="ym-about-cards">
              {[
                { icon: "🎓", label: "IIT Delhi Alumni", sub: "M.Sc Mathematics" },
                { icon: "📚", label: "Classes 10–12", sub: "Full syllabus coverage" },
                { icon: "🌐", label: "Online & Offline", sub: "Flexible modes" },
                { icon: "📈", label: "Proven Results", sub: "High scoring students" },
              ].map((card) => (
                <div key={card.label} className="ym-about-card">
                  <div className="ym-about-card-icon">{card.icon}</div>
                  <p className="ym-about-card-label">{card.label}</p>
                  <p className="ym-about-card-sub">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ VISITOR COUNTER ══════════════════ */}
      <section className="ym-visitor-section" aria-label="Visitor statistics">
        <div className="ym-visitor-inner">
          <div style={{ textAlign: "center" }}>
            <div className="ym-visitor-eyebrow"><span>🌐</span> Live Site Statistics</div>
            <h2 className="ym-visitor-title">People Who've Discovered Yarwng Mathematics</h2>
            <p className="ym-visitor-subtitle">Counter updates with every new visit</p>
          </div>
          <div className="ym-visitor-card">
            <span className={`ym-visitor-card-dot${counterError ? " error" : ""}`} />
            <div className="ym-visitor-card-divider" />
            <div>
              {counterLoading ? (
                <div className="ym-skeleton" style={{ width: 110, height: "3rem", borderRadius: 7 }} />
              ) : (
                <div className="ym-visitor-card-count">{displayCount(visitorCount)}</div>
              )}
              <div className="ym-visitor-card-label">
                {counterError ? "⚠️ Counter unavailable" : "total visitors since launch"}
              </div>
            </div>
          </div>
          <div className="ym-visitor-stats">
            {[
              { icon: "📅", text: "Classes start", val: "3rd June 2026" },
              { icon: "🎓", text: "Taught by", val: "IIT Delhi M.Sc" },
              { icon: "📍", text: "Based in", val: "Khumulwng, Tripura" },
            ].map((s) => (
              <div key={s.val} className="ym-visitor-stat-pill">
                <span className="ym-visitor-stat-pill-icon">{s.icon}</span>
                <span className="ym-visitor-stat-pill-text">{s.text}</span>
                <span className="ym-visitor-stat-pill-val">{s.val}</span>
              </div>
            ))}
          </div>
          <p className="ym-visitor-poweredby">Powered by counterapi.dev · increments on each visit</p>
        </div>
      </section>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section id="contact" className="ym-section ym-contact-section">
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag" style={{ background: "rgba(255,255,255,0.1)", color: "#93c5fd" }}>📬 Get In Touch</div>
            <h2 className="ym-section-h2" style={{ color: "#fff" }}>Contact Us</h2>
            <div className="ym-section-line" style={{ background: "#f59e0b" }} />
          </div>
          <div className="ym-contact-grid">
            <div className="ym-contact-info">
              <h3>Yarwng Mathematics</h3>
              <p className="ym-contact-tagline">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
              {[
                { icon: "👨‍🏫", val: "Rakesh Debbarma", sub: "M.Sc Mathematics, IIT Delhi" },
                { icon: "📱", val: <a href="tel:9366030347">9366030347</a>, sub: "WhatsApp available" },
                { icon: "✉️", val: <a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a>, sub: "" },
                { icon: "📍", val: "Khumulwng, Tripura", sub: "Offline classes launching soon" },
              ].map((r, i) => (
                <div key={i} className="ym-contact-row">
                  <div className="ym-contact-icon">{r.icon}</div>
                  <div>
                    <p className="ym-contact-val">{r.val}</p>
                    {r.sub && <p className="ym-contact-sub">{r.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="ym-contact-cta">
              <div>
                <p className="ym-contact-cta-title">Ready to Excel in Mathematics?</p>
                <p className="ym-contact-cta-sub">Classes start 3rd June 2026. Limited seats per batch. Enroll now to secure your spot.</p>
              </div>
              <button onClick={() => openModal()} className="ym-contact-enroll-btn">🚀 Enroll Now →</button>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                {["Class 10 · ₹600/mo", "Class 11 · ₹800/mo", "Class 12 · ₹900/mo"].map((t) => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "5px 10px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="ym-footer" role="contentinfo">
        <div className="ym-footer-inner">
          <div className="ym-footer-grid">
            <div>
              <p className="ym-footer-brand-name">Yarwng Mathematics</p>
              <p className="ym-footer-brand-tagline">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
              <p className="ym-footer-brand-desc">Professional Mathematics Coaching for Classes 10, 11 & 12. Conceptual clarity. Proven results. By Rakesh Debbarma, M.Sc IIT Delhi.</p>
              <div className="ym-footer-badges">
                <span className="ym-footer-badge"><span style={{ color: "#a78bfa", fontWeight: 700 }}>PhonePe</span><span>UPI</span></span>
                <span className="ym-footer-badge"><span style={{ color: "#34d399" }}>🔒 SSL</span><span>Secure</span></span>
              </div>
            </div>
            <div>
              <p className="ym-footer-h4">Contact</p>
              <p className="ym-footer-item">👨‍🏫 <strong style={{ color: "rgba(255,255,255,0.75)" }}>Rakesh Debbarma</strong></p>
              <p className="ym-footer-item">🎓 M.Sc Mathematics, IIT Delhi</p>
              <p className="ym-footer-item">📱 <a href="tel:9366030347" style={{ color: "#93c5fd", textDecoration: "none" }}>9366030347</a></p>
              <p className="ym-footer-item">✉️ <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#93c5fd", textDecoration: "none" }}>yarwngmathematics@gmail.com</a></p>
              <p className="ym-footer-item">📍 Khumulwng, Tripura</p>
            </div>
            <div>
              <p className="ym-footer-h4">Classes Offered</p>
              <p className="ym-footer-item">📘 Class 10 · Mon & Wed · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹600</span></p>
              <p className="ym-footer-item">📙 Class 11 · Tue & Fri · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹800</span></p>
              <p className="ym-footer-item">📗 Class 12 · Thu & Sat · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹900</span></p>
              <p className="ym-footer-item" style={{ color: "#fb923c", marginTop: "10px" }}>🏫 Offline: Khumulwng (Launching Soon)</p>
            </div>
          </div>

          {/* Visitor bar in footer */}
          <div className="ym-footer-visitor-bar">
            <span className={`ym-footer-visitor-dot${counterError ? " error" : ""}`} />
            {counterLoading ? (
              <span className="ym-skeleton" style={{ width: 44, height: "1.2em" }} />
            ) : (
              <span className="ym-footer-visitor-count">{displayCount(visitorCount)}</span>
            )}
            <span className="ym-footer-visitor-sep">·</span>
            <span className="ym-footer-visitor-label">people have visited this site</span>
            <span className="ym-footer-visitor-sep">·</span>
            <span className="ym-footer-visitor-label" style={{ color: counterError ? "#f59e0b" : "#22c55e", fontSize: "10px" }}>
              {counterError ? "⚠ counter offline" : "● live"}
            </span>
          </div>

          <hr className="ym-footer-divider" />

          <div className="ym-footer-policy-links">
            {[
              { label: "Terms & Conditions", href: POLICY.terms },
              { label: "Privacy Policy", href: POLICY.privacy },
              { label: "Refund & Cancellation Policy", href: POLICY.refund },
            ].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="ym-footer-policy-link">{l.label}</a>
            ))}
          </div>
          <div className="ym-footer-copy">
            <p>© {new Date().getFullYear()} Yarwng Mathematics. All rights reserved.</p>
            <p>Managed by Rakesh Debbarma · M.Sc Mathematics, IIT Delhi</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════ MODAL ══════════════════ */}
      {showModal && (
        <div className="ym-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }} role="dialog" aria-modal="true" aria-label="Registration modal">
          <div className="ym-modal">
            <div className="ym-modal-head">
              <button onClick={closeModal} className="ym-modal-close" aria-label="Close modal">×</button>
              <div className="ym-modal-steps">
                {["form", "payment", "done"].map((s, i) => {
                  const stepIdx = ["form", "payment", "done"].indexOf(step);
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div className={`ym-modal-step ${i === stepIdx ? "current" : i < stepIdx ? "done" : "future"}`}>
                        {i < stepIdx ? "✓" : i + 1}
                      </div>
                      {i < 2 && <div className={`ym-modal-step-line ${i < stepIdx ? "done" : "future"}`} />}
                    </div>
                  );
                })}
              </div>
              <div className="ym-modal-emoji">{step === "form" ? "📝" : step === "payment" ? "💜" : "✅"}</div>
              <div className="ym-modal-title">
                {step === "form" ? "Join Yarwng Mathematics" : step === "payment" ? "Pay via PhonePe" : "Registration Complete!"}
              </div>
              <div className="ym-modal-sub">
                {step === "form" ? "Fill your details to proceed" : step === "payment" ? `${studentClass} · ₹${pay?.offer}/month` : "Welcome to Yarwng Mathematics"}
              </div>
            </div>

            <div className="ym-modal-body">

              {/* ── STEP 1: FORM ── */}
              {step === "form" && (
                <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}>
                  <div className="ym-form-info">
                    <span>ℹ️</span>
                    <span>Your details will be saved after confirming payment.</span>
                  </div>
                  <div className="ym-form-stack">
                    <div className="ym-form-group">
                      <label className="ym-form-label">Student Name *</label>
                      <input type="text" placeholder="Full name of the student" value={name} onChange={(e) => setName(e.target.value)} required className="ym-input" />
                    </div>
                    <div className="ym-form-group">
                      <label className="ym-form-label">WhatsApp Number *</label>
                      <input type="tel" placeholder="10-digit WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="ym-input" />
                    </div>
                    <div className="ym-form-row">
                      <div className="ym-form-group">
                        <label className="ym-form-label">Class *</label>
                        <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required className="ym-input">
                          <option value="">Select Class</option>
                          <option>Class 10</option>
                          <option>Class 11</option>
                          <option>Class 12</option>
                        </select>
                      </div>
                      <div className="ym-form-group">
                        <label className="ym-form-label">Board *</label>
                        <select value={board} onChange={(e) => setBoard(e.target.value)} required className="ym-input">
                          <option value="">Select Board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="TBSE">TBSE</option>
                          <option value="ICSE">ICSE</option>
                        </select>
                      </div>
                    </div>
                    <div className="ym-form-row">
                      <div className="ym-form-group">
                        <label className="ym-form-label">Medium *</label>
                        <select value={medium} onChange={(e) => setMedium(e.target.value)} required className="ym-input">
                          <option value="English">English</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Kokborok">Kokborok</option>
                        </select>
                      </div>
                      <div className="ym-form-group">
                        <label className="ym-form-label">Mode *</label>
                        <select value={mode} onChange={(e) => setMode(e.target.value)} required className="ym-input">
                          <option value="">Select Mode</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    </div>
                    <div className="ym-form-group">
                      <label className="ym-form-label">School Name *</label>
                      <input type="text" placeholder="Name of the school" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required className="ym-input" />
                    </div>
                    <div className="ym-form-group">
                      <label className="ym-form-label">Address *</label>
                      <input type="text" placeholder="Village / Town / Area" value={address} onChange={(e) => setAddress(e.target.value)} required className="ym-input" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "9px", padding: "9px 12px" }}>
                      <span style={{ fontSize: "14px" }}>📢</span>
                      <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 500 }}>Classes are taught in <strong>English Medium</strong>.</span>
                    </div>
                    <p className="ym-policy-text">
                      By registering you agree to our{" "}
                      <a href={POLICY.terms} target="_blank" rel="noopener noreferrer">Terms & Conditions</a>,{" "}
                      <a href={POLICY.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
                      <a href={POLICY.refund} target="_blank" rel="noopener noreferrer">Refund Policy</a>.
                    </p>
                    <button type="submit" className="ym-submit-btn">
                      Next: Pay & Join →
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 2: PHONEPE REDIRECT ── */}
              {step === "payment" && pay && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>💜</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Complete Your Payment</h3>
                  <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
                    You'll be securely redirected to PhonePe to complete the payment.
                  </p>

                  {/* Order summary */}
                  <div className="ym-pay-summary">
                    <div>
                      <p className="ym-pay-class">{studentClass} · {board} · {mode}</p>
                      <p>
                        <span className="ym-pay-amount">₹{pay.offer}</span>
                        <span className="ym-pay-unit"> /month</span>
                      </p>
                    </div>
                    <div className="ym-pay-discount">
                      {discount}% OFF<br />
                      <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "11px" }}>₹{pay.original}</span>
                    </div>
                  </div>

                  {/* PhonePe pay button */}
                  <button
                    onClick={handleSubmit as any}
                    disabled={submitting}
                    className="ym-confirm-btn"
                  >
                    {submitting ? (
                      <>
                        <svg className="ym-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                        </svg>
                        Redirecting to PhonePe…
                      </>
                    ) : (
                      <>💜 Pay ₹{pay.offer} via PhonePe</>
                    )}
                  </button>

                  {payError && <div className="ym-pay-err">⚠️ {payError}</div>}

                  <p className="ym-pay-secure">🔒 Powered by PhonePe Payment Gateway · SSL Secured</p>

                  {/* Back button */}
                  <button
                    onClick={() => { setStep("form"); setPayError(""); setSubmitting(false); }}
                    style={{ marginTop: 14, background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
                  >
                    ← Edit details
                  </button>
                </div>
              )}

              {/* ── STEP 3: DONE ── */}
              {step === "done" && pay && (
                <div className="ym-done-wrap">
                  <div className="ym-done-confetti">🎉</div>
                  <h3 className="ym-done-name">Welcome, {name}!</h3>
                  <p className="ym-done-sub">You're now part of Yarwng Mathematics!</p>
                  <div className="ym-done-wa-box">
                    <p className="ym-done-wa-title">✅ Opening {studentClass} WhatsApp Group…</p>
                    <p className="ym-done-wa-sub">{countdown > 0 ? `Redirecting in ${countdown}s` : "WhatsApp should be open now!"}</p>
                  </div>
                  <a href={pay.whatsapp} target="_blank" rel="noopener noreferrer" className="ym-done-wa-btn">
                    💬 Open {studentClass} WhatsApp Group
                  </a>
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "14px" }}>If WhatsApp didn't open, tap the button above.</p>
                  <button onClick={closeModal} className="ym-done-close-btn">Close</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
}