"use client";

export default function AdminPage() {

  return (

    <main className="min-h-screen bg-gray-100">

      {/* Header */}
     <section className="bg-gradient-to-r from-blue-900 to-black text-white p-6 md:p-8 shadow-xl">

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          <div>

            <h1 className="text-4xl md:text-6xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-4 text-lg text-gray-300">
              Manage lectures, students and live classes.
            </p>

          </div>

          <img
  src="/Logo.png"
  alt="Logo"
  className="w-20 md:w-28 object-contain opacity-90"
/>

        </div>

      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto p-6 md:p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-10 relative z-10">

        <div className="bg-white p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Upload Lectures
          </h2>

          <p className="text-gray-600 mb-5">
            Upload recorded mathematics classes.
          </p>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Upload Video
          </button>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Upload Notes
          </h2>

          <p className="text-gray-600 mb-5">
            Upload PDFs and study materials.
          </p>

          <button className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            Upload PDF
          </button>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Live Classes
          </h2>

          <p className="text-gray-600 mb-5">
            Start interactive live sessions.
          </p>

          <button className="bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Start Live
          </button>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-4 text-red-700">
            Student Management
          </h2>

          <p className="text-gray-600 mb-5">
            View and manage enrolled students.
          </p>

          <button className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition">
            View Students
          </button>

        </div>

      </section>

      {/* Analytics */}
      <section className="max-w-7xl mx-auto p-6 md:p-8">

        <h2 className="text-4xl font-bold mb-8 text-center">
          Platform Analytics
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

            <h3 className="text-5xl font-bold text-blue-600">
              120+
            </h3>

            <p className="mt-4 text-xl text-gray-600">
              Total Students
            </p>

          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

            <h3 className="text-5xl font-bold text-green-600">
              45+
            </h3>

            <p className="mt-4 text-xl text-gray-600">
              Lectures Uploaded
            </p>

          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

            <h3 className="text-5xl font-bold text-purple-600">
              15+
            </h3>

            <p className="mt-4 text-xl text-gray-600">
              Live Sessions
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}