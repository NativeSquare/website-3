"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services", hasDropdown: true },
  { label: "Open source", href: "#open-source", hasDropdown: false },
  { label: "Products", href: "#products", hasDropdown: true },
  { label: "Blog", href: "/blog", hasDropdown: false },
  { label: "Company", href: "#company", hasDropdown: true },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1216px] px-6 lg:px-8">
        <div className="flex items-center justify-between py-5 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/NsLogo2.svg"
                alt="NativeSquare logo"
                width={28}
                height={28}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.3px] text-white">
              NativeSquare
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-[14px] leading-[20px] tracking-[-0.28px] text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={13} strokeWidth={1.5} className="opacity-50" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-white hover:bg-white/10 transition-colors"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5">
          <div className="mx-auto max-w-[1216px] px-6 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 text-[14px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown size={14} className="opacity-40" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
