"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Studio", href: "#studio" },
  { label: "Products", href: "#products" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
];

const BOOKING_URL = "https://cal.com/nativesquare-office-orlgbk/30min";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[backdrop-filter,border-color] duration-300 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={{
        background: scrolled ? "rgba(18, 19, 23, 0.9)" : "rgba(18, 19, 23, 0)",
        borderBottom: scrolled ? "1px solid var(--gray-20)" : "1px solid transparent",
      }}
    >
      <div className="container-md">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/hero/ns-logo.png"
                alt="NativeSquare logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-[15px] font-medium tracking-tight text-white">
              NativeSquare
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium tracking-tight text-[var(--gray-60)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-6 h-[38px] text-[14px] font-medium text-white transition-colors duration-200"
              style={{
                background: "var(--button-blue)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--button-light-blue)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--button-blue)")
              }
            >
              Get in Touch
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center rounded-lg px-2.5 py-2 text-white transition-colors"
            style={{
              border: "1px solid var(--gray-20)",
              background: "var(--gray-12)",
            }}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl"
          style={{
            background: "rgba(18, 19, 23, 0.95)",
            borderTop: "1px solid var(--gray-20)",
          }}
        >
          <div className="container-md py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-3 text-[14px] font-medium text-[var(--gray-60)] hover:text-white rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 mx-3 mt-3 rounded-full h-[42px] text-[14px] font-medium text-white"
                style={{ background: "var(--button-blue)" }}
              >
                Get in Touch
                <ArrowRight size={14} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
