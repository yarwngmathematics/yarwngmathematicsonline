export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white text-black">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b">

        <h1 className="text-2xl font-bold text-blue-600">
          Rakesh Maths
        </h1>

        <div className="flex gap-8 text-lg">
          <a href="#">Home</a>
          <a href="#">Courses</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
      {/* Courses Section */}
      <section className="py-24 px-10 bg-gray-50">

        <h2 className="text-5xl font-bold text-center mb-16">
          Courses Offered
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">

            <h3 className="text-3xl font-bold mb-4">
              Real Analysis
            </h3>

            <p className="text-gray-600 mb-6">
              Complete theorem-based understanding
              with rigorous problem solving.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Learn More
            </button>

          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">

            <h3 className="text-3xl font-bold mb-4">
              Topology
            </h3>

            <p className="text-gray-600 mb-6">
              Conceptual and exam-oriented topology
              classes for MSc mathematics students.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Learn More
            </button>

          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">

            <h3 className="text-3xl font-bold mb-4">
              IIT JAM Mathematics
            </h3>

            <p className="text-gray-600 mb-6">
              Full preparation including notes,
              mock tests and PYQs.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
              Learn More
            </button>

          </div>

        </div>

      </section>
            {/* Testimonials */}
      <section className="py-24 px-10">

        <h2 className="text-5xl font-bold text-center mb-16">
          Student Testimonials
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border">

            <p className="text-gray-600 mb-6">
              “The explanations are extremely clear and
              conceptual. Real Analysis became much easier.”
            </p>

            <h3 className="text-xl font-bold">
              Aman Kumar
            </h3>

            <p className="text-gray-500">
              MSc Mathematics Student
            </p>

          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border">

            <p className="text-gray-600 mb-6">
              “Best IIT JAM mathematics guidance with
              proper problem-solving methods.”
            </p>

            <h3 className="text-xl font-bold">
              Priya Sharma
            </h3>

            <p className="text-gray-500">
              IIT JAM Aspirant
            </p>

          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border">

            <p className="text-gray-600 mb-6">
              “Topology and Fourier Analysis were taught
              in a very intuitive and rigorous way.”
            </p>

            <h3 className="text-xl font-bold">
              Rohit Verma
            </h3>

            <p className="text-gray-500">
              University Student
            </p>

          </div>

        </div>

      </section>
        <p className="text-blue-600 font-semibold mb-4">
          IIT Delhi Mathematics Coaching
        </p>

        <h1 className="text-6xl font-bold max-w-4xl leading-tight mb-6">
          Learn Advanced Mathematics
          From IIT Delhi
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Real Analysis, Fourier Analysis, Topology,
          Stochastic Processes, IIT JAM preparation,
          MSc Mathematics coaching and more.
        </p>

        <div className="flex gap-4">

          <button className="bg-blue-600 hover:scale-105 transition text-white px-8 py-4 rounded-2xl text-lg shadow-xl">
            Join Batch
          </button>

          <button className="border border-gray-400 hover:bg-gray-100 transition px-8 py-4 rounded-2xl text-lg">
            Watch Demo
          </button>

        </div>

      </section>
      {/* Contact Section */}
      <section className="py-24 px-10 bg-blue-600 text-white text-center">

        <h2 className="text-5xl font-bold mb-6">
          Start Learning Today
        </h2>

        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join IIT Delhi Mathematics Coaching
          and improve your conceptual understanding
          with rigorous problem solving.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">

          <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition">
            Join WhatsApp Group
          </button>

          <button className="border border-white px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-blue-600 transition">
            Contact Now
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-10">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h2 className="text-3xl font-bold mb-2">
              Rakesh Maths
            </h2>

            <p className="text-gray-400">
              IIT Delhi Mathematics Coaching
            </p>
          </div>

          <div className="flex gap-6 text-lg">
            <a href="#">Home</a>
            <a href="#">Courses</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>

        </div>

      </footer>
    </main>
  )
}