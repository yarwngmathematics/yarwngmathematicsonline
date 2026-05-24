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
    // ── Brand & person (these get you found by name searches)
    "Yarwng Mathematics",
    "Rakesh Debbarma",
    "Rakesh Debbarma IIT Delhi",
    "Rakesh Debbarma mathematics",
    // ── Location-based
    "mathematics coaching Tripura",
    "math tuition Khumulwng",
    "online math class Kokborok",
    "math teacher Tripura",
    // ── Class-based
    "math tuition Class 10 11 12",
    "Class 10 mathematics coaching",
    "Class 11 mathematics coaching",
    "Class 12 mathematics coaching",
    // ── General
    "IIT Delhi math tutor",
    "online mathematics coaching India",
  ],
  authors: [{ name: "Rakesh Debbarma" }],
  creator: "Rakesh Debbarma",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Yarwng Mathematics",
              "url": "https://yarwngmathematicsonline.vercel.app",
              "logo": "https://yarwngmathematicsonline.vercel.app/Logo.png",
              "description": "Mathematics coaching for Class 10, 11 & 12 by Rakesh Debbarma, M.Sc IIT Delhi.",
              "founder": {
                "@type": "Person",
                "name": "Rakesh Debbarma",
                "alumniOf": {
                  "@type": "EducationalOrganization",
                  "name": "IIT Delhi"
                },
                "hasCredential": {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "M.Sc Mathematics"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Khumulwng",
                "addressRegion": "Tripura",
                "addressCountry": "IN"
              },
              "telephone": "+919366030347",
              "email": "yarwngmathematics@gmail.com",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Class 10 Mathematics",
                  "price": "600",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "name": "Class 11 Mathematics",
                  "price": "800",
                  "priceCurrency": "INR"
                },
                {
                  "@type": "Offer",
                  "name": "Class 12 Mathematics",
                  "price": "900",
                  "priceCurrency": "INR"
                }
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}