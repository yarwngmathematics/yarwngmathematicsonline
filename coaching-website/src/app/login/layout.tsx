// app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to your Yarwng Mathematics student portal — view your class schedule, syllabus, payment status, and submit doubts.",
  alternates: {
    canonical: "/login",
  },
  // Inherit everything else (icons, verification, openGraph fallback, etc.)
  // from the root layout — no need to repeat it here.
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}