"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [mode, setMode] = useState("");

  const [slotsOpen, setSlotsOpen] = useState(false);
  const [selectedSlotClass, setSelectedSlotClass] = useState<string | null>(null);

  const [liveDot, setLiveDot] = useState(true);
  const [adVariant, setAdVariant] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLiveDot((v) => !v), 900);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle ad variants every 5 seconds
  useEffect(() => {
    const t = setInterval(() => setAdVariant((v) => (v + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = { name, whatsapp, studentClass, mode };
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(formData),
    });
    alert("Registration Successful!");
    setShowForm(false);
    setName(""); setWhatsapp(""); setStudentClass(""); setMode("");
  };

  const slotData: Record<string, { days: string; time: string }> = {
    "Class 10": { days: "Monday & Wednesday", time: "5:00 PM – 7:00 PM" },
    "Class 11": { days: "Tuesday & Friday", time: "5:00 PM – 7:00 PM" },
    "Class 12": { days: "Thursday & Saturday", time: "5:00 PM – 7:00 PM" },
  };

  // Three unique ad designs
  const adVariants = [
    // Variant 1: Bold split card with countdown feel
    <div key="v1" className="w-full rounded-2xl overflow-hidden border-2 border-blue-300 bg-white shadow-md flex flex-col md:flex-row min-h-[200px]">
      <div className="bg-blue-700 text-white flex flex-col justify-center px-8 py-10 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">📢 Enrollment Open</p>
        <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2">
          Online Classes Start<br />
          <span className="text-yellow-300">3rd June 2026</span>
        </h3>
        <p className="text-blue-100 text-base mt-2">Class 10 · 11 · 12 &nbsp;|&nbsp; Via Google Meet</p>
      </div>
      <div className="bg-yellow-50 flex flex-col items-center justify-center gap-4 px-8 py-8 shrink-0">
        <div className="border-2 border-yellow-400 rounded-2xl px-6 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-1">Seats Filling Fast</p>
          <p className="text-4xl font-extrabold text-blue-800">🔥 Enroll</p>
          <p className="text-xs text-gray-500 mt-1">Limited spots per batch</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 rounded-2xl font-bold text-base shadow transition"
        >
          Register Now →
        </button>
      </div>
    </div>,

    // Variant 2: Neon-bordered dark card with glowing badge
    <div key="v2" className="w-full rounded-2xl overflow-hidden border border-indigo-400 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex flex-col md:flex-row items-stretch min-h-[200px]">
      <div className="flex flex-col justify-center px-8 py-10 flex-1">
        <span className="inline-block bg-indigo-500/40 text-indigo-200 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 w-fit">
          🚀 Now Accepting Registrations
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
          Online Classes<br />
          <span className="text-yellow-300">Starting 3rd June 2026</span>
        </h3>
        <p className="text-indigo-200 text-sm mt-2">Google Meet · Class 10 / 11 / 12</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-8 border-t md:border-t-0 md:border-l border-indigo-600 bg-white/5 shrink-0">
        <div className="text-center text-white">
          <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Don't miss out</p>
          <p className="text-lg font-bold text-yellow-300">⚡ Enroll Fast</p>
          <p className="text-xs text-indigo-300 mt-1">Seats are limited!</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-8 py-3 rounded-2xl font-bold text-base shadow-lg transition"
        >
          Register Now →
        </button>
      </div>
    </div>,

    // Variant 3: Minimal clean card with left accent stripe
    <div key="v3" className="w-full rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[200px] border border-gray-200 bg-white shadow-sm">
      <div className="w-2 md:w-3 bg-blue-600 shrink-0" />
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 py-10 gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">📣 Announcement</p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            Online Classes Start<br />
            <span className="text-blue-700">3rd June 2026</span>
          </h3>
          <p className="text-gray-500 text-sm mt-1">Class 10, 11 & 12 · Google Meet · Live Sessions</p>
        </div>
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 text-center">
            <p className="text-xs font-semibold text-blue-600 mb-0.5">Limited Seats Available</p>
            <p className="text-sm font-bold text-blue-800">Enroll Fast 🔥</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-base shadow transition"
          >
            Register Now →
          </button>
        </div>
      </div>
    </div>,
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl" />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-blue-700 leading-tight">Yarwng Mathematics</h1>
              <p className="text-xs text-gray-500">Rakesh Debbarma · M.Sc, IIT Delhi</p>
            </div>
          </div>
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold text-sm md:text-base shadow transition"
          >
            Login / Register
          </a>
        </div>
      </nav>

      {/* ── HERO (no Join Classes button) ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 text-white py-20 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Professional Mathematics Coaching
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Learn Mathematics<br />
            <span className="text-yellow-300">With Conceptual Clarity</span>
          </h2>
          {/* Kokborok tagline */}
          <p className="text-yellow-200 text-base md:text-lg italic font-medium mb-4 tracking-wide">
            "Amani Kok Kokborok bai Swrwngwi Mannai"
          </p>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Expert coaching for Class 10, 11 &amp; 12 · Online &amp; Offline · Tripura's trusted math faculty
          </p>
        </div>
      </section>

      {/* ── LIVE ADVERTISEMENT BANNER ── */}
      <section className="bg-gray-50 border-y border-gray-200 py-8 px-4 relative">
        {/* Live badge */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 shadow-sm z-10">
          <span
            className="inline-block w-2 h-2 rounded-full bg-red-500"
            style={{ opacity: liveDot ? 1 : 0.2, transition: "opacity 0.4s" }}
          />
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Live</span>
        </div>

        <div className="max-w-6xl mx-auto pt-6">
          {/* Variant switcher dots */}
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setAdVariant(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${adVariant === i ? "bg-blue-600" : "bg-gray-300"}`}
                aria-label={`Ad design ${i + 1}`}
              />
            ))}
          </div>

          {/* Animated ad variant */}
          <div key={adVariant} style={{ animation: "fadeIn 0.4s ease" }}>
            {adVariants[adVariant]}
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT (moved up) ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-blue-600 italic text-base font-medium mb-4">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
            <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: "Conceptual Depth", desc: "We don't just teach formulas — we build intuition and deep understanding that lasts beyond exams." },
              { icon: "👨‍🏫", title: "IIT-Level Expertise", desc: "Faculty trained at one of India's premier institutes brings top-tier mathematical rigour to every class." },
              { icon: "🗓️", title: "Structured Timetable", desc: "Fixed weekly slots per class ensure consistency, discipline, and steady progress throughout the year." },
              { icon: "💬", title: "WhatsApp Support", desc: "Doubt-clearing continues beyond class hours via dedicated WhatsApp groups for every batch." },
              { icon: "🖥️", title: "Google Meet Sessions", desc: "High-quality online classes through Google Meet — join from anywhere with a good connection." },
              { icon: "📝", title: "Regular Assessments", desc: "Frequent tests and detailed feedback help track progress and identify areas needing improvement." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT YARWNG MATHEMATICS (moved after What Makes Us Different) ── */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Know About Yarwng Mathematics</h2>
          <p className="text-blue-600 italic text-base font-medium mb-4">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong className="text-blue-700">Yarwng Mathematics</strong> was founded with a singular mission — to make
              advanced mathematics accessible, understandable, and enjoyable for every student in Tripura and beyond.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Led by <strong>Rakesh Debbarma</strong>, an M.Sc graduate from <strong>IIT Delhi</strong>, we bring
              world-class mathematical thinking to your doorstep — whether you're preparing for board exams or
              competitive entrance tests.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our approach combines rigorous conceptual teaching, regular problem-solving practice, and personalised
              attention so every student grows confidently.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🎓", label: "IIT Delhi Alumni", sub: "M.Sc Mathematics" },
              { icon: "📚", label: "Classes 10–12", sub: "Full syllabus coverage" },
              { icon: "🌐", label: "Online & Offline", sub: "Flexible learning modes" },
              { icon: "📈", label: "Proven Results", sub: "High scoring students" },
            ].map((card) => (
              <div key={card.label} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{card.icon}</div>
                <p className="font-bold text-blue-800 text-sm">{card.label}</p>
                <p className="text-blue-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ONLINE SESSION ── */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span>🟢</span> Currently via Google Meet
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Online Session</h2>
          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto">Live interactive classes via Google Meet. Join from anywhere in India. Small batches ensure personalised attention.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => { setSlotsOpen(!slotsOpen); setSelectedSlotClass(null); }}
            className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow transition mb-4"
          >
            <span>📅 View Class Slots</span>
            <span className="text-2xl">{slotsOpen ? "−" : "+"}</span>
          </button>

          {slotsOpen && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
              <p className="text-sm text-gray-500 mb-4 text-center">Select your class to see the schedule</p>
              {(["Class 10", "Class 11", "Class 12"] as const).map((cls) => (
                <div key={cls}>
                  <button
                    onClick={() => setSelectedSlotClass(selectedSlotClass === cls ? null : cls)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border font-semibold transition ${
                      selectedSlotClass === cls
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span>{cls}</span>
                    <span>{selectedSlotClass === cls ? "▲" : "▼"}</span>
                  </button>
                  {selectedSlotClass === cls && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">📆</span>
                        <div>
                          <p className="font-semibold text-blue-800">{slotData[cls].days}</p>
                          <p className="text-blue-600 text-sm">Every week</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🕐</span>
                        <div>
                          <p className="font-semibold text-blue-800">{slotData[cls].time}</p>
                          <p className="text-blue-600 text-sm">Evening session · 2 hours</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-4 rounded-2xl text-lg font-bold shadow transition"
            >
              Join Online Classes →
            </button>
          </div>
        </div>
      </section>

      {/* ── OFFLINE SESSION ── */}
      <section className="bg-orange-50 border-y border-orange-100 py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span>🔔</span> Starting Soon
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Offline Session</h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full mb-8" />
          <div className="bg-white border border-orange-100 rounded-3xl p-8 md:p-12 shadow-sm inline-block w-full">
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Physical Classroom</h3>
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold text-lg mb-3">
              <span>📍</span> Khumulwng, Tripura
            </div>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Face-to-face classes in a structured classroom environment. Personalised attention in small batches.
              Details will be announced soon — register your interest now!
            </p>
            <div className="inline-block bg-orange-100 text-orange-700 px-5 py-2 rounded-xl font-bold text-sm mb-6">
              ⏳ Launching Soon — Limited Seats
            </div>
            <div>
              <button
                onClick={() => { setMode("Offline"); setShowForm(true); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow transition"
              >
                Register Interest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION POPUP ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-2xl font-bold text-gray-900">Join Yarwng Mathematics</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in your details to register</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="WhatsApp Number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                required
                className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                required
                className="w-full border border-gray-200 p-3.5 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Mode</option>
                <option>Online</option>
                <option>Offline</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold transition"
              >
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Yarwng Mathematics</h3>
              <p className="text-yellow-400 italic text-sm mb-3">"Amani Kok Kokborok bai Swrwngwi Mannai"</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional Mathematics Coaching for Classes 10, 11 &amp; 12. Conceptual clarity. Proven results.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>👨‍🏫 <strong className="text-gray-200">Rakesh Debbarma</strong></li>
                <li>🎓 M.Sc Mathematics, IIT Delhi</li>
                <li>📱 <a href="tel: 9366030347" className="hover:text-white transition"> 9366030347</a></li>
                <li>✉️ <a href="mailto:yarwngmathematics@gmail.com" className="hover:text-white transition">yarwngmathematics@gmail.com</a></li>
                <li>📍 Khumulwng, Tripura</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Classes Offered</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>📘 Class 10 · Mon &amp; Wed · 5–7 PM</li>
                <li>📙 Class 11 · Tue &amp; Fri · 5–7 PM</li>
                <li>📗 Class 12 · Thu &amp; Sat · 5–7 PM</li>
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