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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .ym-nav { position: sticky; top: 0; z-index: 100; background: rgba(6,15,46,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); transition: box-shadow 0.3s; font-family: 'Outfit', sans-serif; }
        .ym-nav.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .ym-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .ym-nav-logo { width: 38px; height: 38px; object-fit: contain; border-radius: 9px; border: 1px solid rgba(255,255,255,0.15); background: #ffffff; }
        .ym-nav-name { font-weight: 700; font-size: 15px; color: #fff; line-height: 1.2; }
        .ym-nav-sub { font-size: 10px; color: #93c5fd; font-weight: 400; }
        .ym-nav-links { display: flex; align-items: center; gap: 2px; }
        .ym-nav-link { padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.2s; background: transparent; border: none; text-decoration: none; display: inline-flex; align-items: center; position: relative; }
        .ym-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .ym-nav-link.active { color: #fff; background: rgba(59,130,246,0.2); }
        .ym-nav-link.active::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #f59e0b; }
        .ym-nav-enroll { background: linear-gradient(135deg, #1d4ed8, #1e40af); color: #fff; padding: 8px 18px; border-radius: 9px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; font-family: 'Outfit', sans-serif; }
        .ym-nav-enroll:hover { background: linear-gradient(135deg, #2563eb, #1d4ed8); transform: translateY(-1px); }
        .ym-hamburger { display: none; background: transparent; border: none; cursor: pointer; padding: 6px; flex-direction: column; gap: 5px; }
        .ym-hamburger span { display: block; width: 20px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; }
        .ym-mobile-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: rgba(6,15,46,0.98); backdrop-filter: blur(20px); z-index: 99; flex-direction: column; padding: 20px; gap: 6px; overflow-y: auto; font-family: 'Outfit', sans-serif; }
        .ym-mobile-menu.open { display: flex; }
        .ym-mobile-link { padding: 13px 16px; border-radius: 11px; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8); cursor: pointer; background: transparent; border: none; text-align: left; transition: all 0.2s; text-decoration: none; display: block; }
        .ym-mobile-link:hover, .ym-mobile-link.active { background: rgba(59,130,246,0.15); color: #fff; }
        .ym-mobile-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 6px 0; }
        @media (max-width: 900px) { .ym-nav-links { display: none; } .ym-hamburger { display: flex; } }
        @media (max-width: 500px) { .ym-nav-enroll { font-size: 11px; padding: 7px 12px; } .ym-nav-name { font-size: 13px; } .ym-nav-sub { display: none; } }
      `}</style>

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