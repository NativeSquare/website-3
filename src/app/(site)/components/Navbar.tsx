"use client";

import { useState } from "react";
import { PORTFOLIO_URL } from "../data/config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header className="relative z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/NsLogo2.svg"
                  alt="NativeSquare logo"
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="font-bold text-xl tracking-tight font-geist text-gray-900">
                NativeSquare
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <Link
              href="/about"
              className={`transition-colors font-geist ${isActive("/about")}`}
            >
              About
            </Link>
            <Link
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors font-geist text-gray-600 hover:text-gray-900"
            >
              Portfolio
            </Link>
            <Link
              href="/legal"
              className={`transition-colors font-geist ${isActive("/legal")}`}
            >
              Legal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
              className="hidden sm:inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-gray-900/20 hover:bg-black transition-colors font-geist"
            >
              Start a Project
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-1">
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg font-geist"
              >
                About
              </Link>
              <Link
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg font-geist"
              >
                Portfolio
              </Link>
              <Link
                href="/legal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg font-geist"
              >
                Legal
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-black transition-colors font-geist"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
