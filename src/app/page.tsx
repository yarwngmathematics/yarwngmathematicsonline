export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-black">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b sticky top-0 z-50 shadow-sm">

        <div>
          <h1 className="text-4xl font-bold text-blue-600">
            Yarwng Mathematics
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            By Rakesh Debbarma (M.Sc IIT Delhi)
          </p>
        </div>

        <div className="flex gap-8 items-center text-lg font-medium">
          <a href="#courses" className="hover:text-blue-600">
            Courses
          </a>

          <a href="#login" className="hover:text-blue-600">
            Login/Register
          </a>

          <a
            href="#join"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Join Classes
          </a>
        </div>
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

        <a
          href="#join"
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-2xl font-semibold hover:bg-blue-700"
        >
          Join Classes
        </a>
      </section>


      {/* Online Session */}
      <section
        id="courses"
        className="py-24 px-8"
      >

        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-12">

          {/* Left */}
          <div>
            <h2 className="text-5xl font-bold mb-6 text-blue-600">
              Online Session
            </h2>

            <p className="text-xl text-gray-600 mb-10">
              Live Online Mathematics Classes with Conceptual Learning.
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

            <a
              href="https://forms.google.com"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold mb-5 hover:bg-blue-700"
            >
              Registration Form
            </a>

            <a
              href="#join"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-100"
            >
              Join Classes
            </a>
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

            <a
              href="https://forms.google.com"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold mb-5 hover:bg-blue-700"
            >
              Registration Form
            </a>

            <a
              href="#join"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-100"
            >
              Join Classes
            </a>
          </div>
        </div>
      </section>


      {/* Login/Register */}
      <section
        id="login"
        className="py-24 px-8 bg-white"
      >

        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 p-12 rounded-3xl shadow-2xl text-white">

          <h2 className="text-5xl font-bold text-center mb-12">
            Login / Register
          </h2>

          <div className="grid gap-6">

            <input
              type="tel"
              placeholder="Mobile Number"
              className="p-5 rounded-xl text-black text-lg"
            />

            <button className="bg-white text-blue-700 py-4 rounded-xl text-xl font-bold hover:bg-gray-200">
              Get OTP
            </button>

            <input
              type="text"
              placeholder="First Name"
              className="p-5 rounded-xl text-black text-lg"
            />

            <input
              type="text"
              placeholder="Surname"
              className="p-5 rounded-xl text-black text-lg"
            />

            <textarea
              placeholder="Address"
              className="p-5 rounded-xl text-black text-lg"
            />

            <button className="bg-black text-white py-5 rounded-xl text-2xl font-bold hover:bg-gray-900">
              Register Now
            </button>
          </div>
        </div>
      </section>


      {/* Join Classes */}
      <section
        id="join"
        className="py-24 px-8 bg-gray-100"
      >

        <div className="max-w-6xl mx-auto bg-white p-12 rounded-3xl shadow-2xl">

          <h2 className="text-5xl font-bold text-center mb-14 text-blue-600">
            Join Classes
          </h2>


          {/* Online/Offline */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">

            <div>
              <label className="text-xl font-semibold block mb-3">
                Choose Mode
              </label>

              <select className="w-full p-5 rounded-xl border text-lg">
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

            <div>
              <label className="text-xl font-semibold block mb-3">
                Select Class
              </label>

              <select className="w-full p-5 rounded-xl border text-lg">
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>
            </div>
          </div>


          {/* Offline Slots */}
          <div className="mb-10">
            <h3 className="text-3xl font-bold mb-6">
              Offline Time Slots
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-xl font-semibold">
                Morning: 7 AM – 9 AM
              </button>

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-xl font-semibold">
                Evening: 5 PM – 7 PM
              </button>
            </div>
          </div>


          {/* Online Slots */}
          <div className="mb-10">
            <h3 className="text-3xl font-bold mb-6">
              Online Time Slots
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-xl font-semibold">
                7:30 PM – 8:30 PM
              </button>

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-xl font-semibold">
                9 PM – 11 PM
              </button>
            </div>
          </div>


          {/* Day Options */}
          <div>
            <h3 className="text-3xl font-bold mb-6">
              Choose Days
            </h3>

            <div className="grid md:grid-cols-3 gap-6">

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-lg font-semibold">
                Monday & Wednesday
              </button>

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-lg font-semibold">
                Tuesday & Friday
              </button>

              <button className="border p-6 rounded-2xl hover:bg-blue-50 text-lg font-semibold">
                Thursday & Saturday
              </button>
            </div>
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

        <p className="text-gray-400">
          Email: yarwngmathematics@gmail.com
        </p>
      </footer>
    </main>
  )
}