import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Yarwng Mathematics",
  description: "Terms and Conditions for Yarwng Mathematics coaching services.",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", fontFamily: "sans-serif", lineHeight: 1.8, color: "#1f2937" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#060f2e" }}>Terms & Conditions</h1>
      <p style={{ color: "#6b7280", marginBottom: 40 }}>Last updated: May 2026 · Yarwng Mathematics</p>

      {[
        { title: "1. Acceptance of Terms", body: "By accessing or using the website yarwngmathematics.com, you agree to be bound by these Terms and Conditions." },
        { title: "2. User Conduct", body: "You agree not to engage in any activity that disrupts or interferes with the functioning of the website or its services." },
        { title: "3. Intellectual Property", body: "All content and materials available on the website are protected by intellectual property laws." },
        { title: "4. Limitation of Liability", body: "Yarwng Mathematics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the website." },
        { title: "5. Indemnification", body: "You agree to indemnify and hold Yarwng Mathematics harmless from any claims arising out of your use of the website or violation of these terms." },
        { title: "6. Governing Law", body: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India." },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>{s.title}</h2>
          <p style={{ color: "#374151" }}>{s.body}</p>
        </div>
      ))}

      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "20px 24px", marginTop: 40 }}>
        <p style={{ fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>Contact</p>
        <p style={{ color: "#374151" }}>Rakesh Debbarma · Bashi Kobra Para, West Tripura 799045</p>
        <p style={{ color: "#374151" }}>📱 9366030347 · ✉️ yarwngmathematics@gmail.com</p>
      </div>
    </main>
  );
}