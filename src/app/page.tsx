"use client";

import { useState } from "react";

export default function Home() {

  const [showForm, setShowForm] = useState(false);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbx2dAeadFsu4yoiMk5zKpjcZtwkjy3eHvjZdEZ4KoWKdkHNTqE_sAmIrRUdDIXRQfBQ/exec";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = {
      name: "Test Student",
      whatsapp: "9366030347",
      studentClass: "Class 10",
      mode: "Online",
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
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm border-b sticky top-0 z-50">

        {/* Left Side */}
        <div className="flex items-center gap-4">

          {/* Circle Logo */}
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            Y
          </div>

          {/* Text */}
          <div>

            <h1 className="text-3xl font-bold text-blue-600">
              Yarwng Mathematics
            </h1>

            <p className="text-gray-600 text-sm">
              Rakesh Debbarma (M.Sc IIT Delhi)
            </p>

          </div>
        </div>


        {/* Right Side */}
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
          Login/Register
        </button>

      </nav>


      {/* Hero Section */}
      <section className="py-28 px-8 text-center bg-gradient-to-b from-blue-50 to-white">

        <h1 className="text-6xl font-bold leading-tight mb-8">
          Learn Mathematics
          <br />
          With Conceptual Clarity
        </h1>

        <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
          Professional Mathematics Coaching for
          Class 10, Class 11 and Class 12.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-2xl font-bold hover:bg-blue-700"
        >
          Join Classes
        </button>

      </section>


      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-[90%] max-w-lg relative shadow-2xl">

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
                className="w-full border p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Whatsapp Number"
                className="w-full border p-4 rounded-xl"
              />

              <select className="w-full border p-4 rounded-xl">
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>

              <select className="w-full border p-4 rounded-xl">
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


      {/* Online Session */}
      <section className="py-24 px-8">

        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-12">

          {/* Left */}
          <div>

            <h2 className="text-5xl font-bold mb-6 text-blue-600">
              Online Session
            </h2>

            <p className="text-xl text-gray-600 mb-10">
              Live Online Mathematics Coaching
            </p>

            <div className="space-y-6 text-2xl font-semibold">

              <div className="flex justify-between border-b pb-3">
                <span>Class 10</span>
                <span>₹700 / month</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Class 11</span>
                <span>₹900 / month</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Class 12</span>
                <span>₹1000 / month</span>
              </div>

            </div>
          </div>


          {/* Right */}
          <div className="bg-blue-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center">

            <div className="w-52 h-52 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8 text-gray-500">
              QR Scanner Here
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700"
            >
              Join Classes
            </button>

          </div>

        </div>
      </section>


      {/* Offline Session */}
      <section className="pb-24 px-8">

        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-12">

          {/* Left */}
          <div>

            <h2 className="text-5xl font-bold mb-4 text-blue-600">
              Offline Coaching
            </h2>

            <p className="text-2xl font-semibold mb-8">
              (Khumulwng)
            </p>

            <div className="space-y-6 text-2xl font-semibold">

              <div className="flex justify-between border-b pb-3">
                <span>Class 10</span>
                <span>₹700 / month</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Class 11</span>
                <span>₹900 / month</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Class 12</span>
                <span>₹1000 / month</span>
              </div>

            </div>
          </div>


          {/* Right */}
          <div className="bg-blue-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center">

            <div className="w-52 h-52 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8 text-gray-500">
              QR Scanner Here
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700"
            >
              Join Classes
            </button>

          </div>

        </div>
      </section>


      {/* About */}
      <section className="py-24 px-8 bg-white">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-5xl font-bold mb-8 text-blue-600">
            Know About Yarwng Mathematics
          </h2>

          <div className="bg-gray-100 rounded-3xl p-10 text-gray-600 text-xl">
            Write about Yarwng Mathematics here later.
          </div>

        </div>

      </section>


      {/* Different */}
      <section className="py-24 px-8 bg-gray-100">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-5xl font-bold mb-8 text-blue-600">
            What Makes Us Different
          </h2>

          <div className="bg-white rounded-3xl p-10 text-gray-600 text-xl shadow-lg">
            Write what makes Yarwng Mathematics different later.
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="bg-black text-white py-14 text-center">

        <h3 className="text-4xl font-bold mb-4">
          Yarwng Mathematics
        </h3>

        <p className="text-xl text-gray-300 mb-3">
          By Rakesh Debbarma
        </p>

        <p className="text-gray-400 mb-2">
          M.Sc Mathematics — IIT Delhi
        </p>

        <p className="text-gray-400 mb-2">
          WhatsApp: +91 9366030347
        </p>

      </footer>

    </main>
  );
}