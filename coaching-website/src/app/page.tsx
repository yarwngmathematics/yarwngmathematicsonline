"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";

const TEST_MODE = false;

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

const WEEK = [
  { d: "Mon", c: "Class 10" },
  { d: "Tue", c: "Class 11" },
  { d: "Wed", c: "Class 10" },
  { d: "Thu", c: "Class 12" },
  { d: "Fri", c: "Class 11" },
  { d: "Sat", c: "Class 12" },
  { d: "Sun", c: "" },
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
        const response = await fetch(VISITOR_COUNT_ENDPOINT, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.success && typeof data.count === "number") {
          setVisitorCount(data.count);
        } else {
          throw new Error("Unexpected response format");
        }
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
    if (params.get("enroll") === "1") {
      const m = params.get("mode") ?? "";
      openModal(m);
    }
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

  const displayCount = (count: number | null) => { if (count === null) return "—"; return count.toLocaleString("en-IN"); };

  /* ───────── TOP BANNER CAROUSEL (unchanged except logo) ───────── */
  const banners = [
    {
      bg: "linear-gradient(110deg, #fff7e6 0%, #ffe8b8 100%)",
      dark: false,
      title: ["ADMISSIONS", "OPEN NOW"],
      sub: "Maths for Class 10 · 11 · 12",
      pill: "Live Online Classes on Google Meet",
      points: ["Taught by IIT Delhi M.Sc faculty", "Weekly tests & feedback", "Doubt support on WhatsApp", "Fixed weekly timetable"],
      priceLabel: "Starting at",
      price: "₹600/mo",
      cta: "Enroll Now",
      action: () => openModal(),
    },
    {
      bg: "linear-gradient(110deg, #e0ecff 0%, #b9d3ff 100%)",
      dark: false,
      title: ["CLASS 10", "BATCH"],
      sub: "Mon & Wed · 5:00 – 7:00 PM",
      pill: "Board Exam Foundation",
      points: ["Algebra, Geometry, Trigonometry", "Statistics & Probability", "Regular tests", "Doubt sessions included"],
      priceLabel: "₹700",
      price: "₹600/mo",
      cta: "Join Class 10",
      action: () => openModal(),
    },
    {
      bg: "linear-gradient(110deg, #e4f8ee 0%, #b7ecd0 100%)",
      dark: false,
      title: ["CLASS 11", "BATCH"],
      sub: "Tue & Fri · 5:00 – 7:00 PM",
      pill: "Build a Strong Base",
      points: ["Sets, Relations & Functions", "Trigonometry", "Calculus basics", "Ready for Class 12 & entrance exams"],
      priceLabel: "₹900",
      price: "₹800/mo",
      cta: "Join Class 11",
      action: () => openModal(),
    },
    {
      bg: "linear-gradient(110deg, #f1e8ff 0%, #d5bfff 100%)",
      dark: false,
      title: ["CLASS 12", "BATCH"],
      sub: "Thu & Sat · 5:00 – 7:00 PM",
      pill: "Board Exam Focused",
      points: ["Calculus, Vectors, 3D Geometry", "Probability & Linear Programming", "Previous year paper practice", "Weekly mock tests"],
      priceLabel: "₹1000",
      price: "₹900/mo",
      cta: "Join Class 12",
      action: () => openModal(),
    },
    {
      bg: "linear-gradient(110deg, #3b1d8f 0%, #5b21b6 100%)",
      dark: true,
      title: ["OFFLINE", "CLASSES"],
      sub: "Khumulwng, Tripura",
      pill: "Launching Soon · Limited Seats",
      points: ["Face-to-face classroom teaching", "Personal attention for every student", "Same IIT-level faculty", "Register your interest today"],
      priceLabel: "",
      price: "Free to register",
      cta: "Register Interest",
      action: () => openModal("Offline"),
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

  return (
    <main id="home" className="ym-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0b3a7a; --navy-deep: #08254f; --navy-ink: #061a38; --gold: #d9a93a; --gold-soft: #f4e3b3;
          --paper: #f5f8fd; --line: #d6e0ef; --teal: #0f766e; --text: #1b2a44; --muted: #5a6b86;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; color: var(--text); background: #fff; }
        .ym-page { font-family: 'Outfit', sans-serif; }
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
        a:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

        /* ═════════ TOP BANNER CAROUSEL ═════════ */
        .bn-wrap { position: relative; width: 100%; overflow: hidden; background: #fff; }
        .bn-track { display: flex; transition: transform 0.6s cubic-bezier(.65,.05,.36,1); will-change: transform; }
        .bn-slide { flex: 0 0 100%; min-width: 0; }
        .bn-inner { max-width: 1240px; margin: 0 auto; min-height: 250px; padding: 22px 64px; display: grid; grid-template-columns: 1.05fr 1.6fr 0.75fr; align-items: center; gap: 28px; }
        .bn-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bn-logo { width: 58px; height: 58px; border-radius: 14px; background: #fff; padding: 3px; object-fit: contain; display: block; box-shadow: 0 3px 12px rgba(6,26,56,0.22); }
        .bn-brand-name { font-weight: 800; font-size: 15px; line-height: 1.05; color: #14122b; letter-spacing: 0.01em; }
        .bn-title { font-weight: 900; font-size: clamp(2rem, 3.8vw, 3.2rem); line-height: 0.98; color: #14122b; letter-spacing: -0.02em; }
        .bn-sub { margin-top: 10px; font-weight: 700; font-size: clamp(0.95rem, 1.5vw, 1.3rem); color: #1d4ed8; }
        .bn-dark .bn-brand-name, .bn-dark .bn-title { color: #fff; }
        .bn-dark .bn-sub { color: #fcd34d; }
        .bn-pill { display: inline-block; background: #1e3a8a; color: #fff; font-weight: 700; font-size: clamp(0.85rem, 1.6vw, 1.35rem); padding: 9px 26px 9px 18px; border-radius: 10px 40px 10px 10px; margin-bottom: 16px; }
        .bn-points { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 22px; margin-bottom: 16px; }
        .bn-point { display: flex; align-items: flex-start; gap: 8px; font-weight: 500; font-size: 14px; color: #1f2937; line-height: 1.35; }
        .bn-point::before { content: '✓'; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #1d4ed8; color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .bn-dark .bn-point { color: #f3e8ff; }
        .bn-dark .bn-point::before { background: #fcd34d; color: #3b1d8f; }
        .bn-buy { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .bn-price-old { font-size: 14px; color: #6b7280; text-decoration: line-through; font-weight: 600; line-height: 1; display: block; margin-bottom: 2px; }
        .bn-price { font-family: 'Space Grotesk', 'Outfit', sans-serif; font-weight: 700; font-size: clamp(1.5rem, 2.4vw, 2.1rem); color: #1d4ed8; line-height: 1; }
        .bn-dark .bn-price-old { color: #d8b4fe; }
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
        .bn-dots { display: flex; justify-content: center; gap: 9px; padding: 14px 0 6px; background: #faf8ff; }
        .bn-dot { width: 9px; height: 9px; border-radius: 50%; border: none; background: #d1d5db; cursor: pointer; padding: 0; transition: all 0.25s; }
        .bn-dot.on { background: #14122b; width: 26px; border-radius: 6px; }
        @media (max-width: 980px) { .bn-inner { grid-template-columns: 1fr 1.5fr; padding: 22px 56px; } .bn-photo { display: none; } }
        @media (max-width: 700px) {
          .bn-inner { grid-template-columns: 1fr; gap: 14px; padding: 20px 20px 24px; min-height: 0; }
          .bn-points { grid-template-columns: 1fr; gap: 7px; }
          .bn-arrow { display: none; }
          .bn-pill { padding: 8px 20px 8px 14px; }
          .bn-cta { padding: 12px 28px; font-size: 15px; }
        }
        @media (prefers-reduced-motion: reduce) { .bn-track { transition: none; } html { scroll-behavior: auto; } }

        /* ═════════ NEW DESIGN: graph-paper + navy & gold ═════════ */
        .yw-wrap { max-width: 1120px; margin: 0 auto; }
        .yw-h2 { font-family: 'Fraunces', Georgia, serif; font-weight: 700; font-size: clamp(1.7rem, 3.4vw, 2.5rem); line-height: 1.15; color: var(--navy-ink); letter-spacing: -0.01em; }
        .yw-lead { color: var(--muted); font-size: 16px; line-height: 1.7; max-width: 560px; margin-top: 10px; }
        .yw-btn { display: inline-flex; align-items: center; justify-content: center; font-family: inherit; font-weight: 700; font-size: 16px; border-radius: 6px; padding: 14px 28px; cursor: pointer; text-decoration: none; transition: transform 0.15s, background 0.2s; border: 2px solid transparent; }
        .yw-btn:hover { transform: translateY(-1px); }
        .yw-btn-gold { background: var(--gold); color: var(--navy-ink); }
        .yw-btn-gold:hover { background: #e6b94c; }
        .yw-btn-navy { background: var(--navy); color: #fff; }
        .yw-btn-navy:hover { background: var(--navy-deep); }
        .yw-btn-ghost { background: transparent; color: var(--navy); border-color: var(--navy); }
        .yw-btn-ghost:hover { background: rgba(11,58,122,0.06); }

        /* intro on graph paper */
        .yw-intro { padding: 76px 20px 70px; background-color: var(--paper); background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 32px 32px; background-position: -1px -1px; border-bottom: 4px solid var(--navy); }
        .yw-intro-grid { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 56px; align-items: center; }
        .yw-intro h1 { font-family: 'Fraunces', Georgia, serif; font-weight: 800; font-size: clamp(2.1rem, 4.4vw, 3.5rem); line-height: 1.08; color: var(--navy-ink); letter-spacing: -0.02em; }
        .yw-intro p { margin-top: 20px; font-size: 18px; line-height: 1.65; max-width: 540px; color: var(--text); background: rgba(245,248,253,0.85); }
        .yw-intro-btns { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; }
        .yw-arch { position: relative; width: 100%; max-width: 330px; margin: 0 auto; }
        .yw-arch-frame { border-radius: 999px 999px 18px 18px; overflow: hidden; border: 5px solid var(--navy); background: var(--gold-soft); aspect-ratio: 4 / 5; box-shadow: 12px 12px 0 var(--gold); }
        .yw-arch-frame img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .yw-arch-tag { position: absolute; left: -18px; bottom: 26px; background: var(--navy-ink); color: #fff; padding: 12px 16px; border-radius: 8px; font-size: 13px; line-height: 1.45; max-width: 220px; }
        .yw-arch-tag strong { display: block; font-size: 15px; color: var(--gold); }

        .yw-facts { background: var(--navy); color: #fff; padding: 26px 20px; }
        .yw-facts-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .yw-fact { border-left: 3px solid var(--gold); padding-left: 14px; }
        .yw-fact b { display: block; font-family: 'Fraunces', serif; font-size: 26px; font-weight: 700; line-height: 1.1; }
        .yw-fact span { font-size: 13px; color: #b9cbe8; }

        /* batches */
        .yw-sec { padding: 84px 20px; }
        .yw-batch-list { margin-top: 36px; border-top: 2px solid var(--navy-ink); }
        .yw-batch { display: grid; grid-template-columns: 150px 1.4fr 1.5fr auto; gap: 26px; align-items: center; padding: 26px 6px; border-bottom: 1px solid var(--line); }
        .yw-batch-name { font-family: 'Fraunces', serif; font-weight: 700; font-size: 26px; color: var(--navy-ink); }
        .yw-batch-when b { display: block; font-size: 16px; color: var(--text); }
        .yw-batch-when span { font-size: 14px; color: var(--muted); }
        .yw-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .yw-chip { background: var(--paper); border: 1px solid var(--line); color: var(--navy); font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 4px; }
        .yw-batch-note { font-size: 13px; color: var(--muted); margin-top: 8px; line-height: 1.5; }
        .yw-batch-buy { text-align: right; }
        .yw-price { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; color: var(--navy); line-height: 1; }
        .yw-price small { font-size: 13px; font-weight: 500; color: var(--muted); }
        .yw-price-was { display: block; font-size: 13px; color: var(--muted); text-decoration: line-through; margin-bottom: 4px; }
        .yw-batch-buy .yw-btn { margin-top: 10px; padding: 10px 20px; font-size: 14px; }

        /* week strip */
        .yw-week-sec { background: var(--paper); padding: 70px 20px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .yw-week { margin-top: 30px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
        .yw-day { background: #fff; border: 1px solid var(--line); border-top: 5px solid var(--line); border-radius: 6px; padding: 14px 10px 16px; text-align: center; }
        .yw-day b { display: block; font-size: 15px; color: var(--navy-ink); }
        .yw-day span { display: block; margin-top: 8px; font-size: 13px; font-weight: 700; }
        .yw-day small { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); }
        .yw-day.c10 { border-top-color: var(--navy); } .yw-day.c10 span { color: var(--navy); }
        .yw-day.c11 { border-top-color: var(--gold); } .yw-day.c11 span { color: #9a7413; }
        .yw-day.c12 { border-top-color: var(--teal); } .yw-day.c12 span { color: var(--teal); }
        .yw-day.off span { color: #94a3b8; font-weight: 500; }

        /* offline */
        .yw-off { background: var(--navy-ink); color: #fff; padding: 70px 20px; position: relative; overflow: hidden; }
        .yw-off::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 32px 32px; }
        .yw-off-grid { position: relative; display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: center; }
        .yw-off h2 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(1.7rem, 3.4vw, 2.5rem); line-height: 1.15; }
        .yw-off p { margin-top: 12px; color: #b9cbe8; line-height: 1.7; max-width: 520px; }
        .yw-off-box { border: 2px solid var(--gold); border-radius: 10px; padding: 26px; background: rgba(8,37,79,0.7); }
        .yw-off-box b { display: block; font-family: 'Fraunces', serif; font-size: 22px; color: var(--gold); }
        .yw-off-box span { display: block; margin: 6px 0 18px; font-size: 14px; color: #d5e1f5; }

        /* steps */
        .yw-steps { margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; counter-reset: s; position: relative; }
        .yw-step { position: relative; padding: 0 28px 0 0; }
        .yw-step::before { counter-increment: s; content: counter(s); display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: var(--navy); color: #fff; font-family: 'Fraunces', serif; font-weight: 700; font-size: 20px; position: relative; z-index: 1; }
        .yw-step::after { content: ''; position: absolute; top: 21px; left: 44px; right: 0; height: 2px; background: repeating-linear-gradient(90deg, var(--navy) 0 8px, transparent 8px 14px); }
        .yw-step:last-child::after { display: none; }
        .yw-step h3 { margin-top: 16px; font-size: 18px; color: var(--navy-ink); }
        .yw-step p { margin-top: 6px; color: var(--muted); font-size: 14.5px; line-height: 1.65; }

        /* reasons */
        .yw-why { background: var(--paper); border-top: 1px solid var(--line); }
        .yw-why-grid { margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 56px; }
        .yw-why-item { padding: 22px 0 22px 22px; border-bottom: 1px solid var(--line); border-left: 4px solid var(--gold); margin-bottom: 0; }
        .yw-why-item h3 { font-family: 'Fraunces', serif; font-size: 19px; color: var(--navy-ink); }
        .yw-why-item p { margin-top: 6px; color: var(--muted); font-size: 15px; line-height: 1.65; }

        /* mentor */
        .yw-mentor { display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 56px; align-items: center; }
        .yw-mentor .yw-arch-frame { box-shadow: -12px 12px 0 var(--navy); border-color: var(--gold); }
        .yw-mentor p { color: var(--text); font-size: 16.5px; line-height: 1.8; margin-top: 16px; max-width: 600px; }
        .yw-quote { margin-top: 22px; padding: 14px 18px; border-left: 4px solid var(--gold); background: var(--paper); font-family: 'Fraunces', serif; font-size: 18px; color: var(--navy); }

        /* contact */
        .yw-contact { background: var(--navy); color: #fff; padding: 76px 20px; }
        .yw-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .yw-contact h2 { font-family: 'Fraunces', serif; font-size: clamp(1.7rem, 3.2vw, 2.4rem); line-height: 1.15; }
        .yw-crow { display: flex; gap: 14px; align-items: flex-start; margin-top: 22px; }
        .yw-crow i { font-style: normal; width: 42px; height: 42px; border-radius: 8px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .yw-crow p { font-size: 15px; font-weight: 500; }
        .yw-crow small { display: block; color: #b9cbe8; font-size: 12.5px; margin-top: 2px; }
        .yw-crow a { color: var(--gold-soft); text-decoration: none; }
        .yw-crow a:hover { text-decoration: underline; }
        .yw-cta { background: #fff; color: var(--text); border-radius: 12px; padding: 32px; border-top: 6px solid var(--gold); }
        .yw-cta h3 { font-family: 'Fraunces', serif; font-size: 24px; color: var(--navy-ink); }
        .yw-cta p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.6; }
        .yw-cta ul { list-style: none; margin: 18px 0 22px; }
        .yw-cta li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--line); font-size: 15px; }
        .yw-cta li b { color: var(--navy); font-family: 'Space Grotesk', sans-serif; }
        .yw-cta .yw-btn { width: 100%; }

        /* footer */
        .ym-footer { background: var(--navy-ink); color: rgba(255,255,255,0.6); padding: 48px 20px 22px; border-top: 4px solid var(--gold); }
        .ym-footer-inner { max-width: 1120px; margin: 0 auto; }
        .ym-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 36px; margin-bottom: 32px; }
        .ym-footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .ym-footer-logo img { width: 52px; height: 52px; border-radius: 10px; background: #fff; padding: 3px; object-fit: contain; }
        .ym-footer-brand-name { color: #fff; font-family: 'Fraunces', serif; font-weight: 700; font-size: 21px; }
        .ym-footer-brand-tagline { color: var(--gold); font-style: italic; font-size: 13px; margin-bottom: 10px; }
        .ym-footer-brand-desc { font-size: 13px; line-height: 1.7; }
        .ym-footer-badges { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
        .ym-footer-badge { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px 10px; font-size: 11px; }
        .ym-footer-h4 { color: #fff; font-weight: 700; font-size: 14px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid var(--gold); display: inline-block; }
        .ym-footer-item { font-size: 13px; margin-bottom: 8px; line-height: 1.5; }
        .ym-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 18px; }
        .ym-footer-visitor-bar { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px 24px; margin-bottom: 24px; flex-wrap: wrap; }
        .ym-footer-visitor-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        .ym-footer-visitor-dot.error { background: #f59e0b; animation: none; }
        .ym-footer-visitor-count { color: #fff; font-weight: 700; font-size: 18px; font-family: 'Fraunces', serif; }
        .ym-footer-visitor-label { color: rgba(255,255,255,0.4); font-size: 12px; }
        .ym-footer-visitor-sep { color: rgba(255,255,255,0.15); font-size: 16px; }
        .ym-skeleton { display: inline-block; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% auto; animation: skeletonShimmer 1.5s linear infinite; border-radius: 4px; height: 1em; width: 40px; vertical-align: middle; }
        .ym-footer-policy-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; margin-bottom: 14px; }
        .ym-footer-policy-link { font-size: 12px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; padding: 4px 12px; border-right: 1px solid rgba(255,255,255,0.12); }
        .ym-footer-policy-link:last-child { border-right: none; }
        .ym-footer-policy-link:hover { color: var(--gold); }
        .ym-footer-copy { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 12px; text-align: center; }

        @media (max-width: 900px) {
          .yw-intro-grid, .yw-mentor, .yw-contact-grid, .yw-off-grid { grid-template-columns: 1fr; gap: 36px; }
          .yw-arch { max-width: 280px; }
          .yw-arch-tag { left: 0; }
          .yw-facts-row { grid-template-columns: 1fr 1fr; }
          .yw-batch { grid-template-columns: 1fr; gap: 12px; }
          .yw-batch-buy { text-align: left; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
          .yw-batch-buy .yw-btn { margin-top: 0; }
          .yw-price-was { display: inline; margin-right: 8px; }
          .yw-week { grid-template-columns: repeat(4, 1fr); }
          .yw-steps { grid-template-columns: 1fr; gap: 28px; }
          .yw-step::after { display: none; }
          .yw-why-grid { grid-template-columns: 1fr; }
          .ym-footer-grid { grid-template-columns: 1fr; gap: 28px; }
          .yw-sec { padding: 60px 18px; }
          .yw-intro { padding: 48px 18px; }
        }
        @media (max-width: 520px) { .yw-intro-btns .yw-btn { width: 100%; } .yw-week { grid-template-columns: repeat(3, 1fr); } }

        /* modal */
        .ym-overlay { position: fixed; inset: 0; background: rgba(6,26,56,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 14px; backdrop-filter: blur(4px); }
        .ym-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 460px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); overflow: hidden; max-height: 94vh; overflow-y: auto; position: relative; }
        .ym-modal-head { background: linear-gradient(135deg, #0b3a7a 0%, #061a38 100%); padding: 24px 28px 20px; color: #fff; position: sticky; top: 0; z-index: 10; border-bottom: 4px solid var(--gold); }
        .ym-modal-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 30px; height: 30px; border-radius: 7px; font-size: 17px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
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
        .ym-modal-title { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 700; }
        .ym-modal-sub { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 3px; }
        .ym-modal-body { padding: 24px 28px 28px; }
        .ym-form-info { background: #eef4fc; border: 1px solid #cfdcf0; border-radius: 8px; padding: 10px 14px; display: flex; gap: 7px; font-size: 12px; color: var(--navy); margin-bottom: 18px; }
        .ym-form-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 5px; display: block; }
        .ym-form-group { display: flex; flex-direction: column; }
        .ym-input { width: 100%; border: 1.5px solid #d3dbe8; padding: 11px 14px; border-radius: 8px; font-size: 14px; font-family: 'Outfit', sans-serif; color: var(--text); outline: none; transition: border-color 0.2s; background: #fff; }
        .ym-input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(11,58,122,0.14); }
        .ym-input::placeholder { color: #9aa7bb; }
        .ym-form-stack { display: flex; flex-direction: column; gap: 12px; }
        .ym-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ym-policy-text { font-size: 11px; color: #8795ab; text-align: center; line-height: 1.6; }
        .ym-policy-text a { color: var(--navy); text-decoration: none; }
        .ym-submit-btn { width: 100%; background: var(--navy); color: #fff; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; margin-top: 3px; font-family: inherit; }
        .ym-submit-btn:hover { background: var(--navy-deep); }
        .ym-pay-summary { background: #eef4fc; border: 1.5px solid #cfdcf0; border-radius: 10px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; text-align: left; }
        .ym-pay-class { font-size: 12px; color: var(--navy); font-weight: 600; margin-bottom: 3px; }
        .ym-pay-amount { font-size: 26px; font-weight: 800; color: var(--navy-ink); }
        .ym-pay-unit { font-size: 12px; color: var(--muted); }
        .ym-pay-discount { background: var(--gold-soft); color: #7a5a0c; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 8px; text-align: center; }
        .ym-confirm-btn { width: 100%; background: var(--gold); color: var(--navy-ink); padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        .ym-confirm-btn:hover:not(:disabled) { background: #e6b94c; }
        .ym-confirm-btn:disabled, .ym-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-err { background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 11px 14px; color: #dc2626; font-size: 13px; text-align: center; margin-top: 10px; }
        .ym-pay-secure { text-align: center; margin-top: 12px; font-size: 11px; color: #8795ab; }
        .ym-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* NAVBAR */}
      <Navbar onEnroll={() => openModal()} />

      {/* ───── TOP BANNER CAROUSEL (live part — only the logo changed) ───── */}
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
                    <img className="bn-logo" src="/logo.png" alt="Yarwng Mathematics logo" />
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

      {/* ───── INTRO (graph-paper) ───── */}
      <section className="yw-intro" aria-label="Introduction">
        <div className="yw-wrap yw-intro-grid">
          <div>
            <h1>Maths that makes sense, from someone who studied it at IIT Delhi</h1>
            <p>
              Small, steady, live classes for Class 10, 11 and 12. We work through the reasoning behind every
              chapter, then practise until it sticks. Fees start at ₹600 a month.
            </p>
            <div className="yw-intro-btns">
              <button onClick={() => openModal()} className="yw-btn yw-btn-gold">Reserve a seat</button>
              <a href="#classes" className="yw-btn yw-btn-ghost">See the batches</a>
            </div>
          </div>
          <div className="yw-arch">
            <div className="yw-arch-frame"><img src="/profile.jpg" alt="Rakesh Debbarma" /></div>
            <div className="yw-arch-tag"><strong>Rakesh Debbarma</strong>M.Sc Mathematics, IIT Delhi</div>
          </div>
        </div>
      </section>

      <section className="yw-facts" aria-label="Quick facts">
        <div className="yw-wrap yw-facts-row">
          <div className="yw-fact"><b>3 batches</b><span>Class 10, 11 and 12</span></div>
          <div className="yw-fact"><b>2 hours</b><span>per class, twice a week</span></div>
          <div className="yw-fact"><b>5 to 7 PM</b><span>every batch, every week</span></div>
          <div className="yw-fact"><b>₹600</b><span>a month, to begin with</span></div>
        </div>
      </section>

      {/* BATCHES */}
      <section id="classes" className="yw-sec">
        <div className="yw-wrap">
          <h2 className="yw-h2">Choose your batch</h2>
          <p className="yw-lead">Live on Google Meet from anywhere in India. Pick the class you are in and the fee is monthly.</p>
          <div className="yw-batch-list">
            {(Object.keys(PAYMENT.classes) as Array<keyof typeof PAYMENT.classes>).map((cls) => {
              const p = PAYMENT.classes[cls];
              const offerPrice = p.offer === 1 ? p.original : p.offer;
              const s = SLOTS[cls];
              return (
                <div key={cls} className="yw-batch">
                  <h3 className="yw-batch-name">{cls}</h3>
                  <div className="yw-batch-when">
                    <b>{s.days}</b>
                    <span>{s.time}</span>
                  </div>
                  <div>
                    <div className="yw-chips">{s.desc.slice(0, 4).map((t) => (<span key={t} className="yw-chip">{t}</span>))}</div>
                    <p className="yw-batch-note">{s.desc[4]}</p>
                  </div>
                  <div className="yw-batch-buy">
                    <div>
                      <span className="yw-price-was">₹{p.original}</span>
                      <span className="yw-price">₹{offerPrice}<small> / month</small></span>
                    </div>
                    <button onClick={() => openForClass(cls)} className="yw-btn yw-btn-navy">Join {cls}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WEEK */}
      <section className="yw-week-sec" aria-label="Weekly timetable">
        <div className="yw-wrap">
          <h2 className="yw-h2">Your week at a glance</h2>
          <p className="yw-lead">Each batch meets twice a week, 5 to 7 in the evening. Sunday is free for revision.</p>
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

      {/* OFFLINE */}
      <section className="yw-off">
        <div className="yw-wrap yw-off-grid">
          <div>
            <h2>A real classroom is coming to Khumulwng</h2>
            <p>Prefer a blackboard and a teacher in the room? Offline batches are being planned with small groups so every student gets personal attention. Tell us you are interested and we will contact you first.</p>
          </div>
          <div className="yw-off-box">
            <b>Offline batch, Khumulwng</b>
            <span>Seats are limited. Registering interest is free.</span>
            <button onClick={() => openModal("Offline")} className="yw-btn yw-btn-gold" style={{ width: "100%" }}>Register interest</button>
          </div>
        </div>
      </section>

      {/* HOW TO JOIN */}
      <section className="yw-sec">
        <div className="yw-wrap">
          <h2 className="yw-h2">Joining takes three steps</h2>
          <div className="yw-steps">
            {steps.map((s) => (
              <div key={s.t} className="yw-step"><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why-us" className="yw-sec yw-why">
        <div className="yw-wrap">
          <h2 className="yw-h2">What students get in every class</h2>
          <div className="yw-why-grid">
            {reasons.map((r) => (
              <div key={r.t} className="yw-why-item"><h3>{r.t}</h3><p>{r.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTOR */}
      <section id="about" className="yw-sec">
        <div className="yw-wrap yw-mentor">
          <div className="yw-arch"><div className="yw-arch-frame"><img src="/profile.jpg" alt="Rakesh Debbarma, M.Sc Mathematics, IIT Delhi" /></div></div>
          <div>
            <h2 className="yw-h2">Meet your teacher, Rakesh Debbarma</h2>
            <p>Yarwng Mathematics began with a simple idea: students in Tripura should not have to leave home to learn maths from someone trained at a top institute.</p>
            <p>Rakesh sir holds an M.Sc in Mathematics from IIT Delhi. He teaches by asking students to explain their steps, fixing the misunderstanding underneath, and giving plenty of problems to practise on.</p>
            <div className="yw-quote">Learn the concept first. The marks follow.</div>
            <div style={{ marginTop: 26 }}><button onClick={() => openModal()} className="yw-btn yw-btn-navy">Start learning</button></div>
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
              <li><span>Class 10</span><b>₹600 / month</b></li>
              <li><span>Class 11</span><b>₹800 / month</b></li>
              <li><span>Class 12</span><b>₹900 / month</b></li>
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
                <img src="/logo.png" alt="Yarwng Mathematics logo" />
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
              <p className="ym-footer-h4">Contact</p>
              <p className="ym-footer-item">👨‍🏫 <strong style={{ color: "rgba(255,255,255,0.8)" }}>Rakesh Debbarma</strong></p>
              <p className="ym-footer-item">🎓 M.Sc Mathematics, IIT Delhi</p>
              <p className="ym-footer-item">📱 <a href="tel:9366030347" style={{ color: "#f4e3b3", textDecoration: "none" }}>9366030347</a></p>
              <p className="ym-footer-item">✉️ <a href="mailto:yarwngmathematics@gmail.com" style={{ color: "#f4e3b3", textDecoration: "none" }}>yarwngmathematics@gmail.com</a></p>
              <p className="ym-footer-item">📍 Khumulwng, Tripura</p>
            </div>
            <div>
              <p className="ym-footer-h4">Batches</p>
              <p className="ym-footer-item">Class 10: Mon &amp; Wed, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹600</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹700</span></p>
              <p className="ym-footer-item">Class 11: Tue &amp; Fri, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹800</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹900</span></p>
              <p className="ym-footer-item">Class 12: Thu &amp; Sat, 5 to 7 PM, <span style={{ color: "#f4e3b3" }}>₹900</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹1000</span></p>
              <p className="ym-footer-item" style={{ color: "#d9a93a", marginTop: "10px" }}>Offline in Khumulwng: launching soon</p>
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
              <img className="ym-modal-logo" src="/logo.png" alt="" />
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
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fdf6e3", border: "1px solid #f0dca6", borderRadius: "8px", padding: "9px 12px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ fontSize: "12px", color: "#7a5a0c", fontWeight: 500 }}>Classes are taught in <strong>English Medium</strong>.</span></div>
                    <p className="ym-policy-text">By registering you agree to our <a href={POLICY.terms} target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>, <a href={POLICY.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={POLICY.refund} target="_blank" rel="noopener noreferrer">Refund Policy</a>.</p>
                    <button type="submit" className="ym-submit-btn">Continue to payment</button>
                  </div>
                </form>
              )}

              {step === "payment" && pay && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#061a38" }}>Complete your payment</h3>
                  <p style={{ color: "#5a6b86", fontSize: 14, marginBottom: 20 }}>You&apos;ll be securely redirected to PhonePe to pay.</p>
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
                  <button onClick={() => { setStep("form"); setPayError(""); setSubmitting(false); }} style={{ marginTop: 14, background: "none", border: "none", color: "#5a6b86", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>← Edit details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}