import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO_URL } from "../data/config";

const Footer: React.FC = () => {
  return (
    <footer
      className="text-white relative overflow-hidden"
      style={{
        background: "var(--background)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/NsLogo2.svg"
                  alt="NativeSquare logo"
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                NativeSquare
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-sm">
              Your full-service software agency and app studio. We turn business
              ideas into profitable products—handling everything from strategy
              and development to launch and sales.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-white/35">
                <li>
                  <Link href="/about" className="hover:text-white/70 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white/70 transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-sm text-white/35">
                <li>
                  <Link
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white/70 transition-colors"
                  >
                    Product Development
                  </Link>
                </li>
                <li>
                  <Link
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white/70 transition-colors"
                  >
                    Launch Strategy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-3 text-sm text-white/35">
                <li>
                  <Link href="/about" className="hover:text-white/70 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-white/35">
                <li>
                  <Link href="/legal" className="hover:text-white/70 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-white/70 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-sm text-white/25">
            &copy; 2025 NativeSquare SAS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/25">
            <Link href="/legal" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link href="/legal" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
