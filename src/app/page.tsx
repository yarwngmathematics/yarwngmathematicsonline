# Yarwng Mathematics — Professional Website Upgrade

Replace your current `src/app/page.tsx` code with the following upgraded version.

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-black">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b bg-white sticky top-0 z-50">
        <div>
          <h1 className="text-4xl font-bold text-blue-600">
            Yarwng Mathematics
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            By Rakesh Debbarma (M.Sc at IIT Delhi)
          </p>
        </div>

        <div className="flex gap-8 text-lg font-medium">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#courses" className="hover:text-blue-600">Courses</a>
          <a href="#registration" className="hover:text-blue-600">Registration</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>
      </nav>


      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-b from-blue-50 to-white"
      >
        <p className="text-blue-600 font-semibold text-xl mb-5">
          Online Mathematics Coaching
        </p>

        <h1 className="text-6xl font-bold max-w-5xl leading-tight mb-8">
          Learn Mathematics With
          <br />
          Conceptual Clarity
        </h1>

        <p className="text-2xl text-gray-600 max-w-3xl mb-10 leading-relaxed">
          Special coaching for Class 10, Class 11 and Class 12 Mathematics.
          Clear concepts, deep understanding and exam-oriented preparation.
        </p>

        <div className="flex gap-6">
          <a
            href="#registration"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-xl font-semibold transition"
          >
            Register Now
          </a>

          <a
            href="#courses"
            className="border border-gray-400 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-gray-100 transition"
          >
            View Courses
          </a>
        </div>
      </section>


      {/* Courses Section */}
      <section id="courses" className="py-24 px-8 bg-gray-100">
        <h2 className="text-5xl font-bold text-center mb-16">
          Courses Offered
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

          {/* Class 10 */}
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
            <h3 className="text-4xl font-bold mb-5">
              Class 10
            </h3>

            <p className="text-gray-600 text-lg mb-8">
              Complete board preparation with conceptual mathematics and problem solving.
            </p>

            <div className="text-blue-600 font-bold text-2xl mb-6">
              ₹999 / month
            </div>

            <a
              href="#registration"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700"
            >
              Register
            </a>
          </div>


          {/* Class 11 */}
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
            <h3 className="text-4xl font-bold mb-5">
              Class 11
            </h3>

            <p className="text-gray-600 text-lg mb-8">
              Strong foundation in algebra, trigonometry and advanced problem solving.
            </p>

            <div className="text-blue-600 font-bold text-2xl mb-6">
              ₹1499 / month
            </div>

            <a
              href="#registration"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700"
            >
              Register
            </a>
          </div>


          {/* Class 12 */}
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center hover:scale-105 transition duration-300">
            <h3 className="text-4xl font-bold mb-5">
              Class 12
            </h3>

            <p className="text-gray-600 text-lg mb-8">
              Board exams and competitive mathematics preparation with deep clarity.
            </p>

            <div className="text-blue-600 font-bold text-2xl mb-6">
              ₹1999 / month
            </div>

            <a
              href="#registration"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700"
            >
              Register
            </a>
          </div>
        </div>
      </section>


      {/* Registration Section */}
      <section
        id="registration"
        className="py-28 px-6 bg-white"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 shadow-2xl text-white animate-pulse">

          <h2 className="text-5xl font-bold text-center mb-10">
            Student Registration
          </h2>

          <form className="grid gap-6">

            <input
              type="text"
              placeholder="Student Name"
              className="p-5 rounded-xl text-black text-lg"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="p-5 rounded-xl text-black text-lg"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="p-5 rounded-xl text-black text-lg"
            />

            <select className="p-5 rounded-xl text-black text-lg">
              <option>Select Class</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>

            <button
              type="submit"
              className="bg-white text-blue-700 font-bold py-5 rounded-xl text-xl hover:bg-gray-200 transition"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </section>


      {/* Payment Section */}
      <section className="py-24 px-8 bg-gray-100 text-center">
        <h2 className="text-5xl font-bold mb-14">
          Payment Links
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Class 10</h3>
            <p className="text-gray-600 mb-6">Monthly Fees: ₹999</p>

            <a
              href="https://rzp.io"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              Pay Now
            </a>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Class 11</h3>
            <p className="text-gray-600 mb-6">Monthly Fees: ₹1499</p>

            <a
              href="https://rzp.io"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              Pay Now
            </a>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Class 12</h3>
            <p className="text-gray-600 mb-6">Monthly Fees: ₹1999</p>

            <a
              href="https://rzp.io"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              Pay Now
            </a>
          </div>
        </div>
      </section>


      {/* WhatsApp Section */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-5xl font-bold mb-8">
          Join WhatsApp Group
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          After registration and payment, join your class WhatsApp group.
        </p>

        <a
          href="https://chat.whatsapp.com/"
          target="_blank"
          className="bg-green-500 hover:bg-green-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold"
        >
          Join WhatsApp Group
        </a>
      </section>


      {/* Footer */}
      <footer
        id="contact"
        className="bg-black text-white py-12 text-center"
      >
        <h3 className="text-3xl font-bold mb-4">
          Yarwng Mathematics
        </h3>

        <p className="text-lg text-gray-300 mb-2">
          By Rakesh Debbarma
        </p>

        <p className="text-gray-400">
          M.Sc Mathematics — IIT Delhi
        </p>

        <p className="text-gray-400 mt-6">
          Contact: yarwngmathematics@gmail.com
        </p>

        <p className="text-gray-400 mt-2">
          WhatsApp: +91 9366030347
        </p>
      </footer>
    </main>
  )
}
```

---

# After Replacing The Code

Save the file:

```bash
Ctrl + S
```

Then run these commands in terminal:

```bash
git add .
git commit -m "major website upgrade"
git push
```

Vercel automatically updates your live website in about 1 minute.

---

# IMPORTANT NEXT IMPROVEMENTS

Later you can add:

* Real payment gateway (Razorpay)
* Real registration database
* OTP login
* Student dashboard
* Live classes
* Notes PDF download
* YouTube lecture integration
* Mobile menu animation
* Dark mode
* Admin panel
