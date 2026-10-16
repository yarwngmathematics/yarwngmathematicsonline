"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";

const TEST_MODE = false;
const LOGO = "/Logo.png"; // file must be public/Logo.png (capital L)

const PAYMENT = {
  classes: {
    "Class 10": { original: 700, offer: TEST_MODE ? 1 : 600 },
    "Class 11": { original: 900, offer: TEST_MODE ? 1 : 800 },
    "Class 12": { original: 1000, offer: TEST_MODE ? 1 : 900 },
  },
};

const DOMAIN = "https://yarwngmathematics.com";
const POLICY = {
  terms: `${DOMAIN}/terms`,
  privacy: `${DOMAIN}/privacy`,
  refund: `${DOMAIN}/refund`,
};

const VISITOR_COUNT_ENDPOINT = "/api/visitor-count";

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

const SYLLABUS: Record<string, string[]> = {
  "Class 10": ["Real Numbers", "Polynomials", "Linear Equations", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Trigonometry", "Circles", "Mensuration", "Statistics", "Probability"],
  "Class 11": ["Sets", "Relations & Functions", "Trigonometric Functions", "Complex Numbers", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Straight Lines", "Conic Sections", "Limits & Derivatives", "Statistics", "Probability"],
  "Class 12": ["Relations & Functions", "Inverse Trigonometry", "Matrices", "Determinants", "Continuity & Differentiability", "Applications of Derivatives", "Integrals", "Differential Equations", "Vectors", "3D Geometry", "Linear Programming", "Probability"],
};

const WEEK = [
  { d: "Mon", c: "Class 10" },
  { d: "Tue", c: "Class 11" },
  { d: "Wed", c: "Class 10" },
  { d: "Thu", c: "Class 12" },
  { d: "Fri", c: "Class 11" },
  { d: "Sat", c: "Class 12" },
  { d: "Sun", c: "" },
];

const FLOW = [
  { t: "Concept", d: "The teacher builds the idea on screen from first principles, so the formula has a reason behind it." },
  { t: "Guided practice", d: "Students solve problems live and explain each step. Mistakes are fixed on the spot." },
  { t: "Exam practice", d: "Board-style questions and previous year papers, timed where it helps." },
  { t: "Doubts and homework", d: "Open questions are cleared before the class ends, and a short worksheet is shared." },
];

const FAQS = [
  { q: "How are the classes conducted?", a: "Classes are live on Google Meet. You receive the joining link in your batch WhatsApp group before the first session." },
  { q: "Which boards and which medium do you cover?", a: "CBSE, TBSE and ICSE students are welcome. Classes are taught in English." },
  { q: "What if my child misses a class?", a: "Send a message in the batch group. Missed topics can be revised with the teacher during the doubt session." },
  { q: "How is the fee paid?", a: "The fee is monthly and is paid securely through PhonePe using UPI, cards or netbanking." },
  { q: "Can I get a refund?", a: "Please read our Refund & Cancellation Policy linked in the footer for the exact terms." },
  { q: "When will offline classes start in Khumulwng?", a: "Offline batches are being planned with small groups. Register your interest and we will contact you first." },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "payment"
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
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
        const response = await fetch(VISITOR_COUNT_ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.success && typeof data.count === "number") setVisitorCount(data.count);
        else throw new Error("Unexpected response format");
      } catch (err) {
        console.warn("Visitor counter failed:", err);
        setCounterError(true);
      } finally {
        setCounterLoading(false);
      }
    };
    hitCounter();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("enroll") === "1") openModal(params.get("mode") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (preMode?: string) => {
    setStep("form");
    setName(""); setWhatsapp(""); setStudentClass(""); setBoard("");
    setMedium("English"); setSchoolName(""); setAddress(""); setMode(preMode ?? "");
    setPayError("");
    setSubmitting(false);
    setShowModal(true);
  };

  const openForClass = (cls: string) => {
    openModal();
    setStudentClass(cls);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setPayError("");

    try {
      const res = await fetch("/api/phonepe/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pay?.offer, name, phone: whatsapp, studentClass, board, medium, schoolName, address, mode }),
      });
      const data = await res.json();

      if (!data.success || !data.redirectUrl) {
        setPayError(data.error?.message || "Could not initiate payment. Please try again.");
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem(
        `ym_reg_${data.merchantTransactionId}`,
        JSON.stringify({ name, whatsapp, studentClass, board, medium, schoolName, address, mode })
      );
      window.location.href = data.redirectUrl;
    } catch {
      setPayError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const pay = studentClass ? PAYMENT.classes[studentClass as keyof typeof PAYMENT.classes] : null;
  const discount = pay ? Math.round(((pay.original - pay.offer) / pay.original) * 100) : 0;
  const displayCount = (count: number | null) => (count === null ? "—" : count.toLocaleString("en-IN"));

  /* ───────── TOP BANNER CAROUSEL ───────── */
  const banners = [
    {
      bg: "linear-gradient(110deg, #fff7e6 0%, #ffe8b8 100%)", dark: false,
      title: ["ADMISSIONS", "OPEN NOW"], sub: "Maths for Class 10 · 11 · 12",
      pill: "Live Online Classes on Google Meet",
      points: ["Taught by IIT Delhi M.Sc faculty", "Weekly tests & feedback", "Doubt support on WhatsApp", "Fixed weekly timetable"],
      priceLabel: "Starting at", price: "₹600/mo", cta: "Enroll Now", action: () => openModal(),
    },
    {
      bg: "linear-gradient(110deg, #e0ecff 0%, #b9d3ff 100%)", dark: false,
      title: ["CLASS 10", "BATCH"], sub: "Mon & Wed · 5:00 – 7:00 PM",
      pill: "Board Exam Foundation",
      points: ["Algebra, Geometry, Trigonometry", "Statistics & Probability", "Regular tests", "Doubt sessions included"],
      priceLabel: "₹700", price: "₹600/mo", cta: "Join Class 10", action: () => openForClass("Class 10"),
    },
    {
      bg: "linear-gradient(110deg, #e4f8ee 0%, #b7ecd0 100%)", dark: false,
      title: ["CLASS 11", "BATCH"], sub: "Tue & Fri · 5:00 – 7:00 PM",
      pill: "Build a Strong Base",
      points: ["Sets, Relations & Functions", "Trigonometry", "Calculus basics", "Ready for Class 12 & entrance exams"],
      priceLabel: "₹900", price: "₹800/mo", cta: "Join Class 11", action: () => openForClass("Class 11"),
    },
    {
      bg: "linear-gradient(110deg, #f1e8ff 0%, #d5bfff 100%)", dark: false,
      title: ["CLASS 12", "BATCH"], sub: "Thu & Sat · 5:00 – 7:00 PM",
      pill: "Board Exam Focused",
      points: ["Calculus, Vectors, 3D Geometry", "Probability & Linear Programming", "Previous year paper practice", "Weekly mock tests"],
      priceLabel: "₹1000", price: "₹900/mo", cta: "Join Class 12", action: () => openForClass("Class 12"),
    },
    {
      bg: "linear-gradient(110deg, #0b3a7a 0%, #061a38 100%)", dark: true,
      title: ["OFFLINE", "CLASSES"], sub: "Khumulwng, Tripura",
      pill: "Launching Soon · Limited Seats",
      points: ["Face-to-face classroom teaching", "Personal attention for every student", "Same IIT-level faculty", "Register your interest today"],
      priceLabel: "", price: "Free to register", cta: "Register Interest", action: () => openModal("Offline"),
    },
  ];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((v) => (v + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [paused, banners.length]);

  const prevSlide = () => setSlide((v) => (v - 1 + banners.length) % banners.length);
  const nextSlide = () => setSlide((v) => (v + 1) % banners.length);

  const reasons = [
    { t: "Why before how", d: "Each chapter starts with the idea behind the formula, so students can rebuild a method even when they forget it." },
    { t: "Taught by an IITian", d: "Rakesh sir studied M.Sc Mathematics at IIT Delhi and brings that depth to school-level maths." },
    { t: "One slot, every week", d: "Your batch meets on the same days at the same time. No reshuffling, no missed announcements." },
    { t: "Doubts get answered", d: "Every batch has its own WhatsApp group. Send a photo of the sum you are stuck on, get a worked reply." },
    { t: "Live, not recorded", d: "Classes run live on Google Meet, so students can interrupt, ask, and be asked right back." },
    { t: "Tests with feedback", d: "Regular tests are marked and discussed, so every student knows exactly which topic needs work." },
  ];

  const steps = [
    { t: "Fill the form", d: "Student name, class, board and school. It takes about a minute." },
    { t: "Pay the monthly fee", d: "Pay securely through PhonePe. UPI, cards and netbanking all work." },
    { t: "Join your batch", d: "You are added to the batch WhatsApp group and get the class link before the first session." },
  ];

  const classKeys = Object.keys(PAYMENT.classes) as Array<keyof typeof PAYMENT.classes>;

  return (
    <main id="home" className="ym-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0b3a7a; --navy-deep: #082b5c; --ink: #0f1f3d; --gold: #d9a93a; --gold-deep: #9a7413; --gold-soft: #fbf3dc;
          --bg: #f6f8fc; --line: #e2e8f2; --teal: #0f766e; --text: #25324b; --muted: #5f6f8a; --card: #ffffff;
          --shadow: 0 1px 2px rgba(15,31,61,0.06), 0 8px 24px rgba(15,31,61,0.06);
          --shadow-lg: 0 2px 4px rgba(15,31,61,0.06), 0 24px 56px rgba(15,31,61,0.14);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: var(--text); background: #fff; -webkit-font-smoothing: antialiased; }
        .ym-page { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .ym-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .ym-nav-link.active { color: #fff; background: rgba(59,130,246,0.2); }
        .ym-nav-link.active-dot { position: relative; }
        .ym-nav-link.active-dot::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }
        .ym-nav-enroll:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-1px); }
        .ym-hamburger span { display: block; width: 20px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; }
        .ym-mobile-menu.open { display: flex; }
        .ym-mobile-link:hover, .ym-mobile-link.active { background: rgba(59,130,246,0.15); color: #fff; }
        @media (max-width: 900px) { .ym-nav-links { display: none; } .ym-hamburger { display: flex; } }
        @media (max-width: 500px) { .ym-nav-enroll { font-size: 11px; padding: 7px 12px; } .ym-nav-name { font-size: 13px; } .ym-nav-sub { display: none; } }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes skeletonShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes visitorPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        a:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible, summary:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

        /* ═════════ TOP BANNER CAROUSEL ═════════ */
        .bn-wrap { position: relative; width: 100%; overflow: hidden; background: #fff; }
        .bn-track { display: flex; transition: transform 0.6s cubic-bezier(.65,.05,.36,1); will-change: transform; }
        .bn-slide { flex: 0 0 100%; min-width: 0; }
        .bn-inner { max-width: 1240px; margin: 0 auto; min-height: 250px; padding: 22px 64px; display: grid; grid-template-columns: 1.05fr 1.6fr 0.75fr; align-items: center; gap: 28px; }
        .bn-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bn-logo { width: 58px; height: 58px; border-radius: 14px; background: #fff; padding: 3px; object-fit: contain; display: block; box-shadow: 0 3px 12px rgba(6,26,56,0.22); }
        .bn-brand-name { font-weight: 800; font-size: 15px; line-height: 1.1; color: #14122b; }
        .bn-title { font-weight: 800; font-size: clamp(2rem, 3.8vw, 3.1rem); line-height: 1; color: #14122b; letter-spacing: -0.02em; }
        .bn-sub { margin-top: 10px; font-weight: 700; font-size: clamp(0.95rem, 1.5vw, 1.25rem); color: #1d4ed8; }
        .bn-dark .bn-brand-name, .bn-dark .bn-title { color: #fff; }
        .bn-dark .bn-sub { color: #fcd34d; }
        .bn-pill { display: inline-block; background: #1e3a8a; color: #fff; font-weight: 700; font-size: clamp(0.85rem, 1.6vw, 1.25rem); padding: 9px 26px 9px 18px; border-radius: 10px 40px 10px 10px; margin-bottom: 16px; }
        .bn-dark .bn-pill { background: var(--gold); color: var(--ink); }
        .bn-points { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 22px; margin-bottom: 16px; }
        .bn-point { display: flex; align-items: flex-start; gap: 8px; font-weight: 500; font-size: 14px; color: #1f2937; line-height: 1.35; }
        .bn-point::before { content: '✓'; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #1d4ed8; color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .bn-dark .bn-point { color: #e5edfb; }
        .bn-dark .bn-point::before { background: #fcd34d; color: #082b5c; }
        .bn-buy { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .bn-price-old { font-size: 14px; color: #6b7280; text-decoration: line-through; font-weight: 600; line-height: 1; display: block; margin-bottom: 2px; }
        .bn-price { font-weight: 800; font-size: clamp(1.5rem, 2.4vw, 2.1rem); color: #1d4ed8; line-height: 1; }
        .bn-dark .bn-price-old { color: #9fb6dd; }
        .bn-dark .bn-price { color: #fff; }
        .bn-cta { background: linear-gradient(180deg, #f97316 0%, #ea580c 100%); color: #fff; border: none; padding: 13px 34px; border-radius: 100px; font-weight: 800; font-size: 17px; cursor: pointer; font-family: inherit; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 6px 16px rgba(234,88,12,0.35); }
        .bn-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(234,88,12,0.45); }
        .bn-photo { align-self: end; justify-self: center; height: 100%; display: flex; align-items: flex-end; }
        .bn-photo-circle { width: 210px; height: 210px; border-radius: 50%; overflow: hidden; border: 6px solid rgba(255,255,255,0.85); box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: #e5e7eb; }
        .bn-photo-circle img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .bn-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.92); color: #14122b; font-size: 22px; line-height: 1; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; z-index: 5; transition: background 0.2s; }
        .bn-arrow:hover { background: #fff; }
        .bn-arrow.prev { left: 14px; }
        .bn-arrow.next { right: 14px; }
        .bn-dots { display: flex; justify-content: center; gap: 9px; padding: 14px 0 6px; background: var(--bg); }
        .bn-dot { width: 9px; height: 9px; border-radius: 50%; border: none; background: #cbd5e1; cursor: pointer; padding: 0; transition: all 0.25s; }
        .bn-dot.on { background: var(--navy); width: 26px; border-radius: 6px; }
        @media (max-width: 980px) { .bn-inner { grid-template-columns: 1fr 1.5fr; padding: 22px 56px; } .bn-photo { display: none; } }
        @media (max-width: 700px) {
          .bn-inner { grid-template-columns: 1fr; gap: 14px; padding: 20px 20px 24px; min-height: 0; }
          .bn-points { grid-template-columns: 1fr; gap: 7px; }
          .bn-arrow { display: none; }
          .bn-pill { padding: 8px 20px 8px 14px; }
          .bn-cta { padding: 12px 28px; font-size: 15px; }
        }
        @media (prefers-reduced-motion: reduce) { .bn-track { transition: none; } html { scroll-behavior: auto; } }

        /* ═════════ SHARED ═════════ */
        .yw-wrap { max-width: 1160px; margin: 0 auto; }
        .yw-sec { padding: 96px 24px; }
        .yw-sec.alt { background: var(--bg); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .yw-head { max-width: 640px; margin-bottom: 48px; }
        .yw-head.center { margin-left: auto; margin-right: auto; text-align: center; }
        .yw-h2 { font-weight: 700; font-size: clamp(1.7rem, 3vw, 2.4rem); line-height: 1.2; color: var(--ink); letter-spacing: -0.02em; }
        .yw-lead { margin-top: 14px; color: var(--muted); font-size: 17px; line-height: 1.7; }
        .yw-btn { display: inline-flex; align-items: center; justify-content: center; font-family: inherit; font-weight: 600; font-size: 15px; border-radius: 10px; padding: 14px 26px; cursor: pointer; text-decoration: none; transition: transform 0.15s, background 0.2s, box-shadow 0.2s; border: 1.5px solid transparent; }
        .yw-btn:hover { transform: translateY(-1px); }
        .yw-btn-gold { background: var(--gold); color: var(--ink); box-shadow: 0 6px 18px rgba(217,169,58,0.35); }
        .yw-btn-gold:hover { background: #e3b64c; }
        .yw-btn-navy { background: var(--navy); color: #fff; }
        .yw-btn-navy:hover { background: var(--navy-deep); }
        .yw-btn-ghost { background: #fff; color: var(--navy); border-color: #c5d3ea; }
        .yw-btn-ghost:hover { border-color: var(--navy); }

        /* ═════════ HERO ═════════ */
        .yw-hero { position: relative; padding: 88px 24px 96px; background: linear-gradient(180deg, #f3f7fd 0%, #ffffff 100%); overflow: hidden; }
        .yw-hero::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(11,58,122,0.10) 1px, transparent 1px); background-size: 24px 24px; mask-image: linear-gradient(180deg, #000 0%, transparent 85%); -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 85%); pointer-events: none; }
        .yw-hero-grid { position: relative; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 72px; align-items: center; }
        .yw-badge { display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px 7px 10px; font-size: 13.5px; font-weight: 600; color: var(--navy); box-shadow: var(--shadow); }
        .yw-badge i { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.18); }
        .yw-hero h1 { margin-top: 22px; font-weight: 700; font-size: clamp(2.2rem, 4.2vw, 3.5rem); line-height: 1.14; letter-spacing: -0.03em; color: var(--ink); max-width: 640px; }
        .yw-hero p.sub { margin-top: 22px; font-size: 18px; line-height: 1.7; color: var(--muted); max-width: 540px; }
        .yw-hero-btns { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 12px; }
        .yw-hero-meta { margin-top: 36px; display: flex; flex-wrap: wrap; gap: 10px 28px; font-size: 14px; color: var(--muted); font-weight: 500; }
        .yw-hero-meta span::before { content: '✓'; color: var(--teal); font-weight: 800; margin-right: 8px; }

        .yw-portrait { position: relative; max-width: 340px; margin: 0 auto; text-align: center; }
        .yw-circle { position: relative; width: 250px; height: 250px; margin: 0 auto; }
        .yw-ring { position: absolute; inset: -16px; border-radius: 50%; background: repeating-conic-gradient(var(--navy) 0deg 2.5deg, transparent 2.5deg 6deg); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px)); mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px)); opacity: 0.45; }
        .yw-circle-img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 5px solid #fff; background: linear-gradient(180deg, #eaf1fb, #fff); box-shadow: 0 10px 30px rgba(15,31,61,0.16); }
        .yw-circle-img img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .yw-portrait-cap { margin-top: 30px; }
        .yw-portrait-cap b { display: block; font-size: 18px; color: var(--ink); letter-spacing: -0.01em; }
        .yw-portrait-cap span { display: block; margin-top: 3px; font-size: 14px; color: var(--muted); }
        .yw-float { position: absolute; z-index: 2; background: #fff; border-radius: 14px; padding: 12px 16px; box-shadow: var(--shadow-lg); font-size: 13px; color: var(--muted); line-height: 1.35; }
        .yw-float b { display: block; font-size: 15px; color: var(--ink); }
        .yw-float.a { left: -6px; top: 14px; }
        .yw-float.b { right: -6px; top: 160px; }

        /* ═════════ STATS ═════════ */
        .yw-stats { background: var(--ink); color: #fff; padding: 40px 24px; }
        .yw-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); }
        .yw-stat { padding: 0 24px; border-left: 1px solid rgba(255,255,255,0.14); }
        .yw-stat:first-child { border-left: none; padding-left: 0; }
        .yw-stat b { display: block; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: #fff; }
        .yw-stat span { display: block; margin-top: 4px; font-size: 14px; color: #a9bbd9; }

        /* ═════════ BATCHES (pricing cards) ═════════ */
        .yw-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: stretch; }
        .yw-card { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 32px 28px 28px; box-shadow: var(--shadow); position: relative; }
        .yw-card.feat { border-color: var(--navy); box-shadow: var(--shadow-lg); }
        .yw-card-tag { position: absolute; top: -13px; left: 28px; background: var(--gold); color: var(--ink); font-size: 12.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; }
        .yw-card h3 { font-size: 22px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
        .yw-card-when { margin-top: 6px; font-size: 14.5px; color: var(--muted); }
        .yw-card-price { margin-top: 24px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
        .yw-card-price b { font-size: 40px; font-weight: 700; letter-spacing: -0.03em; color: var(--navy); line-height: 1; }
        .yw-card-price s { font-size: 16px; color: #94a3b8; }
        .yw-card-price small { font-size: 14px; color: var(--muted); }
        .yw-card ul { list-style: none; margin: 24px 0 28px; border-top: 1px solid var(--line); flex: 1; }
        .yw-card li { display: flex; gap: 10px; align-items: flex-start; padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--text); }
        .yw-card li::before { content: '✓'; color: var(--teal); font-weight: 800; }
        .yw-card .yw-btn { width: 100%; }
        .yw-note { margin-top: 28px; text-align: center; font-size: 14px; color: var(--muted); }

        /* ═════════ SYLLABUS ═════════ */
        .yw-syl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .yw-syl-col { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
        .yw-syl-col header { padding: 18px 24px; color: #fff; font-weight: 700; font-size: 17px; }
        .yw-syl-col.c10 header { background: var(--navy); }
        .yw-syl-col.c11 header { background: var(--gold-deep); }
        .yw-syl-col.c12 header { background: var(--teal); }
        .yw-syl-col ul { list-style: none; padding: 8px 24px 18px; }
        .yw-syl-col li { padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 15px; }
        .yw-syl-col li:last-child { border-bottom: none; }
        .yw-syl-foot { margin-top: 20px; font-size: 13.5px; color: var(--muted); text-align: center; }

        /* ═════════ WEEK ═════════ */
        .yw-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
        .yw-day { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px 10px; text-align: center; }
        .yw-day b { display: block; font-size: 15px; color: var(--ink); }
        .yw-day span { display: block; margin-top: 10px; font-size: 13.5px; font-weight: 700; padding: 5px 0; border-radius: 8px; }
        .yw-day small { display: block; margin-top: 8px; font-size: 12.5px; color: var(--muted); }
        .yw-day.c10 span { background: #e6eef9; color: var(--navy); }
        .yw-day.c11 span { background: var(--gold-soft); color: var(--gold-deep); }
        .yw-day.c12 span { background: #dff3f0; color: var(--teal); }
        .yw-day.off { background: transparent; border-style: dashed; }
        .yw-day.off span { color: #94a3b8; font-weight: 500; }

        /* ═════════ CLASS FLOW ═════════ */
        .yw-flow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid var(--line); border-radius: 18px; background: #fff; overflow: hidden; box-shadow: var(--shadow); }
        .yw-flow-item { padding: 30px 26px; border-left: 1px solid var(--line); }
        .yw-flow-item:first-child { border-left: none; }
        .yw-flow-item h3 { font-size: 18px; font-weight: 700; color: var(--ink); }
        .yw-flow-item p { margin-top: 10px; font-size: 14.5px; line-height: 1.7; color: var(--muted); }
        .yw-flow-bar { margin-top: 18px; height: 4px; border-radius: 4px; background: var(--line); overflow: hidden; }
        .yw-flow-bar i { display: block; height: 100%; background: var(--gold); }

        /* ═════════ WHY ═════════ */
        .yw-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .yw-why-item { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px 26px; }
        .yw-why-item .ic { width: 42px; height: 42px; border-radius: 12px; background: var(--gold-soft); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; margin-bottom: 18px; }
        .yw-why-item h3 { font-size: 18px; font-weight: 700; color: var(--ink); }
        .yw-why-item p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.7; }

        /* ═════════ OFFLINE ═════════ */
        .yw-off { background: linear-gradient(135deg, var(--navy) 0%, var(--ink) 100%); color: #fff; padding: 84px 24px; }
        .yw-off-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 56px; align-items: center; }
        .yw-off h2 { font-weight: 700; font-size: clamp(1.7rem, 3vw, 2.3rem); line-height: 1.2; letter-spacing: -0.02em; }
        .yw-off p { margin-top: 14px; color: #b9cbe8; line-height: 1.75; max-width: 540px; font-size: 16.5px; }
        .yw-off-box { background: #fff; color: var(--text); border-radius: 18px; padding: 30px; box-shadow: var(--shadow-lg); }
        .yw-off-box b { display: block; font-size: 20px; color: var(--ink); }
        .yw-off-box span { display: block; margin: 8px 0 22px; font-size: 14.5px; color: var(--muted); line-height: 1.6; }
        .yw-off-box .yw-btn { width: 100%; }

        /* ═════════ STEPS ═════════ */
        .yw-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; counter-reset: s; }
        .yw-step { position: relative; padding-right: 32px; }
        .yw-step::before { counter-increment: s; content: counter(s); display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 50%; background: var(--navy); color: #fff; font-weight: 700; font-size: 18px; position: relative; z-index: 1; }
        .yw-step::after { content: ''; position: absolute; top: 22px; left: 54px; right: 8px; height: 2px; background: repeating-linear-gradient(90deg, #b6c6e2 0 8px, transparent 8px 14px); }
        .yw-step:last-child::after { display: none; }
        .yw-step h3 { margin-top: 20px; font-size: 19px; font-weight: 700; color: var(--ink); }
        .yw-step p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.7; }

        /* ═════════ MENTOR ═════════ */
        .yw-mentor { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 72px; align-items: center; }
        .yw-mentor-text p { color: var(--text); font-size: 17px; line-height: 1.8; margin-top: 18px; max-width: 600px; }
        .yw-quote { margin-top: 28px; padding: 6px 0 6px 22px; border-left: 3px solid var(--gold); font-family: 'Source Serif 4', Georgia, serif; font-size: 22px; line-height: 1.5; color: var(--navy); font-weight: 500; }
        .yw-creds { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
        .yw-cred { background: var(--bg); border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; font-size: 14px; font-weight: 600; color: var(--navy); }

        /* ═════════ FAQ ═════════ */
        .yw-faq { max-width: 780px; margin: 0 auto; border-top: 1px solid var(--line); }
        .yw-faq details { border-bottom: 1px solid var(--line); }
        .yw-faq summary { list-style: none; cursor: pointer; padding: 22px 4px; display: flex; justify-content: space-between; gap: 20px; align-items: center; font-weight: 600; font-size: 17px; color: var(--ink); }
        .yw-faq summary::-webkit-details-marker { display: none; }
        .yw-faq summary::after { content: '+'; font-size: 24px; font-weight: 400; color: var(--navy); transition: transform 0.2s; flex-shrink: 0; }
        .yw-faq details[open] summary::after { transform: rotate(45deg); }
        .yw-faq details p { padding: 0 4px 24px; color: var(--muted); font-size: 15.5px; line-height: 1.75; max-width: 680px; }

        /* ═════════ CONTACT ═════════ */
        .yw-contact { background: var(--ink); color: #fff; padding: 92px 24px; }
        .yw-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
        .yw-contact h2 { font-weight: 700; font-size: clamp(1.7rem, 3vw, 2.3rem); line-height: 1.2; letter-spacing: -0.02em; }
        .yw-crow { display: flex; gap: 16px; align-items: flex-start; margin-top: 26px; }
        .yw-crow i { font-style: normal; width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .yw-crow p { font-size: 16px; font-weight: 600; }
        .yw-crow small { display: block; color: #a9bbd9; font-size: 13.5px; margin-top: 3px; }
        .yw-crow a { color: var(--gold-soft); text-decoration: none; }
        .yw-crow a:hover { text-decoration: underline; }
        .yw-cta { background: #fff; color: var(--text); border-radius: 20px; padding: 36px; box-shadow: var(--shadow-lg); }
        .yw-cta h3 { font-size: 24px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
        .yw-cta p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.6; }
        .yw-cta ul { list-style: none; margin: 20px 0 24px; border-top: 1px solid var(--line); }
        .yw-cta li { display: flex; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--line); font-size: 15px; }
        .yw-cta li b { color: var(--navy); }
        .yw-cta .yw-btn { width: 100%; }

        /* ═════════ FOOTER ═════════ */
        .ym-footer { background: #0a1731; color: rgba(255,255,255,0.62); padding: 64px 24px 24px; }
        .ym-footer-inner { max-width: 1160px; margin: 0 auto; }
        .ym-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 40px; margin-bottom: 36px; }
        .ym-footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .ym-footer-logo img { width: 52px; height: 52px; border-radius: 12px; background: #fff; padding: 3px; object-fit: contain; }
        .ym-footer-brand-name { color: #fff; font-weight: 700; font-size: 20px; }
        .ym-footer-brand-tagline { color: var(--gold); font-style: italic; font-size: 13.5px; margin-bottom: 12px; }
        .ym-footer-brand-desc { font-size: 14px; line-height: 1.75; }
        .ym-footer-badges { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .ym-footer-badge { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 12px; font-size: 12px; }
        .ym-footer-h4 { color: #fff; font-weight: 700; font-size: 15px; margin-bottom: 16px; }
        .ym-footer-item { font-size: 14px; margin-bottom: 10px; line-height: 1.55; }
        .ym-footer-item a { color: rgba(255,255,255,0.62); text-decoration: none; }
        .ym-footer-item a:hover { color: var(--gold); }
        .ym-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 18px; }
        .ym-footer-visitor-bar { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .ym-footer-visitor-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        .ym-footer-visitor-dot.error { background: #f59e0b; animation: none; }
        .ym-footer-visitor-count { color: #fff; font-weight: 700; font-size: 18px; }
        .ym-footer-visitor-label { color: rgba(255,255,255,0.45); font-size: 12.5px; }
        .ym-footer-visitor-sep { color: rgba(255,255,255,0.15); font-size: 16px; }
        .ym-skeleton { display: inline-block; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% auto; animation: skeletonShimmer 1.5s linear infinite; border-radius: 4px; height: 1em; width: 40px; vertical-align: middle; }
        .ym-footer-policy-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; margin-bottom: 14px; }
        .ym-footer-policy-link { font-size: 12.5px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; padding: 4px 14px; border-right: 1px solid rgba(255,255,255,0.12); }
        .ym-footer-policy-link:last-child { border-right: none; }
        .ym-footer-policy-link:hover { color: var(--gold); }
        .ym-footer-copy { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 12.5px; text-align: center; }

        /* ═════════ RESPONSIVE ═════════ */
        @media (max-width: 1000px) {
          .yw-hero-grid, .yw-mentor, .yw-contact-grid, .yw-off-grid { grid-template-columns: 1fr; gap: 48px; }
          .yw-circle { width: 220px; height: 220px; }
          .yw-float.a { left: -8px; } .yw-float.b { right: -8px; }
          .yw-stats-row { grid-template-columns: 1fr 1fr; row-gap: 28px; }
          .yw-stat:nth-child(3) { border-left: none; padding-left: 0; }
          .yw-cards, .yw-syl, .yw-why-grid { grid-template-columns: 1fr; }
          .yw-flow { grid-template-columns: 1fr 1fr; }
          .yw-flow-item:nth-child(3) { border-left: none; }
          .yw-flow-item:nth-child(n+3) { border-top: 1px solid var(--line); }
          .yw-week { grid-template-columns: repeat(4, 1fr); }
          .yw-steps { grid-template-columns: 1fr; gap: 32px; }
          .yw-step::after { display: none; }
          .ym-footer-grid { grid-template-columns: 1fr 1fr; }
          .yw-sec { padding: 64px 20px; }
          .yw-hero { padding: 56px 20px 64px; }
        }
        @media (max-width: 560px) {
          .yw-hero-btns .yw-btn { width: 100%; }
          .yw-week { grid-template-columns: repeat(3, 1fr); }
          .yw-flow { grid-template-columns: 1fr; }
          .yw-flow-item { border-left: none; border-top: 1px solid var(--line); }
          .yw-flow-item:first-child { border-top: none; }
          .ym-footer-grid { grid-template-columns: 1fr; }
          .yw-float { display: none; }
        }

        /* ═════════ MODAL ═════════ */
        .ym-overlay { position: fixed; inset: 0; background: rgba(8,20,45,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 14px; backdrop-filter: blur(4px); }
        .ym-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 480px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); overflow: hidden; max-height: 94vh; overflow-y: auto; position: relative; }
        .ym-modal-head { background: linear-gradient(135deg, #0b3a7a 0%, #0f1f3d 100%); padding: 24px 28px 20px; color: #fff; position: sticky; top: 0; z-index: 10; border-bottom: 4px solid var(--gold); }
        .ym-modal-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 32px; height: 32px; border-radius: 8px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .ym-modal-close:hover { background: rgba(255,255,255,0.25); }
        .ym-modal-steps { display: flex; align-items: center; gap: 7px; margin-bottom: 14px; }
        .ym-modal-step { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.3s; }
        .ym-modal-step.current { background: var(--gold); color: #1a0a00; }
        .ym-modal-step.done { background: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .ym-modal-step.future { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .ym-modal-step-line { flex: 1; height: 2px; border-radius: 1px; max-width: 36px; }
        .ym-modal-step-line.done { background: rgba(255,255,255,0.3); }
        .ym-modal-step-line.future { background: rgba(255,255,255,0.1); }
        .ym-modal-logo { width: 44px; height: 44px; border-radius: 10px; background: #fff; padding: 2px; object-fit: contain; margin-bottom: 8px; display: block; }
        .ym-modal-title { font-size: 21px; font-weight: 700; }
        .ym-modal-sub { color: rgba(255,255,255,0.7); font-size: 13.5px; margin-top: 3px; }
        .ym-modal-body { padding: 24px 28px 28px; }
        .ym-form-info { background: #eef4fc; border: 1px solid #cfdcf0; border-radius: 10px; padding: 10px 14px; display: flex; gap: 7px; font-size: 12.5px; color: var(--navy); margin-bottom: 18px; }
        .ym-form-label { font-size: 12.5px; font-weight: 600; color: var(--muted); margin-bottom: 6px; display: block; }
        .ym-form-group { display: flex; flex-direction: column; }
        .ym-input { width: 100%; border: 1.5px solid #d3dbe8; padding: 12px 14px; border-radius: 10px; font-size: 14px; font-family: inherit; color: var(--text); outline: none; transition: border-color 0.2s; background: #fff; }
        .ym-input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(11,58,122,0.14); }
        .ym-input::placeholder { color: #9aa7bb; }
        .ym-form-stack { display: flex; flex-direction: column; gap: 14px; }
        .ym-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ym-policy-text { font-size: 11.5px; color: #8795ab; text-align: center; line-height: 1.6; }
        .ym-policy-text a { color: var(--navy); text-decoration: none; }
        .ym-submit-btn { width: 100%; background: var(--navy); color: #fff; padding: 14px; border-radius: 10px; font-size: 15.5px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; margin-top: 3px; font-family: inherit; }
        .ym-submit-btn:hover { background: var(--navy-deep); }
        .ym-pay-summary { background: #eef4fc; border: 1.5px solid #cfdcf0; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; text-align: left; }
        .ym-pay-class { font-size: 12.5px; color: var(--navy); font-weight: 600; margin-bottom: 3px; }
        .ym-pay-amount { font-size: 26px; font-weight: 800; color: var(--ink); }
        .ym-pay-unit { font-size: 12px; color: var(--muted); }
        .ym-pay-discount { background: var(--gold-soft); color: #7a5a0c; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 8px; text-align: center; }
        .ym-confirm-btn { width: 100%; background: var(--gold); color: var(--ink); padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        .ym-confirm-btn:hover:not(:disabled) { background: #e3b64c; }
        .ym-confirm-btn:disabled, .ym-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-err { background: #fee2e2; border: 1px solid #fecaca; border-radius: 10px; padding: 11px 14px; color: #dc2626; font-size: 13px; text-align: center; margin-top: 10px; }
        .ym-pay-secure { text-align: center; margin-top: 12px; font-size: 11.5px; color: #8795ab; }
        .ym-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* NAVBAR */}
      <Navbar onEnroll={() => openModal()} />

      {/* TOP BANNER CAROUSEL */}
      <section
        className="bn-wrap"
        aria-roledescription="carousel"
        aria-label="Announcements"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="bn-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {banners.map((b, i) => (
            <div key={i} className={`bn-slide${b.dark ? " bn-dark" : ""}`} style={{ background: b.bg }} aria-hidden={slide !== i}>
              <div className="bn-inner">
                <div>
                  <div className="bn-brand">
                    <img className="bn-logo" src={LOGO} alt="Yarwng Mathematics logo" />
                    <p className="bn-brand-name">YARWNG<br />MATHEMATICS</p>
                  </div>
                  <h2 className="bn-title">{b.title[0]}<br />{b.title[1]}</h2>
                  <p className="bn-sub">{b.sub}</p>
                </div>
                <div>
                  <span className="bn-pill">{b.pill}</span>
                  <div className="bn-points">
                    {b.points.map((p) => (<span key={p} className="bn-point">{p}</span>))}
                  </div>
                  <div className="bn-buy">
                    <div>
                      {b.priceLabel && <span className="bn-price-old">{b.priceLabel}</span>}
                      <span className="bn-price">{b.price}</span>
                    </div>
                    <button onClick={b.action} className="bn-cta" tabIndex={slide === i ? 0 : -1}>{b.cta}</button>
                  </div>
                </div>
                <div className="bn-photo">
                  <div className="bn-photo-circle">
                    <img src="/profile.jpg" alt="Rakesh Debbarma, M.Sc Mathematics, IIT Delhi" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="bn-arrow prev" onClick={prevSlide} aria-label="Previous banner">‹</button>
        <button className="bn-arrow next" onClick={nextSlide} aria-label="Next banner">›</button>
        <div className="bn-dots">
          {banners.map((_, i) => (
            <button key={i} className={`bn-dot${slide === i ? " on" : ""}`} onClick={() => setSlide(i)} aria-label={`Go to banner ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* HERO */}
      <section className="yw-hero" aria-label="Introduction">
        <div className="yw-wrap yw-hero-grid">
          <div>
            <span className="yw-badge"><i />Admissions open for Class 10, 11 and 12</span>
            <h1>Maths that makes sense, taught by an IIT Delhi graduate</h1>
            <p className="sub">
              Small, steady, live classes on Google Meet. We work through the reasoning behind every chapter,
              then practise until it sticks. Fees start at ₹600 a month.
            </p>
            <div className="yw-hero-btns">
              <button onClick={() => openModal()} className="yw-btn yw-btn-gold">Reserve a seat</button>
              <a href="#classes" className="yw-btn yw-btn-ghost">See the batches</a>
            </div>
            <div className="yw-hero-meta">
              <span>Live classes</span>
              <span>Weekly tests</span>
              <span>Doubt support on WhatsApp</span>
            </div>
          </div>
          <div className="yw-portrait">
            <div className="yw-float a"><b>Live on Google Meet</b>Interactive, not recorded</div>
            <div className="yw-float b"><b>2 hours</b>per class, twice a week</div>
            <div className="yw-circle">
              <span className="yw-ring" aria-hidden="true" />
              <div className="yw-circle-img"><img src="/profile.jpg" alt="Rakesh Debbarma" /></div>
            </div>
            <div className="yw-portrait-cap">
              <b>Rakesh Debbarma</b>
              <span>M.Sc Mathematics, IIT Delhi</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="yw-stats" aria-label="Quick facts">
        <div className="yw-wrap yw-stats-row">
          <div className="yw-stat"><b>3 batches</b><span>Class 10, 11 and 12</span></div>
          <div className="yw-stat"><b>2 hours</b><span>per class, twice a week</span></div>
          <div className="yw-stat"><b>5 to 7 PM</b><span>every batch, every week</span></div>
          <div className="yw-stat"><b>₹600</b><span>a month, to begin with</span></div>
        </div>
      </section>

      {/* BATCHES */}
      <section id="classes" className="yw-sec">
        <div className="yw-wrap">
          <div className="yw-head center">
            <h2 className="yw-h2">Choose your batch</h2>
            <p className="yw-lead">Live on Google Meet from anywhere in India. Pick your class and pay monthly.</p>
          </div>
          <div className="yw-cards">
            {classKeys.map((cls, idx) => {
              const p = PAYMENT.classes[cls];
              const offerPrice = p.offer === 1 ? p.original : p.offer;
              const s = SLOTS[cls];
              return (
                <div key={cls} className={`yw-card${idx === 2 ? " feat" : ""}`}>
                  {idx === 2 && <span className="yw-card-tag">Board exam year</span>}
                  <h3>{cls}</h3>
                  <p className="yw-card-when">{s.days} · {s.time}</p>
                  <div className="yw-card-price">
                    <b>₹{offerPrice}</b>
                    <small>/ month</small>
                    <s>₹{p.original}</s>
                  </div>
                  <ul>
                    {s.desc.slice(0, 4).map((t) => (<li key={t}>{t}</li>))}
                    <li>{s.desc[4]}</li>
                  </ul>
                  <button onClick={() => openForClass(cls)} className={`yw-btn ${idx === 2 ? "yw-btn-gold" : "yw-btn-navy"}`}>Join {cls}</button>
                </div>
              );
            })}
          </div>
          <p className="yw-note">Fees are charged monthly. Pay securely through PhonePe using UPI, cards or netbanking.</p>
        </div>
      </section>

      {/* SYLLABUS */}
      <section className="yw-sec alt" aria-label="Chapters covered">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">Chapters we cover</h2>
            <p className="yw-lead">Every batch follows the school syllabus, chapter by chapter, with tests after each unit.</p>
          </div>
          <div className="yw-syl">
            {classKeys.map((cls) => (
              <div key={cls} className={`yw-syl-col c${cls.split(" ")[1]}`}>
                <header>{cls}</header>
                <ul>{SYLLABUS[cls].map((c) => (<li key={c}>{c}</li>))}</ul>
              </div>
            ))}
          </div>
          <p className="yw-syl-foot">Chapter order may vary slightly by board (CBSE, TBSE, ICSE).</p>
        </div>
      </section>

      {/* WEEK */}
      <section className="yw-sec" aria-label="Weekly timetable">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">Your week at a glance</h2>
            <p className="yw-lead">Each batch meets twice a week, 5 to 7 in the evening. Sunday is free for revision.</p>
          </div>
          <div className="yw-week">
            {WEEK.map((w) => (
              <div key={w.d} className={`yw-day ${w.c ? "c" + w.c.split(" ")[1] : "off"}`}>
                <b>{w.d}</b>
                <span>{w.c || "No class"}</span>
                {w.c && <small>5 to 7 PM</small>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASS FLOW */}
      <section className="yw-sec alt" aria-label="How a class runs">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">How a two-hour class runs</h2>
            <p className="yw-lead">The same four-part rhythm every session, so students always know what comes next.</p>
          </div>
          <div className="yw-flow">
            {FLOW.map((f, i) => (
              <div key={f.t} className="yw-flow-item">
                <h3>{f.t}</h3>
                <p>{f.d}</p>
                <div className="yw-flow-bar"><i style={{ width: `${(i + 1) * 25}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why-us" className="yw-sec">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">What students get in every class</h2>
            <p className="yw-lead">Coaching built around understanding, not memorising.</p>
          </div>
          <div className="yw-why-grid">
            {reasons.map((r, i) => (
              <div key={r.t} className="yw-why-item">
                <div className="ic">{["∑", "π", "∫", "?", "▶", "✓"][i]}</div>
                <h3>{r.t}</h3>
                <p>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFLINE */}
      <section className="yw-off">
        <div className="yw-wrap yw-off-grid">
          <div>
            <h2>A real classroom is coming to Khumulwng</h2>
            <p>Prefer a blackboard and a teacher in the room? Offline batches are being planned with small groups so every student gets personal attention. Tell us you are interested and we will contact you first.</p>
          </div>
          <div className="yw-off-box">
            <b>Offline batch, Khumulwng</b>
            <span>Seats are limited. Registering your interest is free and does not commit you to anything.</span>
            <button onClick={() => openModal("Offline")} className="yw-btn yw-btn-gold">Register interest</button>
          </div>
        </div>
      </section>

      {/* HOW TO JOIN */}
      <section className="yw-sec">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">Joining takes three steps</h2>
          </div>
          <div className="yw-steps">
            {steps.map((s) => (
              <div key={s.t} className="yw-step"><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTOR */}
      <section id="about" className="yw-sec alt">
        <div className="yw-wrap yw-mentor">
          <div className="yw-portrait">
            <div className="yw-circle">
              <span className="yw-ring" aria-hidden="true" />
              <div className="yw-circle-img"><img src="/profile.jpg" alt="Rakesh Debbarma, M.Sc Mathematics, IIT Delhi" /></div>
            </div>
          </div>
          <div className="yw-mentor-text">
            <h2 className="yw-h2">Meet your teacher, Rakesh Debbarma</h2>
            <p>Yarwng Mathematics began with a simple idea: students in Tripura should not have to leave home to learn maths from someone trained at a top institute.</p>
            <p>Rakesh sir holds an M.Sc in Mathematics from IIT Delhi. He teaches by asking students to explain their steps, fixing the misunderstanding underneath, and giving plenty of problems to practise on.</p>
            <div className="yw-quote">Learn the concept first. The marks follow.</div>
            <div className="yw-creds">
              <span className="yw-cred">M.Sc Mathematics</span>
              <span className="yw-cred">IIT Delhi</span>
              <span className="yw-cred">Classes 10 to 12</span>
            </div>
            <div style={{ marginTop: 30 }}><button onClick={() => openModal()} className="yw-btn yw-btn-navy">Start learning</button></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="yw-sec">
        <div className="yw-wrap">
          <div className="yw-head center">
            <h2 className="yw-h2">Frequently asked questions</h2>
          </div>
          <div className="yw-faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="yw-contact">
        <div className="yw-wrap yw-contact-grid">
          <div>
            <h2>Questions before you join? Talk to us.</h2>
            <div className="yw-crow"><i>👨‍🏫</i><div><p>Rakesh Debbarma</p><small>M.Sc Mathematics, IIT Delhi</small></div></div>
            <div className="yw-crow"><i>📱</i><div><p><a href="tel:9366030347">9366030347</a></p><small>Call or message on WhatsApp</small></div></div>
            <div className="yw-crow"><i>✉️</i><div><p><a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a></p></div></div>
            <div className="yw-crow"><i>📍</i><div><p>Khumulwng, Tripura</p><small>Offline classes launching soon</small></div></div>
          </div>
          <div className="yw-cta">
            <h3>Admissions are open</h3>
            <p>Each batch has limited seats. Register now to hold yours.</p>
            <ul>
              {classKeys.map((cls) => (
                <li key={cls}><span>{cls}</span><b>₹{PAYMENT.classes[cls].offer === 1 ? PAYMENT.classes[cls].original : PAYMENT.classes[cls].offer} / month</b></li>
              ))}
            </ul>
            <button onClick={() => openModal()} className="yw-btn yw-btn-gold">Enroll now</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ym-footer" role="contentinfo">
        <div className="ym-footer-inner">
          <div className="ym-footer-grid">
            <div>
              <div className="ym-footer-logo">
                <img src={LOGO} alt="Yarwng Mathematics logo" />
                <p className="ym-footer-brand-name">Yarwng Mathematics</p>
              </div>
              <p className="ym-footer-brand-tagline">&quot;Amani Kok Kokborok bai Swrwngwi Mannai&quot;</p>
              <p className="ym-footer-brand-desc">Mathematics coaching for Classes 10, 11 &amp; 12 by Rakesh Debbarma, M.Sc IIT Delhi.</p>
              <div className="ym-footer-badges">
                <span className="ym-footer-badge"><span style={{ color: "#a78bfa", fontWeight: 700 }}>PhonePe</span><span>UPI</span></span>
                <span className="ym-footer-badge"><span style={{ color: "#34d399" }}>🔒 SSL</span><span>Secure</span></span>
              </div>
            </div>
            <div>
              <p className="ym-footer-h4">Quick links</p>
              <p className="ym-footer-item"><a href="#classes">Batches</a></p>
              <p className="ym-footer-item"><a href="#why-us">Why us</a></p>
              <p className="ym-footer-item"><a href="#about">About the teacher</a></p>
              <p className="ym-footer-item"><a href="#faq">FAQ</a></p>
              <p className="ym-footer-item"><a href="#contact">Contact</a></p>
            </div>
            <div>
              <p className="ym-footer-h4">Batches</p>
              <p className="ym-footer-item">Class 10: Mon &amp; Wed, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹600</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹700</span></p>
              <p className="ym-footer-item">Class 11: Tue &amp; Fri, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹800</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹900</span></p>
              <p className="ym-footer-item">Class 12: Thu &amp; Sat, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹900</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹1000</span></p>
              <p className="ym-footer-item" style={{ color: "#d9a93a", marginTop: "10px" }}>Offline in Khumulwng: launching soon</p>
            </div>
            <div>
              <p className="ym-footer-h4">Contact</p>
              <p className="ym-footer-item">👨‍🏫 <strong style={{ color: "rgba(255,255,255,0.85)" }}>Rakesh Debbarma</strong></p>
              <p className="ym-footer-item">🎓 M.Sc Mathematics, IIT Delhi</p>
              <p className="ym-footer-item">📱 <a href="tel:9366030347">9366030347</a></p>
              <p className="ym-footer-item">✉️ <a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a></p>
              <p className="ym-footer-item">📍 Khumulwng, Tripura</p>
            </div>
          </div>
          <div className="ym-footer-visitor-bar">
            <span className={`ym-footer-visitor-dot${counterError ? " error" : ""}`} />
            {counterLoading ? (<span className="ym-skeleton" style={{ width: 44, height: "1.2em" }} />) : (<span className="ym-footer-visitor-count">{displayCount(visitorCount)}</span>)}
            <span className="ym-footer-visitor-sep">·</span>
            <span className="ym-footer-visitor-label">people have visited this site</span>
            <span className="ym-footer-visitor-sep">·</span>
            <span className="ym-footer-visitor-label" style={{ color: counterError ? "#f59e0b" : "#22c55e", fontSize: "10px" }}>{counterError ? "⚠ counter offline" : "● live"}</span>
          </div>
          <hr className="ym-footer-divider" />
          <div className="ym-footer-policy-links">
            {[{ label: "Terms & Conditions", href: POLICY.terms }, { label: "Privacy Policy", href: POLICY.privacy }, { label: "Refund & Cancellation Policy", href: POLICY.refund }].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="ym-footer-policy-link">{l.label}</a>
            ))}
          </div>
          <div className="ym-footer-copy">
            <p>© {new Date().getFullYear()} Yarwng Mathematics. All rights reserved.</p>
            <p>Managed by Rakesh Debbarma · M.Sc Mathematics, IIT Delhi</p>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="ym-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }} role="dialog" aria-modal="true" aria-label="Registration modal">
          <div className="ym-modal">
            <div className="ym-modal-head">
              <button onClick={closeModal} className="ym-modal-close" aria-label="Close modal">×</button>
              <div className="ym-modal-steps">
                {["form", "payment"].map((s, i) => {
                  const stepIdx = ["form", "payment"].indexOf(step);
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div className={`ym-modal-step ${i === stepIdx ? "current" : i < stepIdx ? "done" : "future"}`}>{i < stepIdx ? "✓" : i + 1}</div>
                      {i < 1 && <div className={`ym-modal-step-line ${i < stepIdx ? "done" : "future"}`} />}
                    </div>
                  );
                })}
              </div>
              <img className="ym-modal-logo" src={LOGO} alt="" />
              <div className="ym-modal-title">{step === "form" ? "Join Yarwng Mathematics" : "Pay via PhonePe"}</div>
              <div className="ym-modal-sub">{step === "form" ? "Fill your details to proceed" : `${studentClass} · ₹${pay?.offer}/month`}</div>
            </div>

            <div className="ym-modal-body">
              {step === "form" && (
                <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}>
                  <div className="ym-form-info"><span>ℹ️</span><span>Your details will be saved after confirming payment.</span></div>
                  <div className="ym-form-stack">
                    <div className="ym-form-group"><label className="ym-form-label">Student Name *</label><input type="text" placeholder="Full name of the student" value={name} onChange={(e) => setName(e.target.value)} required className="ym-input" /></div>
                    <div className="ym-form-group"><label className="ym-form-label">WhatsApp Number *</label><input type="tel" placeholder="10-digit WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required className="ym-input" /></div>
                    <div className="ym-form-row">
                      <div className="ym-form-group"><label className="ym-form-label">Class *</label><select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required className="ym-input"><option value="">Select Class</option><option>Class 10</option><option>Class 11</option><option>Class 12</option></select></div>
                      <div className="ym-form-group"><label className="ym-form-label">Board *</label><select value={board} onChange={(e) => setBoard(e.target.value)} required className="ym-input"><option value="">Select Board</option><option value="CBSE">CBSE</option><option value="TBSE">TBSE</option><option value="ICSE">ICSE</option></select></div>
                    </div>
                    <div className="ym-form-row">
                      <div className="ym-form-group"><label className="ym-form-label">Medium *</label><select value={medium} onChange={(e) => setMedium(e.target.value)} required className="ym-input"><option value="English">English</option><option value="Bengali">Bengali</option><option value="Kokborok">Kokborok</option></select></div>
                      <div className="ym-form-group"><label className="ym-form-label">Mode *</label><select value={mode} onChange={(e) => setMode(e.target.value)} required className="ym-input"><option value="">Select Mode</option><option value="Online">Online</option><option value="Offline">Offline</option></select></div>
                    </div>
                    <div className="ym-form-group"><label className="ym-form-label">School Name *</label><input type="text" placeholder="Name of the school" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required className="ym-input" /></div>
                    <div className="ym-form-group"><label className="ym-form-label">Address *</label><input type="text" placeholder="Village / Town / Area" value={address} onChange={(e) => setAddress(e.target.value)} required className="ym-input" /></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fdf6e3", border: "1px solid #f0dca6", borderRadius: "10px", padding: "9px 12px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ fontSize: "12.5px", color: "#7a5a0c", fontWeight: 500 }}>Classes are taught in <strong>English Medium</strong>.</span></div>
                    <p className="ym-policy-text">By registering you agree to our <a href={POLICY.terms} target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>, <a href={POLICY.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={POLICY.refund} target="_blank" rel="noopener noreferrer">Refund Policy</a>.</p>
                    <button type="submit" className="ym-submit-btn">Continue to payment</button>
                  </div>
                </form>
              )}

              {step === "payment" && pay && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#0f1f3d" }}>Complete your payment</h3>
                  <p style={{ color: "#5f6f8a", fontSize: 14, marginBottom: 20 }}>You&apos;ll be securely redirected to PhonePe to pay.</p>
                  <div className="ym-pay-summary">
                    <div>
                      <p className="ym-pay-class">{studentClass} · {board} · {mode}</p>
                      <p><span className="ym-pay-amount">₹{pay.offer}</span><span className="ym-pay-unit"> /month</span></p>
                    </div>
                    <div className="ym-pay-discount">{discount}% OFF<br /><span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "11px" }}>₹{pay.original}</span></div>
                  </div>
                  <button onClick={handleSubmit as any} disabled={submitting} className="ym-confirm-btn">
                    {submitting ? (<><svg className="ym-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" /></svg>Redirecting to PhonePe…</>) : (<>Pay ₹{pay.offer} with PhonePe</>)}
                  </button>
                  {payError && <div className="ym-pay-err">⚠️ {payError}</div>}
                  <p className="ym-pay-secure">🔒 Powered by PhonePe Payment Gateway · SSL Secured</p>
                  <button onClick={() => { setStep("form"); setPayError(""); setSubmitting(false); }} style={{ marginTop: 14, background: "none", border: "none", color: "#5f6f8a", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>← Edit details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}