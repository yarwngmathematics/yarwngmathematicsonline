"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

// A stored "active" status can go stale if no one's checked in since the due
// date passed. This computes the real-time status for display/gating so
// notes/live-class access lock immediately, even before a daily cron job
// (see README, "Next phases") catches up and flips the stored field too.
function effectiveStatus(profile: { paymentStatus?: string; paymentDueDate?: string } | null): "active" | "due" | "expired" {
  if (!profile?.paymentStatus) return "due";
  if (profile.paymentStatus === "active" && profile.paymentDueDate) {
    const due = new Date(profile.paymentDueDate);
    const graceEnd = new Date(due);
    graceEnd.setDate(graceEnd.getDate() + 3); // 3-day grace period after due date
    if (new Date() > graceEnd) return "expired";
  }
  return (profile.paymentStatus as "active" | "due" | "expired") || "due";
}

export default function StudentPortal() {
  return (
    <RequireAuth role="student">
      <StudentDashboard />
    </RequireAuth>
  );
}

function StudentDashboard() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "profile" | "doubts" | "notes">("overview");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    studentClass: profile?.studentClass ?? "",
    board: profile?.board ?? "",
    medium: profile?.medium ?? "English",
    schoolName: profile?.schoolName ?? "",
    address: profile?.address ?? "",
    whatsapp: profile?.whatsapp ?? "",
  });

  const [payLoading, setPayLoading] = useState<"monthly" | "annual" | null>(null);
  const [payError, setPayError] = useState("");

  const saveProfile = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), form);
    setEditing(false);
  };

  const handlePay = async (plan: "monthly" | "annual") => {
    if (!user || !profile?.studentClass) {
      setPayError("Set your class in My Profile before paying.");
      return;
    }
    setPayError("");
    setPayLoading(plan);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/portal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ plan, studentClass: profile.studentClass }),
      });
      const data = await res.json();
      if (!data.success || !data.redirectUrl) {
        setPayError(data.error?.message || "Could not start payment. Please try again.");
        setPayLoading(null);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setPayError("Network error. Please try again.");
      setPayLoading(null);
    }
  };

  const status = effectiveStatus(profile);
  const statusColor = status === "active" ? "#16a34a" : status === "due" ? "#f59e0b" : "#dc2626";
  const statusLabel = status === "active" ? "Active" : status === "due" ? "Payment Due" : "Expired — renew to continue";

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9fafb", minHeight: "calc(100vh - 68px)", fontFamily: "'Outfit', sans-serif" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%)", padding: "36px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student Portal</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 28, fontWeight: 700, marginTop: 4 }}>Welcome, {profile?.name || "Student"}</h1>
            </div>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              ["overview", "Overview"],
              ["profile", "My Profile"],
              ["doubts", "Doubts"],
              ["notes", "Notes"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as any)} style={{ padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, border: "1px solid #e5e7eb", cursor: "pointer", background: tab === key ? "#2563eb" : "#fff", color: tab === key ? "#fff" : "#374151" }}>
                {label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Payment status card */}
              <Card title="Payment Status">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor }} />
                  <span style={{ fontWeight: 700, color: statusColor }}>{statusLabel}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Class: <strong>{profile?.studentClass || "Not set"}</strong></p>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Plan: <strong>{profile?.paymentPlan === "annual" ? "Annual" : "Monthly"}</strong>{profile?.paymentDueDate ? ` · Next due ${profile.paymentDueDate}` : ""}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handlePay("monthly")} disabled={!!payLoading} style={{ ...payBtn("#2563eb"), opacity: payLoading ? 0.6 : 1, cursor: payLoading ? "not-allowed" : "pointer" }}>
                    {payLoading === "monthly" ? "Redirecting…" : "Pay Monthly →"}
                  </button>
                  <button onClick={() => handlePay("annual")} disabled={!!payLoading} style={{ ...payBtn("#5b21b6"), opacity: payLoading ? 0.6 : 1, cursor: payLoading ? "not-allowed" : "pointer" }}>
                    {payLoading === "annual" ? "Redirecting…" : "Pay Annually →"}
                  </button>
                </div>
                {payError && (
                  <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", color: "#dc2626", fontSize: 12, marginTop: 10 }}>
                    ⚠️ {payError}
                  </div>
                )}
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 10 }}>🔒 Powered by PhonePe.</p>
              </Card>

              {/* Faculty card */}
              <Card title="Your Faculty">
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <img src="/profile.jpg" alt="Rakesh Debbarma" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover" }} />
                  <div>
                    <p style={{ fontWeight: 700, color: "#111827" }}>Rakesh Debbarma</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>B.Sc, M.Sc Mathematics</p>
                    <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>IIT Delhi</p>
                  </div>
                </div>
              </Card>

              {/* Class syllabus / advertisement */}
              <Card title={`${profile?.studentClass || "Your Class"} — What's Being Taught`} full>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
                  {/* TODO: pull this from a `classes` Firestore collection so admin can edit syllabus per class */}
                  Algebra, Geometry, Trigonometry, Statistics and more — with regular tests and doubt-clearing sessions.
                </p>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#1e40af" }}>
                  📅 Next live class link will appear here once admin schedules it.
                </div>
              </Card>
            </div>
          )}

          {tab === "profile" && (
            <Card title="My Profile">
              {!editing ? (
                <>
                  <ProfileRow label="Name" value={profile?.name} />
                  <ProfileRow label="Email" value={profile?.email} />
                  <ProfileRow label="WhatsApp" value={profile?.whatsapp} />
                  <ProfileRow label="Class" value={profile?.studentClass} />
                  <ProfileRow label="Board" value={profile?.board} />
                  <ProfileRow label="Medium" value={profile?.medium} />
                  <ProfileRow label="School" value={profile?.schoolName} />
                  <ProfileRow label="Address" value={profile?.address} />
                  <button onClick={() => setEditing(true)} style={payBtn("#2563eb")}>Edit Profile</button>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
                  <SelectField label="Class" value={form.studentClass} onChange={(v) => setForm({ ...form, studentClass: v })} options={["Class 10", "Class 11", "Class 12"]} />
                  <SelectField label="Board" value={form.board} onChange={(v) => setForm({ ...form, board: v })} options={["CBSE", "TBSE", "ICSE"]} />
                  <SelectField label="Medium" value={form.medium} onChange={(v) => setForm({ ...form, medium: v })} options={["English", "Bengali", "Kokborok"]} />
                  <TextField label="School" value={form.schoolName} onChange={(v) => setForm({ ...form, schoolName: v })} />
                  <TextField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                  <TextField label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button onClick={saveProfile} style={payBtn("#2563eb")}>Save Changes</button>
                    <button onClick={() => setEditing(false)} style={payBtn("#6b7280")}>Cancel</button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {tab === "doubts" && (
            <Card title="Ask a Doubt">
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                Upload a photo of the question you're stuck on. Faculty will reply here once answered.
                {/* TODO: form → uploads image to Firebase Storage under doubts/{uid}/{timestamp}.jpg,
                    creates a doc in `doubts` collection { uid, studentName, imageUrl, status: "pending", createdAt } */}
              </p>
              <input type="file" accept="image/*" style={{ marginBottom: 12 }} />
              <br />
              <button style={payBtn("#2563eb")}>Submit Doubt</button>
              <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>Your submitted doubts will appear here with faculty replies.</p>
              </div>
            </Card>
          )}

          {tab === "notes" && (
            <Card title="Class Notes">
              {status === "active" ? (
                <p style={{ fontSize: 13, color: "#6b7280" }}>
                  {/* TODO: list files from `notes` collection filtered by studentClass, with download links from Firebase Storage */}
                  Notes uploaded by your faculty for {profile?.studentClass} will appear here.
                </p>
              ) : (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 11, padding: "14px 16px", color: "#dc2626", fontSize: 13 }}>
                  🔒 Notes are locked. Clear your pending payment to unlock access.
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

function Card({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22, gridColumn: full ? "1 / -1" : undefined }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>{title}</p>
      {children}
    </div>
  );
}
function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
      <span style={{ color: "#9ca3af" }}>{label}</span>
      <span style={{ color: "#111827", fontWeight: 600 }}>{value || "—"}</span>
    </div>
  );
}
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ fontSize: 12, color: "#6b7280" }}>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", border: "1.5px solid #e5e7eb", padding: "9px 12px", borderRadius: 9, marginTop: 4, fontSize: 13 }} />
    </label>
  );
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label style={{ fontSize: 12, color: "#6b7280" }}>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", border: "1.5px solid #e5e7eb", padding: "9px 12px", borderRadius: 9, marginTop: 4, fontSize: 13 }}>
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function payBtn(bg: string): React.CSSProperties {
  return { background: bg, color: "#fff", padding: "10px 18px", borderRadius: 9, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" };
}