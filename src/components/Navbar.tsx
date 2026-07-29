"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",    href: "/",        id: "home"    },
  { label: "About",   href: "/about",   id: "about"   },
  { label: "Classes", href: "/classes", id: "classes" },
  { label: "Why Us",  href: "/why-us",  id: "why-us"  },
  { label: "Contact", href: "/contact", id: "contact" },
];

interface NavbarProps {
  onEnroll?: () => void;
  enrollHref?: string; // fallback if no modal
}

export default function Navbar({ onEnroll, enrollHref = "/#enroll" }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const handleEnroll = () => {
    setMobileMenuOpen(false);
    if (onEnroll) onEnroll();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

        /* ===== TOP UTILITY BAR ===== */
        .ym-util-bar { background: #060f2e; border-bottom: 1px solid rgba(255,255,255,0.08); font-family: 'Outfit', sans-serif; }
        .ym-util-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 34px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-util-left { display: flex; align-items: center; gap: 18px; }
        .ym-util-item { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.65); font-size: 12px; font-weight: 500; white-space: nowrap; }
        .ym-util-item a { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
        .ym-util-item a:hover { color: #fcd34d; }
        .ym-util-icon { color: #f59e0b; font-size: 12px; }
        .ym-util-right { color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 500; letter-spacing: 0.03em; }
        .ym-util-right-group { display: flex; align-items: center; gap: 16px; }
        .ym-util-social { display: flex; align-items: center; gap: 10px; }
        .ym-util-social-link { color: rgba(255,255,255,0.65); display: flex; align-items: center; transition: color 0.2s; }
        .ym-util-social-link:hover { color: #fcd34d; }
        @media (max-width: 760px) { .ym-util-item.hide-sm { display: none; } .ym-util-right { display: none; } }
        @media (max-width: 500px) { .ym-util-bar { display: none; } }

        /* ===== MAIN NAV ===== */
        .ym-nav { position: sticky; top: 0; z-index: 100; background: #ffffff; border-bottom: 1px solid #e5e7eb; transition: box-shadow 0.3s; font-family: 'Outfit', sans-serif; }
        .ym-nav.scrolled { box-shadow: 0 4px 20px rgba(6,15,46,0.08); }
        .ym-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-nav-brand { display: flex; align-items: center; gap: 11px; text-decoration: none; flex-shrink: 0; }
        .ym-nav-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 9px; border: 1px solid #e5e7eb; background: #ffffff; }
        .ym-nav-name { font-weight: 800; font-size: 15px; color: #060f2e; line-height: 1.2; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.01em; }
        .ym-nav-sub { font-size: 10px; color: #9ca3af; font-weight: 500; }
        .ym-nav-links { display: flex; align-items: center; gap: 2px; }
        .ym-nav-link { padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.2s; background: transparent; border: none; text-decoration: none; display: inline-flex; align-items: center; position: relative; }
        .ym-nav-link:hover { color: #060f2e; background: #f3f4f6; }
        .ym-nav-link.active { color: #060f2e; background: #fef3c7; }
        .ym-nav-link.active::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #f59e0b; }
        .ym-nav-enroll { background: #f59e0b; color: #1a0a00; padding: 10px 20px; border-radius: 9px; font-weight: 800; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; font-family: 'Outfit', sans-serif; }
        .ym-nav-enroll:hover { background: #fcd34d; transform: translateY(-1px); }
        .ym-hamburger { display: none; background: transparent; border: none; cursor: pointer; padding: 6px; flex-direction: column; gap: 5px; }
        .ym-hamburger span { display: block; width: 20px; height: 2px; background: #060f2e; border-radius: 2px; transition: all 0.3s; }
        .ym-mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; bottom: 0; background: rgba(6,15,46,0.98); backdrop-filter: blur(20px); z-index: 99; flex-direction: column; padding: 20px; gap: 6px; overflow-y: auto; font-family: 'Outfit', sans-serif; }
        .ym-mobile-menu.open { display: flex; }
        .ym-mobile-link { padding: 13px 16px; border-radius: 11px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8); cursor: pointer; background: transparent; border: none; text-align: left; transition: all 0.2s; text-decoration: none; display: block; }
        .ym-mobile-link:hover, .ym-mobile-link.active { background: rgba(245,158,11,0.15); color: #fcd34d; }
        .ym-mobile-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 6px 0; }
        @media (max-width: 900px) { .ym-nav-links { display: none; } .ym-hamburger { display: flex; } }
        @media (max-width: 500px) { .ym-nav-enroll { font-size: 11px; padding: 8px 14px; } .ym-nav-name { font-size: 13px; } .ym-nav-sub { display: none; } }
      `}</style>

      {/* TOP UTILITY BAR */}
      <div className="ym-util-bar">
        <div className="ym-util-inner">
          <div className="ym-util-left">
            <span className="ym-util-item">
              <span className="ym-util-icon">✉</span>
              <a href="mailto:yarwngmathematics@gmail.com">yarwngmathematics@gmail.com</a>
            </span>
            <span className="ym-util-item hide-sm">
              <span className="ym-util-icon">☎</span>
              <a href="tel:9366030347">9366030347</a>
            </span>
            <span className="ym-util-item hide-sm">
              <span className="ym-util-icon">📍</span>
              Khumulwng, Tripura
            </span>
          </div>
          <div className="ym-util-right-group">
            <div className="ym-util-social">
              <a
                href="https://www.instagram.com/_rakesh__debbarma/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="ym-util-social-link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@RakeshDebbarmaofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="ym-util-social-link"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12s0-3.2-.4-4.7c-.24-.87-.94-1.55-1.8-1.79C18.3 5 12 5 12 5s-6.3 0-7.8.51c-.87.24-1.56.92-1.8 1.79C2 8.8 2 12 2 12s0 3.2.4 4.7c.24.87.93 1.55 1.8 1.79C5.7 19 12 19 12 19s6.3 0 7.8-.51c.87-.24 1.56-.92 1.8-1.79.4-1.5.4-4.7.4-4.7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M10 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
                </svg>
              </a>
            </div>
            <div className="ym-util-right">Mon–Sat · 11 AM – 6 PM</div>
          </div>
        </div>
      </div>

      <nav className={`ym-nav${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="ym-nav-inner">
          {/* Brand */}
          <Link href="/" className="ym-nav-brand">
            <img src="/Logo.png" alt="Yarwng Mathematics Logo" className="ym-nav-logo" />
            <div>
              <div className="ym-nav-name">Yarwng Mathematics</div>
              <div className="ym-nav-sub">Rakesh Debbarma · M.Sc, IIT Delhi</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="ym-nav-links" role="menubar">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className={`ym-nav-link${pathname === l.href ? " active" : ""}`}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Enroll + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {onEnroll ? (
              <button onClick={handleEnroll} className="ym-nav-enroll">Enroll Now →</button>
            ) : (
              <Link href={enrollHref} className="ym-nav-enroll">Enroll Now →</Link>
            )}
            <button
              className="ym-hamburger"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span style={{ transform: mobileMenuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
              <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ transform: mobileMenuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`ym-mobile-menu${mobileMenuOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.id}
            href={l.href}
            className={`ym-mobile-link${pathname === l.href ? " active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
        <div className="ym-mobile-divider" />
        {onEnroll ? (
          <button onClick={handleEnroll} className="ym-nav-enroll" style={{ borderRadius: "11px", padding: "14px", width: "100%", justifyContent: "center" }}>
            Enroll Now →
          </button>
        ) : (
          <Link href={enrollHref} className="ym-nav-enroll" style={{ borderRadius: "11px", padding: "14px", justifyContent: "center" }}>
            Enroll Now →
          </Link>
        )}
      </div>
    </>
  );
}