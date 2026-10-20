import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

// Bold geometric sans used for all headings (matches the "Exam Categories" style)
const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
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
  metadataBase: new URL("https://www.yarwngmathematics.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "T1Ybq1u6RWhPUb5mJ5EukMVdD87515YpZglw-OZ0iWg",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.yarwngmathematics.com",
    title: "Yarwng Mathematics – IIT Delhi Math Coaching | Class 10, 11, 12",
    description:
      "Expert mathematics coaching by an IIT Delhi M.Sc graduate. Live online classes on Google Meet for Classes 10–12. Admissions open.",
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

// Standard responsive viewport: phones get the mobile layout, not a shrunk desktop page.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b3a7a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.yarwngmathematics.com/#website",
      "url": "https://www.yarwngmathematics.com",
      "name": "Yarwng Mathematics",
      "description": "Mathematics coaching for Class 10, 11 & 12 by Rakesh Debbarma, M.Sc IIT Delhi.",
      "publisher": { "@id": "https://www.yarwngmathematics.com/#organization" },
      "inLanguage": "en-IN",
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.yarwngmathematics.com/#organization",
      "name": "Yarwng Mathematics",
      "url": "https://www.yarwngmathematics.com",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.yarwngmathematics.com/#logo",
        "url": "https://www.yarwngmathematics.com/Logo.png",
        "width": 512,
        "height": 512,
        "caption": "Yarwng Mathematics",
      },
      "image": { "@id": "https://www.yarwngmathematics.com/#logo" },
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
        { "@type": "Offer", "name": "Class 10 Mathematics", "price": "600", "priceCurrency": "INR" },
        { "@type": "Offer", "name": "Class 11 Mathematics", "price": "800", "priceCurrency": "INR" },
        { "@type": "Offer", "name": "Class 12 Mathematics", "price": "900", "priceCurrency": "INR" },
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
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif", overflowX: "hidden" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}