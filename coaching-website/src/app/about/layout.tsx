// app/about/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Yarwng Mathematics was founded by Rakesh Debbarma (M.Sc Mathematics, IIT Delhi) to make advanced mathematics accessible for students in Tripura and beyond. Learn about our teaching approach and story.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}