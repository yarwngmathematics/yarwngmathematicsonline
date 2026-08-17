// app/sitemap.js
export default function sitemap() {
  const baseUrl = "https://yarwngmathematics.com";
  const now = new Date();

  return [
    { url: baseUrl,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/#about`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#classes`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/#why-us`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/#contact`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/login`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/refund`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/shipping`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}