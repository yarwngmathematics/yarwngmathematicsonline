// app/why-us/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description:
    "See what sets Yarwng Mathematics apart — IIT Delhi-level expertise, conceptual depth, structured weekly timetables, WhatsApp doubt support, and regular assessments for Class 10, 11 & 12 students.",
  alternates: {
    canonical: "/why-us",
  },
};

export default function WhyUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}