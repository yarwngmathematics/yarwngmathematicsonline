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
    setName("");
    setWhatsapp("");
    setStudentClass("");
    setMode("");
  };

  const slotData: Record<string, { days: string; time: string }> = {
    "Class 10": {
      days: "Monday & Wednesday",
      time: "5:00 PM – 7:00 PM",
    },
    "Class 11": {
      days: "Tuesday & Friday",
      time: "5:00 PM – 7:00 PM",
    },
    "Class 12": {
      days: "Thursday & Saturday",
      time: "5:00 PM – 7:00 PM",
    },
  };

  const adVariants = [
    <div
      key="v1"
      className="w-full rounded-2xl overflow-hidden border-2 border-blue-300 bg-white shadow-md flex flex-col md:flex-row min-h-[200px]"
    >
      <div className="bg-blue-700 text-white flex flex-col justify-center px-8 py-10 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">
          📢 Enrollment Open
        </p>

        <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2">
          Online Classes Start
          <br />
          <span className="text-yellow-300">3rd June 2025</span>
        </h3>

        <p className="text-blue-100 text-base mt-2">
          Class 10 · 11 · 12 | Via Google Meet
        </p>
      </div>

      <div className="bg-yellow-50 flex flex-col items-center justify-center gap-4 px-8 py-8 shrink-0">
        <div className="border-2 border-yellow-400 rounded-2xl px-6 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-1">
            Seats Filling Fast
          </p>

          <p className="text-4xl font-extrabold text-blue-800">
            🔥 Enroll
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Limited spots per batch
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 rounded-2xl font-bold text-base shadow transition"
        >
          Register Now →
        </button>
      </div>
    </div>,
  ];

  return (
    <main
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/Logo.png"
              alt="Logo"
              className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl"
            />

            <div>
              <h1 className="text-lg md:text-2xl font-bold text-blue-700 leading-tight">
                Yarwng Mathematics
              </h1>

              <p className="text-xs text-gray-500">
                Rakesh Debbarma · M.Sc, IIT Delhi
              </p>
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

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 text-white py-20 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Professional Mathematics Coaching
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Learn Mathematics
            <br />
            <span className="text-yellow-300">
              With Conceptual Clarity
            </span>
          </h2>

          <p className="text-yellow-200 text-base md:text-lg italic font-medium mb-4 tracking-wide">
            "Amani Kok Kokborok bai Swrwngwi Mannai"
          </p>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Expert coaching for Class 10, 11 & 12 · Online & Offline
          </p>
        </div>
      </section>

      {/* ── LIVE ADVERTISEMENT BANNER ── */}
      <section className="bg-gray-50 border-y border-gray-200 py-8 px-4 relative">
        <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-3 py-1 shadow-sm z-10">
          <span
            className="inline-block w-2 h-2 rounded-full bg-red-500"
            style={{
              opacity: liveDot ? 1 : 0.2,
              transition: "opacity 0.4s",
            }}
          />

          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            Live
          </span>
        </div>

        <div className="max-w-6xl mx-auto pt-6">
          <div key={adVariant}>{adVariants[adVariant]}</div>
        </div>
      </section>

      {/* ── ONLINE SESSION ── */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span>🟢</span> Currently via Google Meet
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Online Session
          </h2>

          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-6" />

          <p className="text-gray-500 max-w-xl mx-auto">
            Live interactive classes via Google Meet.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-4 rounded-2xl text-lg font-bold shadow transition"
          >
            Join Online Classes →
          </button>
        </div>
      </section>

      {/* ── OFFLINE SESSION ── */}
      <section className="bg-orange-50 border-y border-orange-100 py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span>🔔</span> Starting Soon
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offline Session
          </h2>

          <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full mb-8" />

          <div className="bg-white border border-orange-100 rounded-3xl p-8 md:p-12 shadow-sm inline-block w-full">
            <div className="text-5xl mb-4">🏫</div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Physical Classroom
            </h3>

            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Khumulwng, Tripura
            </p>

            <button
              onClick={() => {
                setMode("Offline");
                setShowForm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow transition"
            >
              Register Interest
            </button>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Makes Us Different
          </h2>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Know About Yarwng Mathematics
          </h2>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>
            © {new Date().getFullYear()} Yarwng Mathematics.
          </p>
        </div>
      </footer>
    </main>
  );
}