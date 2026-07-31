"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/authContext";

interface Faculty {
  id: string;
  name: string;
  position: "Owner" | "Faculty";
  degree: string;
  subject: string;
  photoUrl: string;
  bio: string;
}

interface SiteContent {
  heroHeadline: string;
  heroAccent: string;
  heroTagline: string;
  heroDescription: string;
  class10Original: string; class10Offer: string;
  class11Original: string; class11Offer: string;
  class12Original: string; class12Offer: string;
  waClass10: string; waClass11: string; waClass12: string;
  contactPhone: string; contactEmail: string; contactAddress: string;
}

const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: "Master Mathematics", heroAccent: "With Confidence",
  heroTagline: "Amani Kok Kokborok bai Swrwngwi Mannai",
  heroDescription: "Expert coaching for Class 10, 11 & 12 by an IIT Delhi graduate — Online via Google Meet & Offline at Khumulwng.",
  class10Original: "700", class10Offer: "600",
  class11Original: "900", class11Offer: "800",
  class12Original: "1000", class12Offer: "900",
  waClass10: "", waClass11: "", waClass12: "",
  contactPhone: "9366030347", contactEmail: "yarwngmathematics@gmail.com", contactAddress: "Khumulwng, Tripura",
};

export default function AdminPortal() {
  return (
    <RequireAuth role="admin">
      <AdminDashboard />
    </RequireAuth>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"students" | "doubts" | "classroom" | "notes" | "owner">("students");
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmUid, setConfirmUid] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snap) => setStudents(snap.docs.map((d) => d.data() as UserProfile)));
    return () => unsub();
  }, []);

  const classCounts = students.reduce<Record<string, number>>((acc, s) => {
    const c = s.studentClass || "Unassigned";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const handleRemove = async (studentUid: string) => {
    setActionError("");
    setRemoving(studentUid);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/portal/delete-student", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ studentUid }),
      });
      const data = await res.json();
      if (!data.success) setActionError(data.error || "Could not remove student.");
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setRemoving(null);
      setConfirmUid(null);
    }
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("Yarwng Mathematics — Student List", 14, 18);
      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(`Generated: ${new Date().toLocaleString("en-IN")} · Total: ${students.length}`, 14, 24);
      autoTable(pdf, {
        startY: 30,
        head: [["Name", "Class", "Board", "Medium", "Mode", "Payment", "Plan", "Due Date", "WhatsApp", "Email", "School", "Address"]],
        body: students.map((s) => [
          s.name || "", s.studentClass || "", s.board || "", s.medium || "", s.mode || "",
          s.paymentStatus || "due", s.paymentPlan || "", s.paymentDueDate || "",
          s.whatsapp || "", s.email || "", s.schoolName || "", s.address || "",
        ]),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], fontSize: 7.5 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      pdf.save(`yarwng-students-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      setActionError("Could not generate PDF. Make sure jspdf and jspdf-autotable are installed.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9fafb", minHeight: "calc(100vh - 68px)", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg,#060f2e 0%,#0d1b4b 60%,#0f2d6b 100%)", padding: "36px 20px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ color: "#fcd34d", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Owner Portal</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 28, fontWeight: 700, marginTop: 4 }}>Yarwng Mathematics — Control Panel</h1>
            </div>
            <button onClick={() => signOut(auth).then(() => router.push("/"))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
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
              ["owner", "⚙️ Owner"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as any)} style={{ padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, border: "1px solid #e5e7eb", cursor: "pointer", background: tab === key ? "#2563eb" : "#fff", color: tab === key ? "#fff" : "#374151" }}>
                {label}
              </button>
            ))}
          </div>

          {actionError && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 11, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
              ⚠️ {actionError}
            </div>
          )}

          {tab === "students" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button onClick={handleDownloadPdf} disabled={pdfLoading || students.length === 0} style={{ background: "#5b21b6", color: "#fff", padding: "9px 18px", borderRadius: 9, fontWeight: 700, fontSize: 13, border: "none", cursor: pdfLoading ? "not-allowed" : "pointer", opacity: pdfLoading || students.length === 0 ? 0.6 : 1 }}>
                  {pdfLoading ? "Generating…" : "📄 Download PDF"}
                </button>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                      {["Name", "Class", "Board", "Payment", "WhatsApp", ""].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", color: "#6b7280", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>No students registered yet.</td></tr>
                    ) : students.map((s) => (
                      <>
                        <tr key={s.uid} style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer" }} onClick={() => setExpandedUid(expandedUid === s.uid ? null : s.uid)}>
                          <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                            <span style={{ marginRight: 6, color: "#9ca3af", display: "inline-block", transform: expandedUid === s.uid ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
                            {s.name}
                          </td>
                          <td style={{ padding: "12px 16px" }}>{s.studentClass || "—"}</td>
                          <td style={{ padding: "12px 16px" }}>{s.board || "—"}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ color: s.paymentStatus === "active" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{s.paymentStatus || "due"}</span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>{s.whatsapp || "—"}</td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                            {confirmUid === s.uid ? (
                              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                                <span style={{ fontSize: 12, color: "#dc2626" }}>Remove {s.name}?</span>
                                <button onClick={() => handleRemove(s.uid)} disabled={removing === s.uid} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: removing === s.uid ? 0.6 : 1 }}>
                                  {removing === s.uid ? "Removing…" : "Confirm"}
                                </button>
                                <button onClick={() => setConfirmUid(null)} style={{ background: "#f3f4f6", color: "#374151", border: "none", padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                              </span>
                            ) : (
                              <button onClick={() => setConfirmUid(s.uid)} style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                            )}
                          </td>
                        </tr>
                        {expandedUid === s.uid && (
                          <tr key={`${s.uid}-detail`} style={{ background: "#f9fafb" }}>
                            <td colSpan={6} style={{ padding: "16px 20px" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                                <DetailField label="Email" value={s.email} />
                                <DetailField label="Medium" value={s.medium} />
                                <DetailField label="Mode" value={s.mode} />
                                <DetailField label="School" value={s.schoolName} />
                                <DetailField label="Address" value={s.address} />
                                <DetailField label="Payment Plan" value={s.paymentPlan} />
                                <DetailField label="Due Date" value={s.paymentDueDate} />
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "doubts" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 13, color: "#6b7280" }}>Doubt photos submitted by students will appear here for you to review and reply to.</p>
            </div>
          )}

          {tab === "classroom" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
                Generate a Google Meet link for your next 2-hour class. Only students with active payment status in the selected class will see the join button.
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
                Upload notes for a class. Only students with active payment in that class will be able to download them.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <SelectStub label="Class" options={["Class 10", "Class 11", "Class 12"]} />
                <input type="file" style={{ fontSize: 13 }} />
                <button style={{ background: "#2563eb", color: "#fff", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Upload</button>
              </div>
            </div>
          )}

          {tab === "owner" && <OwnerSection />}
        </div>
      </main>
    </>
  );
}

// ── Owner Section: Faculty management + Site content editor ──────────────
function OwnerSection() {
  const [section, setSection] = useState<"faculty" | "content">("faculty");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setSection("faculty")} style={{ padding: "8px 16px", borderRadius: 9, fontWeight: 600, fontSize: 12, border: "1px solid #e5e7eb", cursor: "pointer", background: section === "faculty" ? "#5b21b6" : "#fff", color: section === "faculty" ? "#fff" : "#374151" }}>
          Faculty Management
        </button>
        <button onClick={() => setSection("content")} style={{ padding: "8px 16px", borderRadius: 9, fontWeight: 600, fontSize: 12, border: "1px solid #e5e7eb", cursor: "pointer", background: section === "content" ? "#5b21b6" : "#fff", color: section === "content" ? "#fff" : "#374151" }}>
          Website Content
        </button>
      </div>
      {section === "faculty" ? <FacultyManager /> : <SiteContentEditor />}
    </div>
  );
}

function FacultyManager() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [form, setForm] = useState({ name: "", position: "Faculty" as "Owner" | "Faculty", degree: "", subject: "", photoUrl: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "faculty"), (snap) => {
      setFaculty(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Faculty)));
    });
    return () => unsub();
  }, []);

  const addFaculty = async () => {
    if (!form.name || !form.degree) { setErr("Name and degree are required."); return; }
    setErr("");
    setSaving(true);
    try {
      await addDoc(collection(db, "faculty"), { ...form, createdAt: serverTimestamp() });
      setForm({ name: "", position: "Faculty", degree: "", subject: "", photoUrl: "", bio: "" });
    } catch (e: any) {
      setErr(e?.message || "Could not add faculty.");
    } finally {
      setSaving(false);
    }
  };

  const removeFaculty = async (id: string) => {
    await deleteDoc(doc(db, "faculty", id));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
        <p style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Add Faculty</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Full Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Rakesh Debbarma" /></Field>
          <Field label="Position">
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as any })} style={inputStyle}>
              <option value="Owner">Owner</option>
              <option value="Faculty">Faculty</option>
            </select>
          </Field>
          <Field label="Degree / Qualification"><input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} style={inputStyle} placeholder="e.g. M.Sc Mathematics, IIT Delhi" /></Field>
          <Field label="Subject / Specialization"><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="e.g. Mathematics" /></Field>
          <Field label="Photo URL">
            <input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} style={inputStyle} placeholder="Paste an image link" />
          </Field>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: -6 }}>
            Direct photo upload isn't wired yet (needs Cloudinary — see the doubts/notes phase). For now, upload the photo anywhere (e.g. a Google Drive public link, or your own site's /public folder) and paste the URL here.
          </p>
          <Field label="Short Bio"><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} placeholder="One or two lines about them" /></Field>
          {err && <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", color: "#dc2626", fontSize: 12 }}>{err}</div>}
          <button onClick={addFaculty} disabled={saving} style={{ background: "#5b21b6", color: "#fff", padding: 12, borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Adding…" : "+ Add Faculty"}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
        <p style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Current Faculty ({faculty.length})</p>
        {faculty.length === 0 ? (
          <p style={{ fontSize: 13, color: "#9ca3af" }}>No faculty added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faculty.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #f3f4f6", borderRadius: 12, padding: 12 }}>
                {f.photoUrl ? (
                  <img src={f.photoUrl} alt={f.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f3f4f6", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13 }}>{f.name} <span style={{ fontWeight: 500, color: "#9ca3af", fontSize: 11 }}>· {f.position}</span></p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{f.degree}</p>
                </div>
                <button onClick={() => removeFaculty(f.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SiteContentEditor() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "siteContent", "main")).then((snap) => {
      if (snap.exists()) setContent({ ...DEFAULT_CONTENT, ...(snap.data() as SiteContent) });
      setLoaded(true);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "siteContent", "main"), content, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof SiteContent) => (e: React.ChangeEvent<HTMLInputElement>) => setContent({ ...content, [key]: e.target.value });

  if (!loaded) return <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#1e40af" }}>
        ℹ️ This saves your edits to the database. Your homepage isn't reading from here yet — that's a follow-up step so we can wire it in without breaking your current design. Ask me when you're ready for that.
      </div>

      <SectionCard title="Hero Section">
        <Field label="Headline"><input value={content.heroHeadline} onChange={set("heroHeadline")} style={inputStyle} /></Field>
        <Field label="Headline Accent (gold text)"><input value={content.heroAccent} onChange={set("heroAccent")} style={inputStyle} /></Field>
        <Field label="Tagline (Kokborok)"><input value={content.heroTagline} onChange={set("heroTagline")} style={inputStyle} /></Field>
        <Field label="Description"><input value={content.heroDescription} onChange={set("heroDescription")} style={inputStyle} /></Field>
      </SectionCard>

      <SectionCard title="Class Pricing">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {(["10", "11", "12"] as const).map((c) => (
            <div key={c} style={{ border: "1px solid #f3f4f6", borderRadius: 10, padding: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Class {c}</p>
              <Field label="Original ₹"><input type="number" value={(content as any)[`class${c}Original`]} onChange={set(`class${c}Original` as keyof SiteContent)} style={inputStyle} /></Field>
              <Field label="Offer ₹"><input type="number" value={(content as any)[`class${c}Offer`]} onChange={set(`class${c}Offer` as keyof SiteContent)} style={inputStyle} /></Field>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="WhatsApp Group Links">
        <Field label="Class 10 Group Link"><input value={content.waClass10} onChange={set("waClass10")} style={inputStyle} placeholder="https://chat.whatsapp.com/..." /></Field>
        <Field label="Class 11 Group Link"><input value={content.waClass11} onChange={set("waClass11")} style={inputStyle} /></Field>
        <Field label="Class 12 Group Link"><input value={content.waClass12} onChange={set("waClass12")} style={inputStyle} /></Field>
      </SectionCard>

      <SectionCard title="Contact Info">
        <Field label="Phone"><input value={content.contactPhone} onChange={set("contactPhone")} style={inputStyle} /></Field>
        <Field label="Email"><input value={content.contactEmail} onChange={set("contactEmail")} style={inputStyle} /></Field>
        <Field label="Address"><input value={content.contactAddress} onChange={set("contactAddress")} style={inputStyle} /></Field>
      </SectionCard>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={save} disabled={saving} style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>✓ Saved</span>}
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
      <p style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, display: "block" }}>
      {label}
      <div style={{ marginTop: 4 }}>{children}</div>
    </label>
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
function DetailField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{value || "—"}</p>
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

const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #e5e7eb", padding: "9px 12px", borderRadius: 9, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" };