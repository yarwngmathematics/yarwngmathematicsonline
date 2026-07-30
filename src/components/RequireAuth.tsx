"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth, Role } from "@/lib/authContext";

export default function RequireAuth({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, profile, loading, profileError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (profile && profile.role !== role) {
      router.replace(profile.role === "admin" ? "/admin" : "/student");
    }
  }, [loading, user, profile, role, router]);

  // Still genuinely loading (auth state not resolved yet)
  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", color: "#6b7280" }}>
        Loading…
      </div>
    );
  }

  if (!user) return null; // redirecting to /login

  // Logged in, but no Firestore profile document exists for this account —
  // this is NOT the same as "loading". Show a clear, actionable message
  // instead of spinning forever.
  if (!profile) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "'Outfit', sans-serif", padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p style={{ fontWeight: 700, color: "#111827", fontSize: 16 }}>No profile found for this account</p>
        <p style={{ color: "#6b7280", fontSize: 13, maxWidth: 380 }}>
          {profileError
            ? `Error loading your profile: ${profileError}`
            : "Your account exists but has no student/admin record yet. Contact the site admin, or if this is a new account, try signing up again from the login page."}
        </p>
        <button
          onClick={() => signOut(auth).then(() => router.push("/login"))}
          style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          Log Out
        </button>
      </div>
    );
  }

  if (profile.role !== role) return null; // redirecting to the correct dashboard

  return <>{children}</>;
}