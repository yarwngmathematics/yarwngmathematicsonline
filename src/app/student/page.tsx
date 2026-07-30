"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/authContext";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   SYLLABUS / CLASS DATA
   Kept in sync with app/classes/page.tsx so the portal always
   shows the same days, timings, pricing and topic list that the
   public site advertises. If you update one, update the other
   (or better: move this object into a shared /lib/classes.ts and
   import it from both files).
   ───────────────────────────────────────────────────────────── */
const CLASS_DATA = {
  "Class 10": {
    days: "Monday & Wednesday",
    time: "5:00 PM – 7:00 PM",
    icon: "📘",
    color: "#1e40af",
    colorTo: "#3163dd",
    original: 700,
    offer: 600,
    topics: [
      "Real Numbers & Polynomials",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles & Coordinate Geometry",
      "Trigonometry",
      "Circles & Constructions",
      "Areas & Surface Volumes",
      "Statistics & Probability",
      "Regular tests and doubt sessions included.",
    ],
  },
  "Class 11": {
    days: "Tuesday & Friday",
    time: "5:00 PM – 7:00 PM",
    icon: "📙",
    color: "#c2740b",
    colorTo: "#ea9a3d",
    original: 900,
    offer: 800,
    topics: [
      "Sets, Relations & Functions",
      "Trigonometric Functions",
      "Principle of Mathematical Induction",
      "Complex Numbers",
      "Linear Inequalities & Permutations",
      "Binomial Theorem & Sequences",
      "Straight Lines & Conic Sections",
      "3D Geometry Intro",
      "Calculus Basics — Limits & Derivatives",
      "Statistics & Probability",
      "Strong foundation for Class 12 and competitive exams.",
    ],
  },
  "Class 12": {
    days: "Thursday & Saturday",
    time: "5:00 PM – 7:00 PM",
    icon: "📗",
    color: "#0d7a56",
    colorTo: "#17a97a",
    original: 1000,
    offer: 900,
    topics: [
      "Relations & Functions",
      "Inverse Trigonometric Functions",
      "Matrices & Determinants",
      "Continuity & Differentiability",
      "Applications of Derivatives",
      "Integrals & Applications",
      "Differential Equations",
      "Vectors & 3D Geometry",
      "Linear Programming",
      "Probability",
      "Board exam focused — previous year paper practice included.",
    ],
  },
} as const;

type ClassName = keyof typeof CLASS_DATA;

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
  const [tab, setTab] = useState<"overview" | "payment" | "profile" | "doubts" | "notes">("overview");
  const [editing, setEditing] = useState(false);

  // The `profile` object from useAuth() is only as fresh as its last fetch/
  // listener tick. To avoid the "saved but UI still shows old data until
  // refresh" issue, we mirror it locally and merge in writes immediately
  // after they succeed. useEffect keeps this in sync if the context profile
  // does eventually update (e.g. via a live Firestore listener elsewhere).
  const [localProfile, setLocalProfile] = useState(profile);
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const buildForm = (p: typeof profile) => ({
    studentClass: p?.studentClass ?? "",
    board: p?.board ?? "",
    medium: p?.medium ?? "English",
    schoolName: p?.schoolName ?? "",
    address: p?.address ?? "",
    whatsapp: p?.whatsapp ?? "",
    phoneNumber: p?.phoneNumber ?? "",
    parentName: p?.parentName ?? "",
    parentOccupation: p?.parentOccupation ?? "",
  });

  const [form, setForm] = useState(buildForm(profile));

  const [payLoading, setPayLoading] = useState<"monthly" | "annual" | null>(null);
  const [payError, setPayError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const startEditing = () => {
    setForm(buildForm(localProfile));
    setSaveError("");
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    try {
      await updateDoc(doc(db, "users", user.uid), form);
      // Optimistic local update — this is what fixes the "need to refresh" issue.
      setLocalProfile((prev: any) => ({ ...(prev ?? {}), ...form }));
      setEditing(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      setSaveError("Could not save your changes. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePay = async (plan: "monthly" | "annual") => {
    if (!user || !localProfile?.studentClass) {
      setPayError("Set your class in My Profile before paying.");
      setTab("profile");
      return;
    }
    setPayError("");
    setPayLoading(plan);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/portal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ plan, studentClass: localProfile.studentClass }),
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

  const status = effectiveStatus(localProfile);
  const statusColor = status === "active" ? "#16a34a" : status === "due" ? "#f59e0b" : "#dc2626";
  const statusLabel = status === "active" ? "Active" : status === "due" ? "Payment Due" : "Expired — renew to continue";

  const studentClass = (localProfile?.studentClass as ClassName | undefined) && CLASS_DATA[localProfile!.studentClass as ClassName]
    ? (localProfile!.studentClass as ClassName)
    : undefined;
  const cls = studentClass ? CLASS_DATA[studentClass] : undefined;

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9fafb", minHeight: "calc(100vh - 68px)", fontFamily: "'Outfit', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
          .sp-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
          .sp-ad { border-radius: 20px; padding: 28px 30px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.14); }
          .sp-ad-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 8px; }
          .sp-ad-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; line-height: 1.15; margin-bottom: 6px; }
          .sp-ad-sub { font-size: 13px; color: rgba(255,255,255,0.85); }
          .sp-ad-price { font-size: 30px; font-weight: 800; }
          .sp-ad-original { font-size: 13px; text-decoration: line-through; color: rgba(255,255,255,0.65); margin-left: 6px; }
          .sp-ad-btn { background: #fff; border: none; padding: 12px 24px; border-radius: 11px; font-weight: 800; font-size: 14px; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
          .sp-ad-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.18); }
          .sp-topic { display: flex; align-items: flex-start; gap: 8px; font-size: 13.5px; color: #374151; line-height: 1.6; padding: 9px 0; border-bottom: 1px solid #f3f4f6; }
          .sp-topic:last-child { border-bottom: none; }
          .sp-topic-num { color: #fff; background: var(--cls-color, #2563eb); font-size: 11px; font-weight: 700; width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
          .sp-tabs-wrap { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
          .sp-tab-btn { padding: 9px 18px; border-radius: 10px; font-weight: 600; font-size: 13px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.15s; }
        `}</style>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%)", padding: "36px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student Portal</p>
              <h1 className="sp-serif" style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginTop: 4 }}>Welcome, {localProfile?.name || "Student"}</h1>
            </div>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 60px" }}>
          {/* Tabs */}
          <div className="sp-tabs-wrap">
            {[
              ["overview", "Overview"],
              ["payment", "Payment"],
              ["profile", "My Profile"],
              ["doubts", "Doubts"],
              ["notes", "Notes"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                className="sp-tab-btn"
                style={{
                  background: tab === key ? "#2563eb" : "#fff",
                  color: tab === key ? "#fff" : "#374151",
                  borderColor: tab === key ? "#2563eb" : "#e5e7eb",
                }}
              >
                {label}
                {key === "payment" && status !== "active" && (
                  <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: "50%", background: tab === key ? "#fcd34d" : "#f59e0b", display: "inline-block" }} />
                )}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW: advertisement → full syllabus → faculty ── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* 1. Personalized class advertisement */}
              {cls ? (
                <div
                  className="sp-ad"
                  style={{ background: `linear-gradient(135deg, ${cls.colorTo} 0%, ${cls.color} 100%)` }}
                >
                  <div>
                    <p className="sp-ad-eyebrow">{cls.icon} {studentClass} · {cls.days}</p>
                    <p className="sp-ad-title">Your batch meets {cls.time}</p>
                    <p className="sp-ad-sub">Live on Google Meet · Regular tests · WhatsApp doubt support</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p>
                      <span className="sp-ad-price">₹{cls.offer}</span>
                      <span className="sp-ad-original">₹{cls.original}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}> /mo</span>
                    </p>
                    <button onClick={() => setTab("payment")} className="sp-ad-btn" style={{ color: cls.color, marginTop: 10 }}>
                      {status === "active" ? "Manage Payment →" : "Pay & Continue →"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sp-ad" style={{ background: "linear-gradient(135deg,#334155,#0f172a)" }}>
                  <div>
                    <p className="sp-ad-eyebrow">Set up your batch</p>
                    <p className="sp-ad-title">Add your class to see your schedule &amp; fee</p>
                    <p className="sp-ad-sub">This is usually filled in automatically from your enrollment form.</p>
                  </div>
                  <button onClick={() => setTab("profile")} className="sp-ad-btn" style={{ color: "#0f172a" }}>
                    Complete Profile →
                  </button>
                </div>
              )}

              {/* 2. Full detailed syllabus for their class */}
              <Card title={cls ? `${studentClass} — Full Syllabus` : "Syllabus"} full>
                {cls ? (
                  <>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                      <SyllabusMeta icon="📅" label="Days" value={cls.days} color={cls.color} />
                      <SyllabusMeta icon="🕐" label="Time" value={cls.time} color={cls.color} />
                      <SyllabusMeta icon="🖥️" label="Mode" value="Google Meet (Live)" color={cls.color} />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                      Topics Covered
                    </p>
                    <div style={{ ["--cls-color" as any]: cls.color }}>
                      {cls.topics.map((t, i) => (
                        <div key={i} className="sp-topic">
                          <span className="sp-topic-num">{i + 1}</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "#6b7280" }}>
                    Once your class is set in <strong>My Profile</strong>, your full syllabus — topics, schedule, and timing — will appear here.
                  </p>
                )}
              </Card>

              {/* 3. Faculty profile */}
              <Card title="Your Faculty" full>
                <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                  <img src="/profile.jpg" alt="Rakesh Debbarma" style={{ width: 72, height: 72, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 700, color: "#111827", fontSize: 16 }}>Rakesh Debbarma</p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>B.Sc, M.Sc Mathematics</p>
                    <p style={{ fontSize: 13, color: "#2563eb", fontWeight: 700 }}>IIT Delhi</p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href="tel:9366030347" style={{ ...facultyPill }}>📱 9366030347</a>
                    <a href="mailto:yarwngmathematics@gmail.com" style={{ ...facultyPill }}>✉️ Email</a>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── PAYMENT: its own dedicated section ── */}
          {tab === "payment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card title="Payment Status" full>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor }} />
                  <span style={{ fontWeight: 700, color: statusColor, fontSize: 15 }}>{statusLabel}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
                  <PaymentMeta label="Class" value={localProfile?.studentClass || "Not set"} />
                  <PaymentMeta label="Plan" value={localProfile?.paymentPlan === "annual" ? "Annual" : "Monthly"} />
                  <PaymentMeta label="Next Due" value={localProfile?.paymentDueDate || "—"} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => handlePay("monthly")} disabled={!!payLoading} style={{ ...payBtn("#2563eb"), opacity: payLoading ? 0.6 : 1, cursor: payLoading ? "not-allowed" : "pointer" }}>
                    {payLoading === "monthly" ? "Redirecting…" : `Pay Monthly${cls ? ` · ₹${cls.offer}` : ""} →`}
                  </button>
                  <button onClick={() => handlePay("annual")} disabled={!!payLoading} style={{ ...payBtn("#5b21b6"), opacity: payLoading ? 0.6 : 1, cursor: payLoading ? "not-allowed" : "pointer" }}>
                    {payLoading === "annual" ? "Redirecting…" : "Pay Annually →"}
                  </button>
                </div>
                {payError && (
                  <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", color: "#dc2626", fontSize: 12, marginTop: 12 }}>
                    ⚠️ {payError}
                  </div>
                )}
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 14 }}>🔒 Powered by PhonePe Payment Gateway · SSL Secured</p>
              </Card>

              <Card title="What's Included" full>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Live Google Meet Sessions", "WhatsApp Doubt Support", "Regular Tests & Quizzes", "Detailed Feedback", "Study Material", "Previous Year Papers"].map((i) => (
                    <span key={i} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 9 }}>✅ {i}</span>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "profile" && (
            <Card title="My Profile" full>
              {savedNotice && (
                <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 14px", color: "#15803d", fontSize: 12.5, fontWeight: 600, marginBottom: 14 }}>
                  ✅ Profile saved.
                </div>
              )}
              {!editing ? (
                <>
                  <ProfileRow label="Name" value={localProfile?.name} />
                  <ProfileRow label="Email" value={localProfile?.email} />
                  <ProfileRow label="Phone Number" value={localProfile?.phoneNumber} />
                  <ProfileRow label="WhatsApp" value={localProfile?.whatsapp} />
                  <ProfileRow label="Class" value={localProfile?.studentClass} />
                  <ProfileRow label="Board" value={localProfile?.board} />
                  <ProfileRow label="Medium" value={localProfile?.medium} />
                  <ProfileRow label="School" value={localProfile?.schoolName} />
                  <ProfileRow label="Address" value={localProfile?.address} />
                  <ProfileRow label="Father/Mother Name" value={localProfile?.parentName} />
                  <ProfileRow label="Father/Mother Occupation" value={localProfile?.parentOccupation} />
                  <button onClick={startEditing} style={{ ...payBtn("#2563eb"), marginTop: 6 }}>Edit Profile</button>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12 }}>
                    ℹ️ This is filled automatically from the enrollment form you submitted on the homepage. Edit anytime if something changes.
                  </p>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
                  <SelectField label="Class" value={form.studentClass} onChange={(v) => setForm({ ...form, studentClass: v })} options={["Class 10", "Class 11", "Class 12"]} />
                  <SelectField label="Board" value={form.board} onChange={(v) => setForm({ ...form, board: v })} options={["CBSE", "TBSE", "ICSE"]} />
                  <SelectField label="Medium" value={form.medium} onChange={(v) => setForm({ ...form, medium: v })} options={["English", "Bengali", "Kokborok"]} />
                  <TextField label="School" value={form.schoolName} onChange={(v) => setForm({ ...form, schoolName: v })} />
                  <TextField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                  <TextField label="Phone Number" value={form.phoneNumber} onChange={(v) => setForm({ ...form, phoneNumber: v })} />
                  <TextField label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
                  <TextField label="Father/Mother Name" value={form.parentName} onChange={(v) => setForm({ ...form, parentName: v })} />
                  <TextField label="Father/Mother Occupation" value={form.parentOccupation} onChange={(v) => setForm({ ...form, parentOccupation: v })} />
                  {saveError && (
                    <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", color: "#dc2626", fontSize: 12 }}>
                      ⚠️ {saveError}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button onClick={saveProfile} disabled={saving} style={{ ...payBtn("#2563eb"), opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button onClick={() => { setEditing(false); setSaveError(""); }} disabled={saving} style={payBtn("#6b7280")}>Cancel</button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {tab === "doubts" && (
            <Card title="Ask a Doubt" full>
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
            <Card title="Class Notes" full>
              {status === "active" ? (
                <p style={{ fontSize: 13, color: "#6b7280" }}>
                  {/* TODO: list files from `notes` collection filtered by studentClass, with download links from Firebase Storage */}
                  Notes uploaded by your faculty for {localProfile?.studentClass} will appear here.
                </p>
              ) : (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 11, padding: "14px 16px", color: "#dc2626", fontSize: 13 }}>
                  🔒 Notes are locked.{" "}
                  <button onClick={() => setTab("payment")} style={{ background: "none", border: "none", color: "#dc2626", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>
                    Clear your pending payment
                  </button>{" "}
                  to unlock access.
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
function SyllabusMeta({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${color}12`, border: `1px solid ${color}33`, borderRadius: 10, padding: "8px 14px" }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{value}</p>
      </div>
    </div>
  );
}
function PaymentMeta({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 11, padding: "10px 14px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 2 }}>{value}</p>
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
const facultyPill: React.CSSProperties = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: 12,
  fontWeight: 600,
  padding: "8px 14px",
  borderRadius: 9,
  textDecoration: "none",
};