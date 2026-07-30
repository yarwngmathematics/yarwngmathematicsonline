"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/authContext";

export default function AdminPortal() {
  return (
    <RequireAuth role="admin">
      <AdminDashboard />
    </RequireAuth>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"students" | "doubts" | "classroom" | "notes">("students");
  const [students, setStudents] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Live-updates as students register — no refresh needed.
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => d.data() as UserProfile));
    });
    return () => unsub();
  }, []);

  const classCounts = students.reduce<Record<string, number>>((acc, s) => {
    const c = s.studentClass || "Unassigned";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9fafb", minHeight: "calc(100vh - 68px)", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%)", padding: "36px 20px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Admin Portal</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 28, fontWeight: 700, marginTop: 4 }}>Yarwng Mathematics — Control Panel</h1>
            </div>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            <Stat label="Total Students" value={students.length} />
            <Stat label="Class 10" value={classCounts["Class 10"] || 0} />
            <Stat label="Class 11" value={classCounts["Class 11"] || 0} />
            <Stat label="Class 12" value={classCounts["Class 12"] || 0} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              ["students", "Students"],
              ["doubts", "Doubt Requests"],
              ["classroom", "Live Classroom"],
              ["notes", "Upload Notes"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as any)} style={{ padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, border: "1px solid #e5e7eb", cursor: "pointer", background: tab === key ? "#2563eb" : "#fff", color: tab === key ? "#fff" : "#374151" }}>
                {label}
              </button>
            ))}
          </div>

          {tab === "students" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                    {["Name", "Class", "Board", "Payment", "WhatsApp"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", color: "#6b7280", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>No students registered yet.</td></tr>
                  ) : students.map((s) => (
                    <tr key={s.uid} style={{ borderTop: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: "12px 16px" }}>{s.studentClass || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>{s.board || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: s.paymentStatus === "active" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                          {s.paymentStatus || "due"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>{s.whatsapp || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "doubts" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 13, color: "#6b7280" }}>
                {/* TODO: query `doubts` collection where status == "pending", show image + student name,
                    let admin reply (text or image) and mark resolved */}
                Doubt photos submitted by students will appear here for you to review and reply to.
              </p>
            </div>
          )}

          {tab === "classroom" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                {/* TODO phase 2: "Create Class" button calls a server route that uses the Google Calendar API
                    (with your Google account connected via OAuth) to generate a Meet link, saves it to
                    a `liveClasses` collection with { studentClass, startTime, meetLink }, and only students
                    in that class with paymentStatus === "active" see the "Join Class" button on their dashboard. */}
                Generate a Google Meet link for your next 2-hour class. Only students with active payment status
                in the selected class will see the join button on their dashboard.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <SelectStub label="Class" options={["Class 10", "Class 11", "Class 12"]} />
                <SelectStub label="Duration" options={["1 hour", "2 hours"]} />
                <button style={{ background: "#2563eb", color: "#fff", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "not-allowed", opacity: 0.6 }} disabled>
                  Generate Meet Link (connect Google account first)
                </button>
              </div>
            </div>
          )}

          {tab === "notes" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                {/* TODO: upload file to Firebase Storage under notes/{class}/{filename}, save metadata doc
                    { studentClass, title, fileUrl, uploadedAt } in `notes` collection */}
                Upload notes for a class. Only students with active payment in that class will be able to download them.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <SelectStub label="Class" options={["Class 10", "Class 11", "Class 12"]} />
                <input type="file" style={{ fontSize: 13 }} />
                <button style={{ background: "#2563eb", color: "#fff", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px" }}>
      <p style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{value}</p>
      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</p>
    </div>
  );
}
function SelectStub({ label, options }: { label: string; options: string[] }) {
  return (
    <label style={{ fontSize: 12, color: "#6b7280" }}>
      {label}
      <select style={{ display: "block", border: "1.5px solid #e5e7eb", padding: "9px 12px", borderRadius: 9, marginTop: 4, fontSize: 13 }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}