// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Yarwng Mathematics — call or WhatsApp 9366030347, email yarwngmathematics@gmail.com, or visit us in Khumulwng, Tripura. Enroll for Class 10, 11 & 12 math coaching.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}