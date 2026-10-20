"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef, type ReactNode } from "react";

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

/* Small stroke icon used in the stats strip */
const Icon = ({ d }: { d: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const STATS: { icon: ReactNode; tone: string; value: string; label: string }[] = [
  { icon: <Icon d="M12 3 3 8l9 5 9-5-9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5" />, tone: "blue", value: "3 batches", label: "Class 10, 11 and 12" },
  { icon: <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2" />, tone: "orange", value: "2 hours", label: "per class, twice a week" },
  { icon: <Icon d="M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />, tone: "green", value: "5 to 7 PM", label: "every batch, every week" },
  { icon: <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>₹</span>, tone: "purple", value: "₹600", label: "a month, to begin with" },
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
  const cn = (cls: string) => `c${cls.split(" ")[1]}`; // "Class 10" -> "c10"

  return (
    <main id="home" className="ym-page">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --font: var(--font-nunito), 'Nunito Sans', system-ui, sans-serif;
          --navy: #0b3a7a; --navy-deep: #082b5c; --ink: #0f1f3d;
          --orange: #f97316; --orange-deep: #ea580c; --orange-soft: #fff1e3;
          --teal: #0f766e; --text: #25324b; --muted: #5a6a86; --line: #e1e7f2; --card: #ffffff;
          --sky: #eef4fd; --peach: #fff4e8; --mint: #e8f6f0; --lav: #f1ecfc; --slate: #f1f5fb; --cream: #fff8e6;
          --shadow: 0 1px 2px rgba(15,31,61,0.06), 0 8px 24px rgba(15,31,61,0.07);
          --shadow-lg: 0 2px 4px rgba(15,31,61,0.06), 0 24px 56px rgba(15,31,61,0.15);
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font); color: var(--text); background: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        img { max-width: 100%; }
        .ym-page { font-family: var(--font); overflow-x: hidden; }
        h1, h2, h3, h4, b, strong { font-family: var(--font); }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes skeletonShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes visitorPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        a:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible, summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; }

        /* class colour tokens */
        .c10 { --cc: #1d4ed8; --cc2: #1e3a8a; --ct: #e3ecff; }
        .c11 { --cc: #059669; --cc2: #047857; --ct: #dcf5ea; }
        .c12 { --cc: #7c3aed; --cc2: #5b21b6; --ct: #ece4ff; }

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
        .bn-dark .bn-sub { color: #fdba74; }
        .bn-pill { display: inline-block; background: #1e3a8a; color: #fff; font-weight: 700; font-size: clamp(0.85rem, 1.6vw, 1.25rem); padding: 9px 26px 9px 18px; border-radius: 10px 40px 10px 10px; margin-bottom: 16px; }
        .bn-dark .bn-pill { background: var(--orange); color: #fff; }
        .bn-points { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 22px; margin-bottom: 16px; }
        .bn-point { display: flex; align-items: flex-start; gap: 8px; font-weight: 600; font-size: 14px; color: #1f2937; line-height: 1.35; }
        .bn-point::before { content: '✓'; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #1d4ed8; color: #fff; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .bn-dark .bn-point { color: #e5edfb; }
        .bn-dark .bn-point::before { background: #fdba74; color: #082b5c; }
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
        .bn-dots { display: flex; justify-content: center; gap: 9px; padding: 14px 0 12px; background: #fdf8f1; }
        .bn-dot { width: 9px; height: 9px; border-radius: 50%; border: none; background: #d6dbe6; cursor: pointer; padding: 0; transition: all 0.25s; }
        .bn-dot.on { background: var(--orange); width: 26px; border-radius: 6px; }
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
        .yw-sec { padding: 88px 24px; }
        .yw-sec.sky { background: var(--sky); }
        .yw-sec.peach { background: var(--peach); }
        .yw-sec.mint { background: var(--mint); }
        .yw-sec.lav { background: var(--lav); }
        .yw-sec.slate { background: var(--slate); }
        .yw-sec.cream { background: var(--cream); }
        .yw-head { max-width: 640px; margin-bottom: 48px; }
        .yw-head.center { margin-left: auto; margin-right: auto; text-align: center; }
        .yw-h2 { font-weight: 800; font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.15; color: var(--ink); letter-spacing: -0.025em; }
        .yw-lead { margin-top: 14px; color: var(--muted); font-size: 17px; line-height: 1.7; font-weight: 500; }
        .yw-btn { display: inline-flex; align-items: center; justify-content: center; font-family: inherit; font-weight: 800; font-size: 15px; border-radius: 10px; padding: 14px 28px; cursor: pointer; text-decoration: none; transition: transform 0.15s, background 0.2s, box-shadow 0.2s; border: 1.5px solid transparent; }
        .yw-btn:hover { transform: translateY(-1px); }
        .yw-btn-orange { background: var(--orange); color: #fff; box-shadow: 0 8px 20px rgba(249,115,22,0.32); }
        .yw-btn-orange:hover { background: var(--orange-deep); }
        .yw-btn-ghost { background: #fff; color: var(--orange-deep); border-color: #fdba74; }
        .yw-btn-ghost:hover { background: var(--orange-soft); border-color: var(--orange); }

        /* ═════════ HERO (soft, low-intensity background) ═════════ */
        .yw-hero { position: relative; padding: 84px 24px 130px; overflow: hidden;
          background:
            radial-gradient(760px 380px at 88% 8%, rgba(249,115,22,0.10), transparent 62%),
            radial-gradient(680px 380px at 4% 92%, rgba(29,78,216,0.08), transparent 62%),
            linear-gradient(180deg, #fdf7f0 0%, #f2f6fc 100%); }
        .yw-hero::before { content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cg font-family='serif' font-size='34' fill='%230b3a7a' fill-opacity='0.055'%3E%3Ctext x='14' y='48'%3E%26%238721%3B%3C/text%3E%3Ctext x='130' y='96'%3E%26%23960%3B%3C/text%3E%3Ctext x='46' y='170'%3E%26%238747%3B%3C/text%3E%3Ctext x='158' y='200'%3E%26%238730%3B%3C/text%3E%3C/g%3E%3C/svg%3E");
          background-size: 220px 220px; }
        .yw-hero-grid { position: relative; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 72px; align-items: center; }
        .yw-badge { display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px 7px 10px; font-size: 13.5px; font-weight: 700; color: var(--navy); box-shadow: var(--shadow); }
        .yw-badge i { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.18); }
        .yw-hero h1 { margin-top: 22px; font-weight: 800; font-size: clamp(2.2rem, 4.2vw, 3.5rem); line-height: 1.1; letter-spacing: -0.03em; color: var(--ink); max-width: 640px; }
        .yw-hero p.sub { margin-top: 22px; font-size: 18px; line-height: 1.7; color: var(--muted); max-width: 540px; font-weight: 500; }
        .yw-hero-btns { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 12px; }
        .yw-hero-meta { margin-top: 36px; display: flex; flex-wrap: wrap; gap: 10px 28px; font-size: 14px; color: var(--muted); font-weight: 600; }
        .yw-hero-meta span::before { content: '✓'; color: var(--orange-deep); font-weight: 800; margin-right: 8px; }

        .yw-portrait { position: relative; max-width: 340px; margin: 0 auto; text-align: center; }
        .yw-circle { position: relative; width: 250px; height: 250px; margin: 0 auto; }
        .yw-ring { position: absolute; inset: -16px; border-radius: 50%; background: repeating-conic-gradient(var(--orange) 0deg 2.5deg, transparent 2.5deg 6deg); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px)); mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px)); opacity: 0.5; }
        .yw-circle-img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 5px solid #fff; background: linear-gradient(180deg, #eaf1fb, #fff); box-shadow: 0 10px 30px rgba(15,31,61,0.16); }
        .yw-circle-img img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .yw-portrait-cap { margin-top: 30px; }
        .yw-portrait-cap b { display: block; font-size: 19px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
        .yw-portrait-cap span { display: block; margin-top: 3px; font-size: 14px; color: var(--muted); font-weight: 600; }
        .yw-float { position: absolute; z-index: 2; background: #fff; border-radius: 14px; padding: 12px 16px; box-shadow: var(--shadow-lg); font-size: 13px; color: var(--muted); line-height: 1.35; font-weight: 600; text-align: left; }
        .yw-float b { display: block; font-size: 15px; font-weight: 800; color: var(--ink); }
        .yw-float.a { left: -6px; top: 14px; }
        .yw-float.b { right: -6px; top: 160px; }

        /* ═════════ STATS (floating panel over hero edge) ═════════ */
        .yw-stats { position: relative; z-index: 3; margin-top: -58px; padding: 0 24px; background: linear-gradient(180deg, transparent 58px, var(--sky) 58px); }
        .yw-stats-panel { display: grid; grid-template-columns: repeat(4, 1fr); background: #fff; border: 1px solid var(--line); border-radius: 22px; box-shadow: var(--shadow-lg); overflow: hidden; }
        .yw-stat { display: flex; align-items: center; gap: 16px; padding: 28px 28px; border-left: 1px solid var(--line); }
        .yw-stat:first-child { border-left: none; }
        .yw-stat-ic { flex-shrink: 0; width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .yw-stat-ic.blue { background: #e3ecff; color: #1d4ed8; }
        .yw-stat-ic.orange { background: var(--orange-soft); color: var(--orange-deep); }
        .yw-stat-ic.green { background: #dcf5ea; color: #047857; }
        .yw-stat-ic.purple { background: #ece4ff; color: #6d28d9; }
        .yw-stat b { display: block; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--ink); line-height: 1.1; }
        .yw-stat span { display: block; margin-top: 4px; font-size: 13.5px; color: var(--muted); font-weight: 600; }

        /* ═════════ BATCHES ═════════ */
        .yw-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; align-items: stretch; }
        .yw-card { display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); position: relative; }
        .yw-card.feat { box-shadow: var(--shadow-lg); border-color: var(--cc); }
        .yw-card-top { background: linear-gradient(135deg, var(--cc), var(--cc2)); color: #fff; padding: 26px 28px 24px; }
        .yw-card-top h3 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
        .yw-card-when { margin-top: 6px; font-size: 14.5px; font-weight: 600; color: rgba(255,255,255,0.88); }
        .yw-card-tag { position: absolute; top: 16px; right: 16px; background: var(--orange); color: #fff; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 999px; }
        .yw-card-body { padding: 26px 28px 28px; display: flex; flex-direction: column; flex: 1; }
        .yw-card-price { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
        .yw-card-price b { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; color: var(--ink); line-height: 1; }
        .yw-card-price small { font-size: 14px; color: var(--muted); font-weight: 600; }
        .yw-card-price s { font-size: 16px; color: #94a3b8; font-weight: 600; }
        .yw-card-save { display: inline-block; margin-top: 10px; background: #dcf5ea; color: #047857; font-size: 12.5px; font-weight: 800; padding: 4px 10px; border-radius: 6px; align-self: flex-start; }
        .yw-card ul { list-style: none; margin: 22px 0 26px; flex: 1; }
        .yw-card li { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; font-size: 15px; font-weight: 600; color: var(--text); }
        .yw-card li::before { content: '✓'; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--ct); color: var(--cc); font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
        .yw-card .yw-btn { width: 100%; }
        .yw-note { margin-top: 30px; text-align: center; font-size: 14.5px; color: var(--muted); font-weight: 600; }

        /* ═════════ SYLLABUS ═════════ */
        .yw-syl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .yw-syl-col { background: #fff; border: 1px solid #f3dcc3; border-radius: 18px; overflow: hidden; box-shadow: var(--shadow); }
        .yw-syl-col header { padding: 18px 24px; color: #fff; font-weight: 800; font-size: 18px; background: linear-gradient(135deg, var(--cc), var(--cc2)); }
        .yw-chips { display: flex; flex-wrap: wrap; gap: 9px; padding: 22px 22px 24px; }
        .yw-chip { background: var(--ct); color: var(--cc2); font-size: 13.5px; font-weight: 700; padding: 8px 14px; border-radius: 999px; }
        .yw-syl-foot { margin-top: 22px; font-size: 14px; color: var(--muted); text-align: center; font-weight: 600; }

        /* ═════════ WEEK ═════════ */
        .yw-week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
        .yw-day { border-radius: 16px; padding: 20px 10px; text-align: center; color: #fff; background: linear-gradient(160deg, var(--cc), var(--cc2)); box-shadow: var(--shadow); }
        .yw-day b { display: block; font-size: 17px; font-weight: 800; }
        .yw-day span { display: block; margin-top: 10px; font-size: 13.5px; font-weight: 800; padding: 6px 0; border-radius: 8px; background: rgba(255,255,255,0.2); }
        .yw-day small { display: block; margin-top: 10px; font-size: 12.5px; color: rgba(255,255,255,0.88); font-weight: 600; }
        .yw-day.off { background: rgba(255,255,255,0.6); border: 2px dashed #9fd3be; color: #4a6b5f; box-shadow: none; }
        .yw-day.off span { background: transparent; color: #6b8a7e; font-weight: 700; }

        /* ═════════ CLASS FLOW ═════════ */
        .yw-flow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .yw-flow-item { background: #fff; border-radius: 18px; padding: 28px 24px; box-shadow: var(--shadow); border-top: 5px solid #7c3aed; }
        .yw-flow-item:nth-child(2) { border-top-color: #1d4ed8; }
        .yw-flow-item:nth-child(3) { border-top-color: var(--orange); }
        .yw-flow-item:nth-child(4) { border-top-color: #059669; }
        .yw-flow-num { width: 40px; height: 40px; border-radius: 12px; background: var(--lav); color: #6d28d9; font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .yw-flow-item:nth-child(2) .yw-flow-num { background: #e3ecff; color: #1d4ed8; }
        .yw-flow-item:nth-child(3) .yw-flow-num { background: var(--orange-soft); color: var(--orange-deep); }
        .yw-flow-item:nth-child(4) .yw-flow-num { background: #dcf5ea; color: #047857; }
        .yw-flow-item h3 { font-size: 19px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
        .yw-flow-item p { margin-top: 10px; font-size: 14.5px; line-height: 1.7; color: var(--muted); font-weight: 500; }

        /* ═════════ WHY ═════════ */
        .yw-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .yw-why-item { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 28px 26px; box-shadow: var(--shadow); }
        .yw-why-item .ic { width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; margin-bottom: 18px; }
        .yw-why-item .ic.t0 { background: #e3ecff; color: #1d4ed8; }
        .yw-why-item .ic.t1 { background: var(--orange-soft); color: var(--orange-deep); }
        .yw-why-item .ic.t2 { background: #dcf5ea; color: #047857; }
        .yw-why-item .ic.t3 { background: #ece4ff; color: #6d28d9; }
        .yw-why-item h3 { font-size: 19px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
        .yw-why-item p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.7; font-weight: 500; }

        /* ═════════ OFFLINE ═════════ */
        .yw-off { background: linear-gradient(135deg, var(--navy) 0%, var(--ink) 100%); color: #fff; padding: 84px 24px; }
        .yw-off-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 56px; align-items: center; }
        .yw-off h2 { font-weight: 800; font-size: clamp(1.75rem, 3vw, 2.4rem); line-height: 1.15; letter-spacing: -0.025em; }
        .yw-off p { margin-top: 14px; color: #bdd0ee; line-height: 1.75; max-width: 540px; font-size: 16.5px; font-weight: 500; }
        .yw-off-box { background: #fff; color: var(--text); border-radius: 20px; padding: 30px; box-shadow: var(--shadow-lg); }
        .yw-off-box b { display: block; font-size: 21px; font-weight: 800; color: var(--ink); }
        .yw-off-box span { display: block; margin: 8px 0 22px; font-size: 14.5px; color: var(--muted); line-height: 1.6; font-weight: 500; }
        .yw-off-box .yw-btn { width: 100%; }

        /* ═════════ STEPS ═════════ */
        .yw-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; counter-reset: s; }
        .yw-step { position: relative; padding-right: 32px; }
        .yw-step::before { counter-increment: s; content: counter(s); display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: var(--orange); color: #fff; font-weight: 800; font-size: 19px; position: relative; z-index: 1; box-shadow: 0 6px 14px rgba(249,115,22,0.35); }
        .yw-step::after { content: ''; position: absolute; top: 23px; left: 58px; right: 8px; height: 2px; background: repeating-linear-gradient(90deg, #f3b98a 0 8px, transparent 8px 14px); }
        .yw-step:last-child::after { display: none; }
        .yw-step h3 { margin-top: 20px; font-size: 20px; font-weight: 800; color: var(--ink); }
        .yw-step p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.7; font-weight: 500; }

        /* ═════════ MENTOR ═════════ */
        .yw-mentor { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 72px; align-items: center; }
        .yw-mentor-text p { color: var(--text); font-size: 17px; line-height: 1.8; margin-top: 18px; max-width: 600px; font-weight: 500; }
        .yw-quote { margin-top: 28px; padding: 6px 0 6px 22px; border-left: 4px solid var(--orange); font-size: 22px; line-height: 1.5; color: var(--navy); font-weight: 800; letter-spacing: -0.01em; }
        .yw-creds { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
        .yw-cred { background: #fff; border: 1px solid #cfdcf0; border-radius: 999px; padding: 8px 16px; font-size: 14px; font-weight: 700; color: var(--navy); }

        /* ═════════ FAQ ═════════ */
        .yw-faq { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .yw-faq details { background: #fff; border: 1px solid #f3dcc3; border-radius: 14px; box-shadow: var(--shadow); }
        .yw-faq summary { list-style: none; cursor: pointer; padding: 20px 22px; display: flex; justify-content: space-between; gap: 20px; align-items: center; font-weight: 800; font-size: 17px; color: var(--ink); }
        .yw-faq summary::-webkit-details-marker { display: none; }
        .yw-faq summary::after { content: '+'; font-size: 26px; font-weight: 500; color: var(--orange-deep); transition: transform 0.2s; flex-shrink: 0; }
        .yw-faq details[open] summary::after { transform: rotate(45deg); }
        .yw-faq details p { padding: 0 22px 22px; color: var(--muted); font-size: 15.5px; line-height: 1.75; max-width: 680px; font-weight: 500; }

        /* ═════════ CONTACT ═════════ */
        .yw-contact { background: var(--ink); color: #fff; padding: 92px 24px; }
        .yw-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
        .yw-contact h2 { font-weight: 800; font-size: clamp(1.75rem, 3vw, 2.4rem); line-height: 1.15; letter-spacing: -0.025em; }
        .yw-crow { display: flex; gap: 16px; align-items: flex-start; margin-top: 26px; }
        .yw-crow i { font-style: normal; width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .yw-crow p { font-size: 16px; font-weight: 700; word-break: break-word; }
        .yw-crow small { display: block; color: #a9bbd9; font-size: 13.5px; margin-top: 3px; font-weight: 500; }
        .yw-crow a { color: #fed7aa; text-decoration: none; }
        .yw-crow a:hover { text-decoration: underline; }
        .yw-cta { background: #fff; color: var(--text); border-radius: 22px; padding: 36px; box-shadow: var(--shadow-lg); }
        .yw-cta h3 { font-size: 25px; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; }
        .yw-cta p { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 1.6; font-weight: 500; }
        .yw-cta ul { list-style: none; margin: 20px 0 24px; border-top: 1px solid var(--line); }
        .yw-cta li { display: flex; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--line); font-size: 15px; font-weight: 600; }
        .yw-cta li b { color: var(--navy); font-weight: 800; }
        .yw-cta .yw-btn { width: 100%; }

        /* ═════════ FOOTER ═════════ */
        .ym-footer { background: #0a1731; color: rgba(255,255,255,0.65); padding: 64px 24px 24px; }
        .ym-footer-inner { max-width: 1160px; margin: 0 auto; }
        .ym-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 40px; margin-bottom: 36px; }
        .ym-footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .ym-footer-logo img { width: 52px; height: 52px; border-radius: 12px; background: #fff; padding: 3px; object-fit: contain; }
        .ym-footer-brand-name { color: #fff; font-weight: 800; font-size: 20px; }
        .ym-footer-brand-tagline { color: #fdba74; font-style: italic; font-size: 13.5px; margin-bottom: 12px; font-weight: 600; }
        .ym-footer-brand-desc { font-size: 14px; line-height: 1.75; font-weight: 500; }
        .ym-footer-badges { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .ym-footer-badge { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 12px; font-size: 12px; }
        .ym-footer-h4 { color: #fff; font-weight: 800; font-size: 15.5px; margin-bottom: 16px; }
        .ym-footer-item { font-size: 14px; margin-bottom: 10px; line-height: 1.55; font-weight: 500; }
        .ym-footer-item a { color: rgba(255,255,255,0.65); text-decoration: none; }
        .ym-footer-item a:hover { color: #fdba74; }
        .ym-footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 18px; }
        .ym-footer-visitor-bar { display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .ym-footer-visitor-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: visitorPulse 2s ease infinite; flex-shrink: 0; }
        .ym-footer-visitor-dot.error { background: #f59e0b; animation: none; }
        .ym-footer-visitor-count { color: #fff; font-weight: 800; font-size: 18px; }
        .ym-footer-visitor-label { color: rgba(255,255,255,0.5); font-size: 12.5px; font-weight: 600; }
        .ym-footer-visitor-sep { color: rgba(255,255,255,0.15); font-size: 16px; }
        .ym-skeleton { display: inline-block; background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%); background-size: 200% auto; animation: skeletonShimmer 1.5s linear infinite; border-radius: 4px; height: 1em; width: 40px; vertical-align: middle; }
        .ym-footer-policy-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 0; margin-bottom: 16px; }
        .ym-footer-policy-link { font-size: 12.5px; color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s; padding: 4px 14px; border-right: 1px solid rgba(255,255,255,0.12); font-weight: 600; }
        .ym-footer-policy-link:last-child { border-right: none; }
        .ym-footer-policy-link:hover { color: #fdba74; }
        /* copyright on the left, "Managed by" on the right, same line */
        .ym-footer-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px 24px; flex-wrap: wrap; font-size: 12.5px; font-weight: 600; }

        /* ═════════ RESPONSIVE ═════════ */
        @media (max-width: 1000px) {
          .yw-hero-grid, .yw-mentor, .yw-contact-grid, .yw-off-grid { grid-template-columns: 1fr; gap: 48px; }
          .yw-circle { width: 220px; height: 220px; }
          .yw-float.a { left: -8px; } .yw-float.b { right: -8px; }
          .yw-stats-panel { grid-template-columns: 1fr 1fr; }
          .yw-stat:nth-child(3) { border-left: none; }
          .yw-stat:nth-child(n+3) { border-top: 1px solid var(--line); }
          .yw-cards, .yw-syl, .yw-why-grid { grid-template-columns: 1fr; }
          .yw-flow { grid-template-columns: 1fr 1fr; }
          .yw-week { grid-template-columns: repeat(4, 1fr); }
          .yw-steps { grid-template-columns: 1fr; gap: 32px; }
          .yw-step::after { display: none; }
          .ym-footer-grid { grid-template-columns: 1fr 1fr; }
          .yw-sec { padding: 64px 20px; }
          .yw-hero { padding: 56px 20px 110px; }
          .yw-stats { padding: 0 20px; }
        }
        @media (max-width: 700px) {
          .ym-footer-bottom { flex-direction: column; text-align: center; }
        }
        @media (max-width: 560px) {
          .yw-hero-btns .yw-btn { width: 100%; }
          .yw-stats-panel { grid-template-columns: 1fr; }
          .yw-stat { border-left: none; border-top: 1px solid var(--line); padding: 20px 22px; }
          .yw-stat:first-child { border-top: none; }
          .yw-week { grid-template-columns: repeat(3, 1fr); }
          .yw-flow { grid-template-columns: 1fr; }
          .ym-footer-grid { grid-template-columns: 1fr; }
          .yw-float { display: none; }
          .yw-cta { padding: 28px 22px; }
        }

        /* ═════════ MODAL ═════════ */
        .ym-overlay { position: fixed; inset: 0; background: rgba(8,20,45,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 14px; backdrop-filter: blur(4px); }
        .ym-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 480px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); overflow: hidden; max-height: 94vh; overflow-y: auto; position: relative; }
        .ym-modal-head { background: linear-gradient(135deg, #0b3a7a 0%, #0f1f3d 100%); padding: 24px 28px 20px; color: #fff; position: sticky; top: 0; z-index: 10; border-bottom: 4px solid var(--orange); }
        .ym-modal-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 32px; height: 32px; border-radius: 8px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .ym-modal-close:hover { background: rgba(255,255,255,0.25); }
        .ym-modal-steps { display: flex; align-items: center; gap: 7px; margin-bottom: 14px; }
        .ym-modal-step { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; transition: all 0.3s; }
        .ym-modal-step.current { background: var(--orange); color: #fff; }
        .ym-modal-step.done { background: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .ym-modal-step.future { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .ym-modal-step-line { flex: 1; height: 2px; border-radius: 1px; max-width: 36px; }
        .ym-modal-step-line.done { background: rgba(255,255,255,0.3); }
        .ym-modal-step-line.future { background: rgba(255,255,255,0.1); }
        .ym-modal-logo { width: 44px; height: 44px; border-radius: 10px; background: #fff; padding: 2px; object-fit: contain; margin-bottom: 8px; display: block; }
        .ym-modal-title { font-size: 22px; font-weight: 800; }
        .ym-modal-sub { color: rgba(255,255,255,0.75); font-size: 13.5px; margin-top: 3px; font-weight: 600; }
        .ym-modal-body { padding: 24px 28px 28px; }
        .ym-form-info { background: #eef4fc; border: 1px solid #cfdcf0; border-radius: 10px; padding: 10px 14px; display: flex; gap: 7px; font-size: 12.5px; color: var(--navy); margin-bottom: 18px; font-weight: 600; }
        .ym-form-label { font-size: 12.5px; font-weight: 700; color: var(--muted); margin-bottom: 6px; display: block; }
        .ym-form-group { display: flex; flex-direction: column; }
        .ym-input { width: 100%; border: 1.5px solid #d3dbe8; padding: 12px 14px; border-radius: 10px; font-size: 14px; font-family: inherit; color: var(--text); outline: none; transition: border-color 0.2s; background: #fff; font-weight: 500; }
        .ym-input:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(249,115,22,0.18); }
        .ym-input::placeholder { color: #9aa7bb; }
        .ym-form-stack { display: flex; flex-direction: column; gap: 14px; }
        .ym-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ym-policy-text { font-size: 11.5px; color: #8795ab; text-align: center; line-height: 1.6; }
        .ym-policy-text a { color: var(--navy); text-decoration: none; font-weight: 700; }
        .ym-submit-btn { width: 100%; background: var(--orange); color: #fff; padding: 14px; border-radius: 10px; font-size: 15.5px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; margin-top: 3px; font-family: inherit; box-shadow: 0 8px 18px rgba(249,115,22,0.3); }
        .ym-submit-btn:hover { background: var(--orange-deep); }
        .ym-pay-summary { background: #eef4fc; border: 1.5px solid #cfdcf0; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; text-align: left; }
        .ym-pay-class { font-size: 12.5px; color: var(--navy); font-weight: 700; margin-bottom: 3px; }
        .ym-pay-amount { font-size: 26px; font-weight: 800; color: var(--ink); }
        .ym-pay-unit { font-size: 12px; color: var(--muted); }
        .ym-pay-discount { background: var(--orange-soft); color: #9a3412; font-size: 11px; font-weight: 800; padding: 7px 12px; border-radius: 8px; text-align: center; }
        .ym-confirm-btn { width: 100%; background: var(--orange); color: #fff; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 800; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; box-shadow: 0 8px 18px rgba(249,115,22,0.3); }
        .ym-confirm-btn:hover:not(:disabled) { background: var(--orange-deep); }
        .ym-confirm-btn:disabled, .ym-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ym-pay-err { background: #fee2e2; border: 1px solid #fecaca; border-radius: 10px; padding: 11px 14px; color: #dc2626; font-size: 13px; text-align: center; margin-top: 10px; font-weight: 600; }
        .ym-pay-secure { text-align: center; margin-top: 12px; font-size: 11.5px; color: #8795ab; }
        .ym-spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 480px) {
          .ym-modal-body { padding: 20px 18px 24px; }
          .ym-modal-head { padding: 20px 18px 16px; }
          .ym-form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAVBAR */}
      <Navbar />

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
              <button onClick={() => openModal()} className="yw-btn yw-btn-orange">Reserve a seat</button>
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
        <div className="yw-wrap yw-stats-panel">
          {STATS.map((s) => (
            <div key={s.value} className="yw-stat">
              <div className={`yw-stat-ic ${s.tone}`}>{s.icon}</div>
              <div><b>{s.value}</b><span>{s.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* BATCHES */}
      <section id="classes" className="yw-sec sky">
        <div className="yw-wrap">
          <div className="yw-head center">
            <h2 className="yw-h2">Choose your batch</h2>
            <p className="yw-lead">Live on Google Meet from anywhere in India. Pick your class and pay monthly.</p>
          </div>
          <div className="yw-cards">
            {classKeys.map((cls, idx) => {
              const p = PAYMENT.classes[cls];
              const offerPrice = p.offer === 1 ? p.original : p.offer;
              const save = Math.round(((p.original - offerPrice) / p.original) * 100);
              const s = SLOTS[cls];
              return (
                <div key={cls} className={`yw-card ${cn(cls)}${idx === 2 ? " feat" : ""}`}>
                  {idx === 2 && <span className="yw-card-tag">Board exam year</span>}
                  <div className="yw-card-top">
                    <h3>{cls}</h3>
                    <p className="yw-card-when">{s.days} · {s.time}</p>
                  </div>
                  <div className="yw-card-body">
                    <div className="yw-card-price">
                      <b>₹{offerPrice}</b>
                      <small>/ month</small>
                      {p.original !== offerPrice && <s>₹{p.original}</s>}
                    </div>
                    {save > 0 && <span className="yw-card-save">Save {save}%</span>}
                    <ul>
                      {s.desc.map((t) => (<li key={t}>{t}</li>))}
                    </ul>
                    <button onClick={() => openForClass(cls)} className="yw-btn yw-btn-orange">Join {cls}</button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="yw-note">Fees are charged monthly. Pay securely through PhonePe using UPI, cards or netbanking.</p>
        </div>
      </section>

      {/* SYLLABUS */}
      <section className="yw-sec peach" aria-label="Chapters covered">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">Chapters we cover</h2>
            <p className="yw-lead">Every batch follows the school syllabus, chapter by chapter, with tests after each unit.</p>
          </div>
          <div className="yw-syl">
            {classKeys.map((cls) => (
              <div key={cls} className={`yw-syl-col ${cn(cls)}`}>
                <header>{cls}</header>
                <div className="yw-chips">
                  {SYLLABUS[cls].map((c) => (<span key={c} className="yw-chip">{c}</span>))}
                </div>
              </div>
            ))}
          </div>
          <p className="yw-syl-foot">Chapter order may vary slightly by board (CBSE, TBSE, ICSE).</p>
        </div>
      </section>

      {/* WEEK */}
      <section className="yw-sec mint" aria-label="Weekly timetable">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">Your week at a glance</h2>
            <p className="yw-lead">Each batch meets twice a week, 5 to 7 in the evening. Sunday is free for revision.</p>
          </div>
          <div className="yw-week">
            {WEEK.map((w) => (
              <div key={w.d} className={`yw-day ${w.c ? cn(w.c) : "off"}`}>
                <b>{w.d}</b>
                <span>{w.c || "No class"}</span>
                {w.c && <small>5 to 7 PM</small>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASS FLOW */}
      <section className="yw-sec lav" aria-label="How a class runs">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">How a two-hour class runs</h2>
            <p className="yw-lead">The same four-part rhythm every session, so students always know what comes next.</p>
          </div>
          <div className="yw-flow">
            {FLOW.map((f, i) => (
              <div key={f.t} className="yw-flow-item">
                <div className="yw-flow-num">{i + 1}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why-us" className="yw-sec slate">
        <div className="yw-wrap">
          <div className="yw-head">
            <h2 className="yw-h2">What students get in every class</h2>
            <p className="yw-lead">Coaching built around understanding, not memorising.</p>
          </div>
          <div className="yw-why-grid">
            {reasons.map((r, i) => (
              <div key={r.t} className="yw-why-item">
                <div className={`ic t${i % 4}`}>{["∑", "π", "∫", "?", "▶", "✓"][i]}</div>
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
            <button onClick={() => openModal("Offline")} className="yw-btn yw-btn-orange">Register interest</button>
          </div>
        </div>
      </section>

      {/* HOW TO JOIN */}
      <section className="yw-sec cream">
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
      <section id="about" className="yw-sec sky">
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
            <div style={{ marginTop: 30 }}><button onClick={() => openModal()} className="yw-btn yw-btn-orange">Start learning</button></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="yw-sec peach">
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
            <button onClick={() => openModal()} className="yw-btn yw-btn-orange">Enroll now</button>
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
              <p className="ym-footer-item">Class 10: Mon &amp; Wed, 5 to 7 PM, <span style={{ color: "#fed7aa" }}>₹600</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹700</span></p>
              <p className="ym-footer-item">Class 11: Tue &amp; Fri, 5 to 7 PM, <span style={{ color: "#fed7aa" }}>₹800</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹900</span></p>
              <p className="ym-footer-item">Class 12: Thu &amp; Sat, 5 to 7 PM, <span style={{ color: "#fed7aa" }}>₹900</span> <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>₹1000</span></p>
              <p className="ym-footer-item" style={{ color: "#fdba74", marginTop: "10px" }}>Offline in Khumulwng: launching soon</p>
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
          <div className="ym-footer-bottom">
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
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fff4e8", border: "1px solid #fbd9b5", borderRadius: "10px", padding: "9px 12px" }}><span style={{ fontSize: "14px" }}>📢</span><span style={{ fontSize: "12.5px", color: "#9a3412", fontWeight: 600 }}>Classes are taught in <strong>English Medium</strong>.</span></div>
                    <p className="ym-policy-text">By registering you agree to our <a href={POLICY.terms} target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>, <a href={POLICY.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={POLICY.refund} target="_blank" rel="noopener noreferrer">Refund Policy</a>.</p>
                    <button type="submit" className="ym-submit-btn">Continue to payment</button>
                  </div>
                </form>
              )}

              {step === "payment" && pay && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#0f1f3d" }}>Complete your payment</h3>
                  <p style={{ color: "#5a6a86", fontSize: 14, marginBottom: 20, fontWeight: 500 }}>You&apos;ll be securely redirected to PhonePe to pay.</p>
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
                  <button onClick={() => { setStep("form"); setPayError(""); setSubmitting(false); }} style={{ marginTop: 14, background: "none", border: "none", color: "#5a6a86", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>← Edit details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}