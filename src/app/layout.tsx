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
    "Yarwng Mathematics",
    "Rakesh Debbarma",
    "Rakesh Debbarma IIT Delhi",
    "Rakesh Debbarma mathematics",
    "mathematics coaching Tripura",
    "math tuition Khumulwng",
    "online math class Kokborok",
    "math teacher Tripura",
    "math tuition Class 10 11 12",
    "Class 10 mathematics coaching",
    "Class 11 mathematics coaching",
    "Class 12 mathematics coaching",
    "IIT Delhi math tutor",
    "online mathematics coaching India",
  ],
  authors: [{ name: "Rakesh Debbarma" }],
  creator: "Rakesh Debbarma",
  robots: "index, follow",
  metadataBase: new URL("https://yarwngmathematics.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "T1Ybq1u6RWhPUb5mJ5EukMVdD87515YpZglw-OZ0iWg",
  },
  openGraph: {
    type: "website",
    url: "https://yarwngmathematics.com",
    title: "Yarwng Mathematics – IIT Delhi Math Coaching | Class 10, 11, 12",
    description:
      "Expert mathematics coaching by an IIT Delhi M.Sc graduate. Online via Google Meet. Classes 10–12. Starting 15rd June 2026.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── 1. WebSite — tells Google the preferred site name shown in search
    {
      "@type": "WebSite",
      "@id": "https://yarwngmathematics.com/#website",
      "url": "https://yarwngmathematics.com",
      "name": "Yarwng Mathematics",          // ← this becomes the bold name in SERP
      "description": "Mathematics coaching for Class 10, 11 & 12 by Rakesh Debbarma, M.Sc IIT Delhi.",
      "publisher": { "@id": "https://yarwngmathematics.com/#organization" },
      "inLanguage": "en-IN",
    },
    // ── 2. Organization — logo must use ImageObject for Google to show it
    {
      "@type": "EducationalOrganization",
      "@id": "https://yarwngmathematics.com/#organization",
      "name": "Yarwng Mathematics",
      "url": "https://yarwngmathematics.com",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://yarwngmathematics.com/#logo",
        "url": "https://yarwngmathematics.com/Logo.png",  // must be publicly accessible
        "width": 512,    // set to actual pixel dimensions of Logo.png
        "height": 512,
        "caption": "Yarwng Mathematics",
      },
      "image": { "@id": "https://yarwngmathematics.com/#logo" },
      "description": "Mathematics coaching for Class 10, 11 & 12 by Rakesh Debbarma, M.Sc IIT Delhi.",
      "founder": {
        "@type": "Person",
        "name": "Rakesh Debbarma",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "IIT Delhi",
        },
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "M.Sc Mathematics",
        },
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Khumulwng",
        "addressRegion": "Tripura",
        "addressCountry": "IN",
      },
      "telephone": "+919366030347",
      "email": "yarwngmathematics@gmail.com",
      "offers": [
        {
          "@type": "Offer",
          "name": "Class 10 Mathematics",
          "price": "600",
          "priceCurrency": "INR",
        },
        {
          "@type": "Offer",
          "name": "Class 11 Mathematics",
          "price": "800",
          "priceCurrency": "INR",
        },
        {
          "@type": "Offer",
          "name": "Class 12 Mathematics",
          "price": "900",
          "priceCurrency": "INR",
        },
      ],
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}