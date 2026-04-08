import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-[var(--gray-8)]"
      style={{ borderTop: "1px solid var(--gray-20)" }}
    >
      <div className="container-md py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/NsLogo2.svg"
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
            <p className="fs-14 text-[var(--gray-40)] max-w-sm leading-relaxed">
              Healthcare-focused startup studio building the future of health
              technology. We create our own platforms and partner with
              visionary health tech companies.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-[13px] font-medium text-[var(--gray-60)] mb-4 uppercase tracking-tight">
                Studio
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/about"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#case-studies"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[var(--gray-60)] mb-4 uppercase tracking-tight">
                Products
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="#products"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Cadence
                  </Link>
                </li>
                <li>
                  <Link
                    href="#case-studies"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Doctr
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[var(--gray-60)] mb-4 uppercase tracking-tight">
                Connect
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <a
                    href="mailto:hello@nativesquare.fr"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/nativesquare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-[var(--gray-60)] mb-4 uppercase tracking-tight">
                Legal
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/legal"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-[var(--gray-40)] hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--gray-20)" }}
        >
          <p className="text-[13px] text-[var(--gray-30)]">
            &copy; 2025 NativeSquare SAS. All rights reserved.
          </p>
          <div className="flex gap-6 text-[13px] text-[var(--gray-30)]">
            <Link
              href="/legal"
              className="hover:text-[var(--gray-50)] transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/legal"
              className="hover:text-[var(--gray-50)] transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
