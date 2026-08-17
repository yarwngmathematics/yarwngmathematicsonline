"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // New accounts are students by default.
        // To make yourself admin: after signing up once, go to Firebase Console →
        // Firestore → users/<your-uid> → change "role" field from "student" to "admin".
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          role: "student",
          name,
          email,
          paymentStatus: "due",
          createdAt: serverTimestamp(),
        });
        router.push("/student");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const snap = await getDoc(doc(db, "users", cred.user.uid));
        const role = snap.exists() ? snap.data().role : "student";
        router.push(role === "admin" ? "/admin" : "/student");
      }
    } catch (err: any) {
      setError(readableError(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 68px)", background: "linear-gradient(135deg,#060f2e 0%,#0d1b4b 45%,#0f2d6b 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 24, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)", padding: "26px 28px", color: "#fff" }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{mode === "login" ? "🔐" : "📝"}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{mode === "login" ? "Welcome back" : "Create your account"}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 3 }}>
              {mode === "login" ? "Log in to your student or admin portal" : "Sign up as a student"}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="ymp-input" style={inputStyle} placeholder="Student's full name" />
              </div>
            )}
            <div>
              <label style={labelStyle}>Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="At least 6 characters" />
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 11, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={submitting} style={{ background: "#2563eb", color: "#fff", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: 4 }}>
              {submitting ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "center", marginTop: 4 }}
            >
              {mode === "login" ? "New student? Create an account" : "Already have an account? Log in"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function readableError(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email. Try logging in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #e5e7eb", padding: "11px 14px", borderRadius: 11, fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none" };