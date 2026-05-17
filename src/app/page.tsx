"use client";

import { useState } from "react";

export default function Home() {

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [mode, setMode] = useState("");

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwBZepl7eijkaiajLUwVlY_udCJhCcAJNUBBNfgz_IcSABbbLqdWOvtNlg1s8h4KFAOqA/exec";

  // GOOGLE SHEET FORM
  const handleSubmit = async (e: any) => {

    e.preventDefault();

    const formData = {
      name,
      whatsapp,
      studentClass,
      mode,
    };

    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(formData),
    });

    alert("Registration Successful!");

    setShowForm(false);
  };

  return (

    <main className="min-h-screen bg-gray-50 text-black">

      {/* Navbar */}
      <nav className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white shadow-sm border-b sticky top-0 z-50 gap-4">

        {/* Left Side */}
        <div className="flex items-center gap-5 md:gap-6">

          {/* Logo */}
          <img
            src="/Logo.png"
            alt="Yarwng Mathematics Logo"
            className="w-20 h-20 md:w-28 md:h-28 object-contain"
          />

          {/* Text */}
          <div>

            <h1 className="text-xl md:text-3xl font-bold text-blue-600">
              Yarwng Mathematics
            </h1>

            <p className="text-gray-600 text-sm text-center md:text-left">
              Rakesh Debbarma (M.Sc IIT Delhi)
            </p>

          </div>

        </div>

        {/* Right Side */}
        <a
          href="/login"
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-8
            py-3
            rounded-2xl
            font-bold
            text-lg
            shadow-lg
            transition
            duration-300
          "
        >
          Login / Register
        </a>

      </nav>

      {/* Hero */}
      <section className="py-16 md:py-28 px-4 md:px-8 text-center bg-gradient-to-b from-blue-50 to-white">

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
          Learn Mathematics
          <br />
          With Conceptual Clarity
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
          Professional Mathematics Coaching for
          Class 10, Class 11 and Class 12.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl text-lg md:text-2xl font-bold hover:bg-blue-700"
        >
          Join Classes
        </button>

      </section>

      {/* REGISTRATION POPUP */}
      {showForm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-[95%] md:w-[90%] max-w-lg relative shadow-2xl">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center">
              Join Yarwng Mathematics
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Whatsapp Number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border p-4 rounded-xl"
              />

              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full border p-4 rounded-xl"
              >
                <option value="">Select Class</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full border p-4 rounded-xl"
              >
                <option value="">Select Mode</option>
                <option>Online</option>
                <option>Offline</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700"
              >
                Submit Registration
              </button>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}