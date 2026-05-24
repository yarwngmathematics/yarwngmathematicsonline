import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yarwng Mathematics – Expert Math Coaching by IIT Delhi | Class 10, 11, 12",
  description:
    "Online & offline mathematics coaching for Class 10, 11 & 12 by Rakesh Debbarma (M.Sc, IIT Delhi). Live Google Meet sessions. Enroll now from ₹600/month.",
  keywords: [
    "mathematics coaching Tripura",
    "math tuition Class 10 11 12",
    "online math class Kokborok",
    "Yarwng Mathematics",
    "Rakesh Debbarma IIT Delhi",
    "Khumulwng tuition",
  ],
  authors: [{ name: "Rakesh Debbarma" }],
  robots: "index, follow",
  metadataBase: new URL("https://yarwngmathematicsonline.vercel.app"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "T1Ybq1u6RWhPUb5mJ5EukMVdD87515YpZglw-OZ0iWg",
  },
  openGraph: {
    type: "website",
    url: "https://yarwngmathematicsonline.vercel.app",
    title: "Yarwng Mathematics – IIT Delhi Math Coaching | Class 10, 11, 12",
    description:
      "Expert mathematics coaching by an IIT Delhi M.Sc graduate. Online via Google Meet. Classes 10–12. Starting 3rd June 2026.",
    siteName: "Yarwng Mathematics",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yarwng Mathematics – IIT Delhi Math Coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yarwng Mathematics – IIT Delhi Math Coaching",
    description: "Live online math classes for Class 10–12 by Rakesh Debbarma, IIT Delhi.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}