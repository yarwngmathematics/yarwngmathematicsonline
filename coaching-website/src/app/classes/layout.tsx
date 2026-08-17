// app/classes/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classes & Syllabus",
  description:
    "Explore Class 10, 11 & 12 mathematics coaching by Rakesh Debbarma (IIT Delhi) — full syllabus, weekly schedule, and pricing starting from ₹600/month. Live sessions via Google Meet.",
  alternates: {
    canonical: "/classes",
  },
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return children;
}