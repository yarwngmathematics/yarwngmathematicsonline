"use client";
import Link from "next/link";
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

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "payment"
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
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
      const mode = params.get("mode") ?? "";
      openModal(mode);
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

  /* ───────── TOP BANNER CAROUSEL (5 slides, PW-style) ───────── */
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

  return (
    <main id="home" className="ym-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=DM+Serif+Display&display=swap');
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
          --purple: #5b21b6; --brand: #5b4bdb; --brand-dark: #4a3cc4; --ink: #14122b;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Outfit', sans-serif; color: var(--gray-900); background: #fff; }
        .ym-page { font-family: 'Outfit', sans-serif; }
        .ym-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes ringSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* ═════════ TOP BANNER CAROUSEL ═════════ */
        .bn-wrap { position: relative; width: 100%; overflow: hidden; background: #fff; }
        .bn-track { display: flex; transition: transform 0.6s cubic-bezier(.65,.05,.36,1); will-change: transform; }
        .bn-slide { flex: 0 0 100%; min-width: 0; }
        .bn-inner { max-width: 1240px; margin: 0 auto; min-height: 250px; padding: 22px 64px; display: grid; grid-template-columns: 1.05fr 1.6fr 0.75fr; align-items: center; gap: 28px; }
        .bn-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .bn-logo { width: 38px; height: 38px; border-radius: 50%; background: #14122b; color: #fcd34d; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
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
        @media (max-width: 980px) {
          .bn-inner { grid-template-columns: 1fr 1.5fr; padding: 22px 56px; }
          .bn-photo { display: none; }
        }
        @media (max-width: 700px) {
          .bn-inner { grid-template-columns: 1fr; gap: 14px; padding: 20px 20px 24px; min-height: 0; }
          .bn-points { grid-template-columns: 1fr; gap: 7px; }
          .bn-arrow { display: none; }
          .bn-pill { padding: 8px 20px 8px 14px; }
          .bn-cta { padding: 12px 28px; font-size: 15px; }
        }

        /* ═════════ SIMPLE HERO (PW-style) ═════════ */
        .hv { background: linear-gradient(120deg, #f4f2ff 0%, #faf3ff 50%, #fff1f6 100%); padding: 56px 20px 72px; overflow: hidden; }
        .hv-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; }
        .hv-title { font-weight: 800; font-size: clamp(2.1rem, 4.6vw, 3.6rem); line-height: 1.12; color: var(--ink); letter-spacing: -0.02em; }
        .hv-title em { font-style: normal; color: var(--brand); }
        .hv-desc { margin-top: 18px; font-size: 17px; line-height: 1.6; color: #1f1d33; max-width: 520px; }
        .hv-btns { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 14px; }
        .hv-btn { background: var(--brand); color: #fff; border: none; border-radius: 10px; padding: 17px 52px; font-size: 18px; font-weight: 700; font-family: inherit; cursor: pointer; transition: background 0.2s, transform 0.2s; }
        .hv-btn:hover { background: var(--brand-dark); transform: translateY(-1px); }
        .hv-btn-line { background: #fff; color: var(--brand); border: 2px solid var(--brand); border-radius: 10px; padding: 15px 32px; font-size: 16px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; transition: background 0.2s; }
        .hv-btn-line:hover { background: #f0edff; }
        .hv-trust { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px 26px; }
        .hv-trust span { font-size: 14px; font-weight: 600; color: #3b3957; display: flex; align-items: center; gap: 7px; }
        .hv-trust span::before { content: '✓'; width: 18px; height: 18px; border-radius: 50%; background: #16a34a; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

        .hv-art { position: relative; height: 430px; max-width: 520px; width: 100%; margin: 0 auto; }
        .hv-ring { position: absolute; border: 2px dashed #9b8cf0; border-radius: 50%; }
        .hv-ring.r1 { width: 400px; height: 400px; top: 14px; left: 56px; animation: ringSpin 60s linear infinite; }
        .hv-ring.r2 { width: 250px; height: 250px; bottom: 6px; left: 0; border-color: #c4b8fb; animation: ringSpin 45s linear infinite reverse; }
        .hv-orb { position: absolute; width: 14px; height: 14px; border-radius: 50%; }
        .hv-orb.o1 { background: #60a5fa; top: 30px; left: 232px; }
        .hv-orb.o2 { background: #fb7185; top: 210px; right: 12px; }
        .hv-orb.o3 { background: #fb923c; bottom: 20px; right: 120px; }
        .hv-orb.o4 { background: #60a5fa; bottom: 140px; left: 6px; }
        .hv-photo { position: absolute; width: 230px; height: 230px; border-radius: 50%; overflow: hidden; bottom: 36px; left: 44px; background: #e9e5ff; border: 6px solid #fff; box-shadow: 0 14px 36px rgba(91,75,219,0.25); }
        .hv-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .hv-q { position: absolute; top: 112px; right: 6px; background: #fff; color: var(--ink); padding: 11px 18px; border-radius: 12px; font-size: 15px; font-weight: 500; box-shadow: 0 6px 20px rgba(0,0,0,0.1); animation: floaty 5s ease-in-out infinite; }
        .hv-a { position: absolute; top: 205px; left: 196px; width: 270px; background: #1e1b5e; color: #fff; padding: 14px 18px; border-radius: 12px; font-size: 15px; line-height: 1.45; box-shadow: 0 10px 26px rgba(30,27,94,0.35); }
        .hv-a::before { content: ''; position: absolute; left: -9px; top: 22px; border: 9px solid transparent; border-right-color: #1e1b5e; border-left: 0; }
        .hv-chip { position: absolute; background: #fff; border-radius: 12px; padding: 8px 14px; font-size: 13px; font-weight: 700; color: var(--ink); box-shadow: 0 6px 18px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 6px; }
        .hv-chip.c1 { top: 36px; right: 40px; }
        .hv-chip.c2 { bottom: 66px; right: 10px; }
        @media (max-width: 900px) {
          .hv { padding: 40px 18px 56px; }
          .hv-inner { grid-template-columns: 1fr; gap: 28px; }
          .hv-art { height: 400px; }
        }
        @media (max-width: 520px) {
          .hv-btn { width: 100%; padding: 16px; }
          .hv-btn-line { width: 100%; justify-content: center; }
          .hv-art { transform: scale(0.82); transform-origin: top center; height: 340px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bn-track { transition: none; }
          .hv-ring, .hv-q { animation: none; }
        }

        /* ═════════ REST OF PAGE ═════════ */
        .ym-section { padding: 80px 20px; }
        .ym-section-inner { max-width: 1100px; margin: 0 auto; }
        .ym-section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 14px; }
        .ym-section-tag.green { background: #dcfce7; color: #15803d; }
        .ym-section-tag.blue { background: #dbeafe; color: #1d4ed8; }
        .ym-section-tag.orange { background: #ffedd5; color: #c2410c; }
        .ym-section-tag.gold { background: #fef3c7; color: #92400e; }
        .ym-section-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3.6vw, 2.7rem); font-weight: 700; color: var(--gray-900); margin-bottom: 10px; }
        .ym-section-line { width: 48px; height: 3px; border-radius: 2px; margin: 0 auto 14px; position: relative; }
        .ym-section-line::after { content: ''; position: absolute; left: 50%; top: 50%; width: 5px; height: 5px; border-radius: 50%; background: inherit; transform: translate(14px,-50%); }
        .ym-section-desc { color: var(--gray-500); font-size: 15px; max-width: 500px; margin: 0 auto; line-height: 1.7; }
        .ym-section-head { text-align: center; margin-bottom: 48px; }

        .ym-btn-gold { background: var(--gold); color: #1a0a00; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }

        .ym-classes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .ym-class-card { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 18px; padding: 24px 20px; text-align: center; transition: all 0.25s; box-shadow: var(--shadow-sm); }
        .ym-class-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
        .ym-class-card.featured { box-shadow: 0 0 0 3px rgba(255,255,255,0.35), var(--shadow-lg); }
        .ym-class-icon { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 14px; background: rgba(255,255,255,0.22); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .ym-classes-grid .ym-class-card:nth-child(1) { background: linear-gradient(150deg, #3163dd 0%, #1e40af 100%); border-color: transparent; }
        .ym-classes-grid .ym-class-card:nth-child(2) { background: linear-gradient(150deg, #ea9a3d 0%, #c2740b 100%); border-color: transparent; }
        .ym-classes-grid .ym-class-card:nth-child(3) { background: linear-gradient(150deg, #17a97a 0%, #0d7a56 100%); border-color: transparent; }
        .ym-classes-grid .ym-class-name { color: #fff; }
        .ym-classes-grid .ym-class-days { color: rgba(255,255,255,0.88); }
        .ym-classes-grid .ym-class-time { color: rgba(255,255,255,0.65); }
        .ym-classes-grid .ym-class-price { color: #fff; }
        .ym-classes-grid .ym-class-price-unit { color: rgba(255,255,255,0.7); }
        .ym-classes-grid .ym-class-price-original { color: rgba(255,255,255,0.55); }
        .ym-classes-grid .ym-class-price-save { background: rgba(255,255,255,0.25); color: #fff; }
        .ym-classes-grid .ym-class-badge { background: rgba(255,255,255,0.25); color: #fff; }
        .ym-classes-grid .ym-class-btn-primary { background: #fff; color: #1d4ed8; }
        .ym-classes-grid .ym-class-btn-primary:hover { background: #f3f4f6; }
        .ym-class-name { font-size: 20px; font-weight: 800; color: var(--gray-900); margin-bottom: 3px; }
        .ym-class-days { color: var(--gray-500); font-size: 13px; margin-bottom: 2px; }
        .ym-class-time { color: var(--gray-400); font-size: 12px; margin-bottom: 18px; }
        .ym-class-price-row { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .ym-class-price { font-size: 28px; font-weight: 800; color: #2563eb; font-family: 'Space Grotesk', 'Outfit', sans-serif; }
        .ym-class-price-unit { font-size: 13px; color: var(--gray-400); }
        .ym-class-price-original { font-size: 16px; font-weight: 600; color: var(--gray-400); text-decoration: line-through; font-family: 'Space Grotesk', 'Outfit', sans-serif; }
        .ym-class-price-save { display: inline-block; background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; margin-left: 2px; vertical-align: middle; }
        .ym-class-btn { width: 100%; padding: 11px; border-radius: 11px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-class-btn-primary { background: #2563eb; color: #fff; }
        .ym-class-btn-primary:hover { background: #1d4ed8; }
        .ym-class-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; margin-bottom: 10px; }
        @media (max-width: 760px) { .ym-classes-grid { grid-template-columns: 1fr; max-width: 380px; margin-left: auto; margin-right: auto; } }
        @media (min-width: 560px) and (max-width: 760px) { .ym-classes-grid { grid-template-columns: repeat(2, 1fr); max-width: 100%; } }

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
        .ym-offline-section { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%); border-top: 1px solid #fed7aa; border-bottom: 1px solid #fed7aa; }
        .ym-offline-card { background: linear-gradient(150deg, #ea9a3d 0%, #c2740b 100%); border: none; border-radius: 24px; padding: 48px 40px; text-align: center; box-shadow: var(--shadow-md); max-width: 580px; margin: 0 auto; }
        .ym-offline-loc { display: inline-flex; align-items: center; gap: 6px; color: #fff; font-weight: 700; font-size: 16px; margin-bottom: 10px; }
        .ym-btn-orange { background: #fff; color: #c2410c; padding: 13px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-btn-orange:hover { background: #fff7ed; }
        .ym-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .ym-why-card { border-radius: 18px; padding: 24px; transition: all 0.25s; border: none; }
        .ym-why-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
        .ym-why-icon { width: 54px; height: 54px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; background: rgba(255,255,255,0.22); box-shadow: none; }
        .ym-why-grid .ym-why-card:nth-child(1) { background: linear-gradient(150deg, #3163dd 0%, #1e40af 100%); box-shadow: var(--shadow-md); }
        .ym-why-grid .ym-why-card:nth-child(2) { background: linear-gradient(150deg, #ea9a3d 0%, #c2740b 100%); box-shadow: var(--shadow-md); }
        .ym-why-grid .ym-why-card:nth-child(3) { background: linear-gradient(150deg, #17a97a 0%, #0d7a56 100%); box-shadow: var(--shadow-md); }
        .ym-why-grid .ym-why-card:nth-child(4) { background: linear-gradient(150deg, #7c5cdb 0%, #5b21b6 100%); box-shadow: var(--shadow-md); }
        .ym-why-grid .ym-why-card:nth-child(5) { background: linear-gradient(150deg, #0ea5b7 0%, #0a7285 100%); box-shadow: var(--shadow-md); }
        .ym-why-grid .ym-why-card:nth-child(6) { background: linear-gradient(150deg, #e2574c 0%, #b91c1c 100%); box-shadow: var(--shadow-md); }
        .ym-why-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 7px; }
        .ym-why-desc { color: rgba(255,255,255,0.88); font-size: 13px; line-height: 1.65; }
        @media (max-width: 760px) { .ym-why-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .ym-why-grid { grid-template-columns: 1fr; } }
        .ym-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .ym-about-text p { color: var(--gray-600); font-size: 16px; line-height: 1.8; margin-bottom: 18px; }
        .ym-about-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ym-about-card { border-radius: 14px; padding: 18px; text-align: center; border: none; box-shadow: var(--shadow-sm); }
        .ym-about-cards .ym-about-card:nth-child(1) { background: linear-gradient(150deg, #3163dd 0%, #1e40af 100%); }
        .ym-about-cards .ym-about-card:nth-child(2) { background: linear-gradient(150deg, #ea9a3d 0%, #c2740b 100%); }
        .ym-about-cards .ym-about-card:nth-child(3) { background: linear-gradient(150deg, #17a97a 0%, #0d7a56 100%); }
        .ym-about-cards .ym-about-card:nth-child(4) { background: linear-gradient(150deg, #7c5cdb 0%, #5b21b6 100%); }
        .ym-about-card-icon { font-size: 26px; margin-bottom: 7px; }
        .ym-about-card-label { font-weight: 700; color: #fff; font-size: 13px; }
        .ym-about-card-sub { color: rgba(255,255,255,0.82); font-size: 11px; margin-top: 3px; }
        @media (max-width: 760px) { .ym-about-grid { grid-template-columns: 1fr; gap: 36px; } }
        .ym-contact-section { background: var(--navy); }
        .ym-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
        .ym-contact-info h3 { font-family: 'Cormorant Garamond', serif; color: #fff; font-size: 26px; font-weight: 700; margin-bottom: 7px; }
        .ym-contact-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .ym-contact-icon { width: 40px; height: 40px; border-radius: 11px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .ym-contact-val { color: #fff; font-size: 14px; font-weight: 500; }
        .ym-contact-val a { color: #93c5fd; text-decoration: none; }
        .ym-contact-val a:hover { color: #fff; }
        .ym-contact-sub { color: rgba(255,255,255,0.4); font-size: 11px; }
        .ym-contact-cta { background: linear-gradient(150deg, #7c5cdb 0%, #5b21b6 100%); border: none; border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 14px; box-shadow: var(--shadow-lg); }
        .ym-contact-cta-title { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 3px; }
        .ym-contact-cta-sub { color: rgba(255,255,255,0.85); font-size: 13px; margin-bottom: 6px; }
        .ym-contact-enroll-btn { width: 100%; background: var(--gold); color: #1a0a00; padding: 15px; border-radius: 13px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; }
        .ym-contact-enroll-btn:hover { background: var(--gold-light); }
        @media (max-width: 760px) { .ym-contact-grid { grid-template-columns: 1fr; gap: 32px; } }
        .ym-footer { background: #030a1f; color: rgba(255,255,255,0.5); padding: 44px 20px 22px; border-top: 3px solid #f59e0b; }
        .ym-footer-inner { max-width: 1100px; margin: 0 auto; }
        .ym-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 36px; margin-bottom: 36px; }
        .ym-footer-brand-name { color: #fff; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 22px; margin-bottom: 5px; }
        .ym-footer-brand-tagline { color: #fcd34d; font-style: italic; font-size: 12px; margin-bottom: 10px; }
        .ym-footer-brand-desc { font-size: 12px; line-height: 1.7; }
        .ym-footer-badges { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
        .ym-footer-badge { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 7px; padding: 5px 10px; font-size: 11px; }
        .ym-footer-h4 { color: #fff; font-weight: 700; font-size: 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
        .ym-footer-h4::before { content: ''; display: inline-block; width: 20px; height: 3px; background: #f59e0b; border-radius: 2px; }
        .ym-footer-h4::after { content: ''; display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: #f59e0b; margin-left: -3px; }
        .ym-footer-item { font-size: 12px; margin-bottom: 7px; line-height: 1.5; }
        .ym-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin-bottom: 18px; }
        .ym-footer-visitor-bar { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 24px; margin-bottom: 24px; flex-wrap: wrap; }
        .ym-footer-visitor-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        .ym-footer-visitor-dot.error { background: #f59e0b; animation: none; }
        .ym-footer-visitor-count { color: #fff; font-weight: 700; font-size: 18px; font-family: 'DM Serif Display', 'Cormorant Garamond', serif; }
        .ym-footer-visitor-label { color: rgba(255,255,255,0.35); font-size: 12px; }
        .ym-footer-visitor-sep { color: rgba(255,255,255,0.13); font-size: 16px; }
        .ym-skeleton { display: inline-block; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% auto; animation: skeletonShimmer 1.5s linear infinite; border-radius: 4px; height: 1em; width: 40px; vertical-align: middle; }
        @keyframes skeletonShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes visitorPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .ym-footer-policy-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; margin-bottom: 14px; }
        .ym-footer-policy-link { font-size: 11px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; padding: 4px 12px; border-right: 1px solid rgba(255,255,255,0.1); }
        .ym-footer-policy-link:last-child { border-right: none; }
        .ym-footer-policy-link:hover { color: #93c5fd; }
        .ym-footer-copy { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 11px; text-align: center; }
        @media (max-width: 760px) { .ym-footer-grid { grid-template-columns: 1fr; gap: 28px; } }
        .ym-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 14px; backdrop-filter: blur(4px); }
        .ym-modal { background: #fff; border-radius: 24px; width: 100%; max-width: 460px; box-shadow: 0 24px 80px rgba(0,0,0,0.3); overflow: hidden; max-height: 94vh; overflow-y: auto; position: relative; }
        .ym-modal-head { background: linear-gradient(135deg, #5b4bdb 0%, #3b2fa0 100%); padding: 24px 28px 20px; color: #fff; position: sticky; top: 0; z-index: 10; }
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
        .ym-form-info { background: #f1efff; border: 1px solid #d8d2ff; border-radius: 11px; padding: 10px 14px; display: flex; gap: 7px; font-size: 12px; color: #3b2fa0; margin-bottom: 18px; }
        .ym-form-label { font-size: 11px; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; display: block; }
        .ym-form-group { display: flex; flex-direction: column; }
        .ym-input { width: 100%; border: 1.5px solid var(--gray-200); padding: 11px 14px; border-radius: 11px; font-size: 14px; font-family: 'Outfit', sans-serif; color: var(--gray-900); outline: none; transition: border-color 0.2s; background: #fff; }
        .ym-input:focus { border-color: #5b4bdb; box-shadow: 0 0 0 3px rgba(91,75,219,0.12); }
        .ym-input::placeholder { color: var(--gray-400); }
        .ym-form-stack { display: flex; flex-direction: column; gap: 12px; }
        .ym-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ym-policy-text { font-size: 11px; color: var(--gray-400); text-align: center; line-height: 1.6; }
        .ym-policy-text a { color: #5b4bdb; text-decoration: none; }
        .ym-submit-btn { width: 100%; background: #5b4bdb; color: #fff; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; margin-top: 3px; }
        .ym-submit-btn:hover { background: #4a3cc4; }
        .ym-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-summary { background: #f1efff; border: 1.5px solid #d8d2ff; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ym-pay-class { font-size: 11px; color: #5b4bdb; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
        .ym-pay-amount { font-size: 26px; font-weight: 800; color: #3b2fa0; }
        .ym-pay-unit { font-size: 12px; color: var(--gray-400); }
        .ym-pay-discount { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 10px; text-align: center; }
        .ym-confirm-btn { width: 100%; background: #5b21b6; color: #fff; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ym-confirm-btn:hover:not(:disabled) { background: #4c1d95; }
        .ym-confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-err { background: #fee2e2; border: 1px solid #fecaca; border-radius: 11px; padding: 11px 14px; color: #dc2626; font-size: 13px; text-align: center; margin-top: 10px; }
        .ym-pay-secure { text-align: center; margin-top: 12px; font-size: 11px; color: var(--gray-400); }
        .ym-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>

      {/* NAVBAR */}
      <Navbar onEnroll={() => openModal()} />

      {/* ───── TOP BANNER CAROUSEL (5 slides) ───── */}
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
                {/* left: brand + big title */}
                <div>
                  <div className="bn-brand">
                    <div className="bn-logo">YM</div>
                    <p className="bn-brand-name">YARWNG<br />MATHEMATICS</p>
                  </div>
                  <h2 className="bn-title">{b.title[0]}<br />{b.title[1]}</h2>
                  <p className="bn-sub">{b.sub}</p>
                </div>

                {/* middle: pill, points, price + CTA */}
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

                {/* right: teacher photo */}
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

      {/* ───── SIMPLE HERO ───── */}
      <section className="hv" aria-label="Yarwng Mathematics">
        <div className="hv-inner">
          <div>
            <h1 className="hv-title">
              Tripura&apos;s <em>Trusted &amp; Affordable</em> Mathematics Coaching
            </h1>
            <p className="hv-desc">
              Learn Class 10, 11 &amp; 12 Maths from an IIT Delhi graduate. Live online classes on Google Meet, offline classes at Khumulwng soon — starting at just ₹600 a month.
            </p>
            <div className="hv-btns">
              <button onClick={() => openModal()} className="hv-btn">Get Started</button>
              <Link href="/classes" className="hv-btn-line">View Schedule</Link>
            </div>
            <div className="hv-trust">
              <span>IIT Delhi M.Sc faculty</span>
              <span>Live on Google Meet</span>
              <span>WhatsApp doubt support</span>
            </div>
          </div>

          <div className="hv-art" aria-hidden="true">
            <div className="hv-ring r1" />
            <div className="hv-ring r2" />
            <span className="hv-orb o1" /><span className="hv-orb o2" /><span className="hv-orb o3" /><span className="hv-orb o4" />
            <div className="hv-chip c1">🎓 IIT Delhi</div>
            <div className="hv-chip c2">📘 Class 10 · 11 · 12</div>
            <div className="hv-q">Sir, what is Yarwng Mathematics?</div>
            <div className="hv-photo"><img src="/profile.jpg" alt="" /></div>
            <div className="hv-a">Yarwng Mathematics is where students learn with concepts and grow with guidance.</div>
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section id="classes" className="ym-section" style={{ background: "#fff" }}>
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag green">🟢 Currently via Google Meet</div>
            <h2 className="ym-section-h2">Online Classes</h2>
            <div className="ym-section-line" style={{ background: "#22c55e" }} />
            <p className="ym-section-desc">Live interactive sessions via Google Meet. Join from anywhere across India.</p>
          </div>
          <div className="ym-classes-grid">
            {Object.entries(PAYMENT.classes).map(([cls], idx) => {
              const p = PAYMENT.classes[cls as keyof typeof PAYMENT.classes];
              const offerPrice = p.offer === 1 ? p.original : p.offer;
              const savePct = Math.round(((p.original - offerPrice) / p.original) * 100);
              return (
                <div key={cls} className={`ym-class-card${idx === 1 ? " featured" : ""}`}>
                  {idx === 1 && <div className="ym-class-badge">Most Popular</div>}
                  <div className="ym-class-icon">{cls === "Class 10" ? "📘" : cls === "Class 11" ? "📙" : "📗"}</div>
                  <h3 className="ym-class-name">{cls}</h3>
                  <p className="ym-class-days">{SLOTS[cls as keyof typeof SLOTS].days}</p>
                  <p className="ym-class-time">{SLOTS[cls as keyof typeof SLOTS].time}</p>
                  <div className="ym-class-price-row">
                    <span className="ym-class-price">₹{offerPrice}</span>
                    <span className="ym-class-price-original">₹{p.original}</span>
                    <span className="ym-class-price-unit">/mo</span>
                    <span className="ym-class-price-save">{savePct}% off</span>
                  </div>
                  <button onClick={() => openModal()} className="ym-class-btn ym-class-btn-primary">Join {cls}</button>
                </div>
              );
            })}
          </div>
          <div className="ym-slots-wrap">
            <button onClick={() => { setSlotsOpen(!slotsOpen); setSelectedSlot(null); }} className="ym-slots-toggle">
              <span>📅 View Detailed Class Slots</span><span style={{ fontSize: "20px" }}>{slotsOpen ? "−" : "+"}</span>
            </button>
            {slotsOpen && (
              <div className="ym-slots-body">
                {(["Class 10", "Class 11", "Class 12"] as const).map((cls) => {
                  const p = PAYMENT.classes[cls];
                  const offerPrice = p.offer === 1 ? p.original : p.offer;
                  return (
                    <div key={cls}>
                      <button onClick={() => setSelectedSlot(selectedSlot === cls ? null : cls)} className={`ym-slot-btn${selectedSlot === cls ? " active" : ""}`}>
                        <span>{cls}</span><span>{selectedSlot === cls ? "▲" : "▼"}</span>
                      </button>
                      {selectedSlot === cls && (
                        <div className="ym-slot-detail">
                          <div className="ym-slot-row"><span className="ym-slot-row-icon">📋</span><div style={{ flex: 1 }}><p className="ym-slot-row-label">What you&apos;ll learn</p><div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "5px" }}>{(SLOTS[cls].desc as string[]).map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}><span style={{ color: "#2563eb", fontSize: "15px", lineHeight: "1.4", flexShrink: 0 }}>›</span><span style={{ color: "#1e40af", fontSize: "12px", lineHeight: "1.65" }}>{item}</span></div>))}</div></div></div>
                          <div className="ym-slot-row"><span className="ym-slot-row-icon">📆</span><div><p className="ym-slot-row-label">{SLOTS[cls].days}</p><p className="ym-slot-row-sub">Every week</p></div></div>
                          <div className="ym-slot-row"><span className="ym-slot-row-icon">🕐</span><div><p className="ym-slot-row-label">{SLOTS[cls].time}</p><p className="ym-slot-row-sub">Evening · 2 hours</p></div></div>
                          <div className="ym-slot-row"><span className="ym-slot-row-icon">💰</span><div><p className="ym-slot-row-label">₹{offerPrice}/month</p><p className="ym-slot-row-sub">Regular: ₹{p.original}/month</p></div></div>
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

      {/* OFFLINE */}
      <section className="ym-section ym-offline-section">
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag orange">🔔 Starting Soon</div>
            <h2 className="ym-section-h2">Offline Session</h2>
            <div className="ym-section-line" style={{ background: "#f97316" }} />
          </div>
          <div className="ym-offline-card">
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🏫</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "7px" }}>Physical Classroom</h3>
            <div className="ym-offline-loc">📍 Khumulwng, Tripura</div>
            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "20px", maxWidth: "400px", margin: "0 auto 20px", lineHeight: 1.7, fontSize: "14px" }}>Face-to-face classes in a structured environment. Personalised attention. Details will be announced soon.</p>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.22)", color: "#fff", padding: "7px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", marginBottom: "20px" }}>⏳ Launching Soon — Limited Seats</div>
            <br />
            <button onClick={() => openModal("Offline")} className="ym-btn-orange">Register Interest</button>
          </div>
        </div>
      </section>

      {/* WHY US */}
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
              <div key={item.title} className="ym-why-card"><div className="ym-why-icon">{item.icon}</div><h3 className="ym-why-title">{item.title}</h3><p className="ym-why-desc">{item.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="ym-section" style={{ background: "#fff" }}>
        <div className="ym-section-inner">
          <div className="ym-section-head">
            <div className="ym-section-tag blue">🎓 Our Story</div>
            <h2 className="ym-section-h2">Know About Yarwng Mathematics</h2>
            <div className="ym-section-line" style={{ background: "#2563eb" }} />
          </div>
          <div className="ym-about-grid">
            <div className="ym-about-text">
              <p><strong style={{ color: "#5b4bdb" }}>Yarwng Mathematics</strong> was founded to make advanced mathematics accessible and enjoyable for every student in Tripura and beyond.</p>
              <p>Led by <strong>Rakesh Debbarma</strong>, an M.Sc graduate from <strong>IIT Delhi</strong>, we bring world-class mathematical thinking to your doorstep.</p>
              <p>Our approach combines rigorous conceptual teaching, regular problem-solving, and personalised attention so every student grows confidently.</p>
              <button onClick={() => openModal()} className="ym-btn-gold" style={{ marginTop: "6px" }}>Start Learning Today →</button>
            </div>
            <div className="ym-about-cards">
              {[{ icon: "🎓", label: "IIT Delhi Alumni", sub: "M.Sc Mathematics" }, { icon: "📚", label: "Classes 10–12", sub: "Full syllabus coverage" }, { icon: "🌐", label: "Online & Offline", sub: "Flexible modes" }, { icon: "📈", label: "Proven Results", sub: "High scoring students" }].map((card) => (
                <div key={card.label} className="ym-about-card"><div className="ym-about-card-icon">{card.icon}</div><p className="ym-about-card-label">{card.label}</p><p className="ym-about-card-sub">{card.sub}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
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
              {[
                { icon: "👨‍🏫", val: "Rakesh Debbarma", sub: "M.Sc Mathematics, IIT Delhi" },
                { icon: "📱", val: <a href="tel:9366030347">9366030347</a>, sub: "WhatsApp available" },
                { icon: "✉️", val: <a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a>, sub: "" },
                { icon: "📍", val: "Khumulwng, Tripura", sub: "Offline classes launching soon" },
              ].map((r, i) => (
                <div key={i} className="ym-contact-row"><div className="ym-contact-icon">{r.icon}</div><div><p className="ym-contact-val">{r.val}</p>{r.sub && <p className="ym-contact-sub">{r.sub}</p>}</div></div>
              ))}
            </div>
            <div className="ym-contact-cta">
              <div><p className="ym-contact-cta-title">Ready to Excel in Mathematics?</p><p className="ym-contact-cta-sub">Admissions are open. Limited seats per batch — enroll now to secure your spot.</p></div>
              <button onClick={() => openModal()} className="ym-contact-enroll-btn">🚀 Enroll Now →</button>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                {["Class 10 · ₹600/mo", "Class 11 · ₹800/mo", "Class 12 · ₹900/mo"].map((t) => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "7px", padding: "5px 10px", fontSize: "11px", color: "rgba(255,255,255,0.9)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ym-footer" role="contentinfo">
        <div className="ym-footer-inner">
          <div className="ym-footer-grid">
            <div>
              <p className="ym-footer-brand-name">Yarwng Mathematics</p>
              <p className="ym-footer-brand-tagline">&quot;Amani Kok Kokborok bai Swrwngwi Mannai&quot;</p>
              <p className="ym-footer-brand-desc">Professional Mathematics Coaching for Classes 10, 11 &amp; 12. Conceptual clarity. Proven results. By Rakesh Debbarma, M.Sc IIT Delhi.</p>
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
              <p className="ym-footer-item">📘 Class 10 · Mon &amp; Wed · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹600</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹700</span></p>
              <p className="ym-footer-item">📙 Class 11 · Tue &amp; Fri · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹800</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹900</span></p>
              <p className="ym-footer-item">📗 Class 12 · Thu &amp; Sat · 5–7 PM · <span style={{ color: "#93c5fd" }}>₹900</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹1000</span></p>
              <p className="ym-footer-item" style={{ color: "#fb923c", marginTop: "10px" }}>🏫 Offline: Khumulwng (Launching Soon)</p>
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
              <div className="ym-modal-emoji">{step === "form" ? "📝" : "💜"}</div>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "9px", padding: "9px 12px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ fontSize: "12px", color: "#15803d", fontWeight: 500 }}>Classes are taught in <strong>English Medium</strong>.</span></div>
                    <p className="ym-policy-text">By registering you agree to our <a href={POLICY.terms} target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>, <a href={POLICY.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={POLICY.refund} target="_blank" rel="noopener noreferrer">Refund Policy</a>.</p>
                    <button type="submit" className="ym-submit-btn">Next: Pay &amp; Join →</button>
                  </div>
                </form>
              )}

              {step === "payment" && pay && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>💜</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Complete Your Payment</h3>
                  <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>You&apos;ll be securely redirected to PhonePe to complete the payment.</p>
                  <div className="ym-pay-summary">
                    <div>
                      <p className="ym-pay-class">{studentClass} · {board} · {mode}</p>
                      <p><span className="ym-pay-amount">₹{pay.offer}</span><span className="ym-pay-unit"> /month</span></p>
                    </div>
                    <div className="ym-pay-discount">{discount}% OFF<br /><span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "11px" }}>₹{pay.original}</span></div>
                  </div>
                  <button onClick={handleSubmit as any} disabled={submitting} className="ym-confirm-btn">
                    {submitting ? (<><svg className="ym-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" /></svg>Redirecting to PhonePe…</>) : (<>💜 Pay ₹{pay.offer} via PhonePe</>)}
                  </button>
                  {payError && <div className="ym-pay-err">⚠️ {payError}</div>}
                  <p className="ym-pay-secure">🔒 Powered by PhonePe Payment Gateway · SSL Secured</p>
                  <button onClick={() => { setStep("form"); setPayError(""); setSubmitting(false); }} style={{ marginTop: 14, background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>← Edit details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}