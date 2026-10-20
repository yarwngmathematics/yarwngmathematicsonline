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

// Kept optional so existing pages that still pass these props do not break.
interface NavbarProps {
  onEnroll?: () => void;
  enrollHref?: string;
}

export default function Navbar(_props: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close the menu with the Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loginActive = pathname === "/login";

  return (
    <>
      <style>{`
        .ym-util-bar, .ym-nav, .ym-menu { font-family: var(--font-nunito), 'Nunito Sans', system-ui, sans-serif; }

        /* ===== TOP UTILITY BAR ===== */
        .ym-util-bar { background: #0a1c45; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ym-util-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 36px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-util-left { display: flex; align-items: center; gap: 20px; }
        .ym-util-item { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.75); font-size: 12.5px; font-weight: 600; white-space: nowrap; }
        .ym-util-item a { color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.2s; }
        .ym-util-item a:hover { color: #fdba74; }
        .ym-util-icon { color: #fb923c; font-size: 12px; }
        .ym-util-right-group { display: flex; align-items: center; gap: 16px; }
        .ym-util-social { display: flex; align-items: center; gap: 10px; }
        .ym-util-social-link { color: rgba(255,255,255,0.75); display: flex; align-items: center; transition: color 0.2s; }
        .ym-util-social-link:hover { color: #fdba74; }
        .ym-util-right { color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 600; }
        @media (max-width: 760px) { .ym-util-item.hide-sm { display: none; } .ym-util-right { display: none; } }
        @media (max-width: 560px) { .ym-util-bar { display: none; } }

        /* ===== MAIN NAV ===== */
        .ym-nav { position: sticky; top: 0; z-index: 100; background: #ffffff; border-bottom: 1px solid #e5e9f2; transition: box-shadow 0.3s; }
        .ym-nav.scrolled { box-shadow: 0 6px 24px rgba(10,28,69,0.10); }
        .ym-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ym-nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; min-width: 0; }
        .ym-nav-logo { width: 42px; height: 42px; object-fit: contain; border-radius: 10px; border: 1px solid #e5e9f2; background: #fff; flex-shrink: 0; }
        .ym-nav-name { font-weight: 800; font-size: 17px; color: #0a1c45; line-height: 1.15; letter-spacing: -0.01em; }
        .ym-nav-sub { font-size: 11px; color: #6b7a96; font-weight: 600; margin-top: 2px; }
        .ym-nav-links { display: flex; align-items: center; gap: 4px; }
        .ym-nav-link { padding: 9px 15px; border-radius: 9px; font-size: 14px; font-weight: 700; color: #33415c; transition: background 0.2s, color 0.2s; text-decoration: none; display: inline-flex; align-items: center; position: relative; }
        .ym-nav-link:hover { color: #0a1c45; background: #f1f4fa; }
        .ym-nav-link.active { color: #c2410c; background: #fff1e3; }
        .ym-nav-login { background: #f97316; color: #fff; padding: 11px 22px; border-radius: 10px; font-weight: 800; font-size: 14px; text-decoration: none; display: inline-flex; align-items: center; white-space: nowrap; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 6px 16px rgba(249,115,22,0.30); }
        .ym-nav-login:hover { background: #ea580c; transform: translateY(-1px); }
        .ym-nav-login.active { background: #ea580c; }
        .ym-nav-right { display: flex; align-items: center; gap: 10px; }

        /* Hamburger (3 bars) */
        .ym-hamburger { display: none; width: 44px; height: 44px; border-radius: 10px; border: 1px solid #e5e9f2; background: #fff; cursor: pointer; align-items: center; justify-content: center; flex-direction: column; gap: 5px; padding: 0; transition: background 0.2s; }
        .ym-hamburger:hover { background: #f1f4fa; }
        .ym-hamburger span { display: block; width: 20px; height: 2.5px; background: #0a1c45; border-radius: 2px; transition: transform 0.25s, opacity 0.2s; }
        .ym-hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .ym-hamburger.open span:nth-child(2) { opacity: 0; }
        .ym-hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

        /* Mobile menu: hangs directly under the sticky nav */
        .ym-menu { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e5e9f2; box-shadow: 0 16px 32px rgba(10,28,69,0.14); padding: 14px 20px 20px; flex-direction: column; gap: 4px; max-height: calc(100vh - 70px); overflow-y: auto; }
        .ym-menu.open { display: flex; }
        .ym-menu-link { padding: 14px 16px; border-radius: 10px; font-size: 16px; font-weight: 700; color: #33415c; text-decoration: none; display: block; }
        .ym-menu-link:hover { background: #f1f4fa; }
        .ym-menu-link.active { background: #fff1e3; color: #c2410c; }
        .ym-menu-divider { height: 1px; background: #e5e9f2; margin: 8px 0; }
        .ym-menu .ym-nav-login { justify-content: center; padding: 15px; font-size: 16px; border-radius: 12px; }

        @media (max-width: 900px) {
          .ym-nav-links, .ym-nav-right .ym-nav-login { display: none; }
          .ym-hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .ym-nav-inner { padding: 0 16px; height: 64px; }
          .ym-menu { max-height: calc(100vh - 64px); }
          .ym-nav-name { font-size: 15px; }
          .ym-nav-sub { display: none; }
        }
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
              <a href="https://www.instagram.com/_rakesh__debbarma/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="ym-util-social-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@RakeshDebbarmaofficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="ym-util-social-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {/* Desktop links */}
          <div className="ym-nav-links">
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

          {/* Right side: Login / Register (desktop) + 3-bar button (mobile) */}
          <div className="ym-nav-right">
            <Link href="/login" className={`ym-nav-login${loginActive ? " active" : ""}`}>
              Login / Register
            </Link>
            <button
              type="button"
              className={`ym-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="ym-mobile-menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="ym-mobile-menu" className={`ym-menu${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`ym-menu-link${pathname === l.href ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="ym-menu-divider" />
          <Link href="/login" className={`ym-nav-login${loginActive ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
            Login / Register
          </Link>
        </div>
      </nav>
    </>
  );
}