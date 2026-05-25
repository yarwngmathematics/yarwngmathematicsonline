import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Yarwng Mathematics",
  description: "Privacy Policy for Yarwng Mathematics coaching services.",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#1f2937" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#060f2e" }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", marginBottom: 40 }}>Last updated: May 2026 · Yarwng Mathematics</p>

      {[
        { title: "1. Information We Collect", body: "We collect personal information such as your name, WhatsApp number, and payment details when you enroll or register on our platform." },
        { title: "2. How We Use Your Information", body: "We use your information to process enrollments, communicate with you about classes, and improve our services." },
        { title: "3. Cookies", body: "We use cookies to personalize content, analyse our traffic, and improve your browsing experience." },
        { title: "4. Data Security", body: "We take precautions to protect your information both online and offline. Payment processing is handled securely by Cashfree Payments." },
        { title: "5. Changes to This Privacy Policy", body: "We reserve the right to update or change our Privacy Policy at any time. Changes will be posted on this page." },
        { title: "6. Ownership", body: "This website is owned and operated by Rakesh Debbarma, M.Sc Mathematics, IIT Delhi." },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>{s.title}</h2>
          <p style={{ color: "#374151" }}>{s.body}</p>
        </div>
      ))}

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "20px 24px", marginTop: 40 }}>
        <p style={{ fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>Contact Information</p>
        <p style={{ color: "#374151" }}>Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
        <p style={{ color: "#374151" }}>📱 9366030347 · ✉️ yarwngmathematics@gmail.com</p>
      </div>
    </main>
  );
}