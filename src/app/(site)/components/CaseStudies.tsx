"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const CaseStudies: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="case-studies"
      className="py-24 lg:py-32"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
    >
      <div className="container-md">
        <div
          ref={ref}
          className={`animate-on-scroll ${isVisible ? "animate-fade-slide" : ""}`}
          style={isVisible ? { animationName: "fadeSlideIn" } : undefined}
        >
          {/* Header */}
          <div className="max-w-[560px] mb-16">
            <p className="text-[13px] font-medium tracking-tight text-[var(--primary-blue)] mb-4 uppercase">
              Case Studies
            </p>
            <h2 className="font-title fs-40 font-medium leading-none tracking-tight mb-5">
              Projects we&apos;re proud of
            </h2>
            <p className="fs-16 leading-snug tracking-tight text-gray-40">
              Real health platforms, built and shipped. Each project deepens
              our expertise in the sector.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Verbrio — dark purple gradient card */}
            <div className="group relative h-[380px] overflow-hidden rounded-lg p-8 flex flex-col justify-end transition-all duration-200 cursor-pointer hover:translate-y-[-2px]"
              style={{ background: "linear-gradient(145deg, #1a0e2e 0%, #130d1f 50%, #0b0c0e 100%)" }}
            >
              {/* Abstract communication pattern */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Connection lines */}
                  <line x1="20%" y1="30%" x2="50%" y2="20%" stroke="#2a1a4a" strokeWidth="0.6" opacity="0.5" />
                  <line x1="50%" y1="20%" x2="80%" y2="35%" stroke="#2a1a4a" strokeWidth="0.6" opacity="0.5" />
                  <line x1="30%" y1="50%" x2="60%" y2="45%" stroke="#2a1a4a" strokeWidth="0.6" opacity="0.4" />
                  <line x1="60%" y1="45%" x2="75%" y2="55%" stroke="#2a1a4a" strokeWidth="0.6" opacity="0.4" />
                  {/* Nodes */}
                  <circle cx="20%" cy="30%" r="3" fill="#9e79ec" opacity="0.3" />
                  <circle cx="50%" cy="20%" r="4" fill="#9e79ec" opacity="0.4" />
                  <circle cx="80%" cy="35%" r="3" fill="#73b5f2" opacity="0.3" />
                  <circle cx="30%" cy="50%" r="2.5" fill="#73b5f2" opacity="0.3" />
                  <circle cx="60%" cy="45%" r="3" fill="#9e79ec" opacity="0.35" />
                  {/* Dashed orbit */}
                  <ellipse cx="50%" cy="35%" rx="25%" ry="15%" stroke="#2a1a4a" strokeWidth="0.5" fill="none" strokeDasharray="3 5" opacity="0.3" />
                </svg>
              </div>
              {/* Verbrio logo centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logos/verbrio.avif"
                  alt="Verbrio"
                  width={200}
                  height={67}
                  className="w-[180px] h-auto max-md:w-[140px] -translate-y-4"
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.15 }}
                />
              </div>
              {/* Gradient fade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,12,14,0.95) 30%, transparent 65%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <span className="inline-block text-[12px] font-medium tracking-tight rounded-full px-3 py-1 mb-4"
                  style={{ color: "#9e79ec", background: "rgba(158,121,236,0.12)" }}
                >
                  Document Intelligence
                </span>
                <h3 className="fs-24 font-medium leading-tight tracking-tight text-white mb-2">
                  Verbrio
                </h3>
                <p className="fs-15 leading-snug tracking-tight text-gray-60 mb-5">
                  A document intelligence platform that automates administrative workflows for European SMEs. Auto-organizes invoices, delivery notes, and marketplace orders while syncing inventory across platforms.
                </p>
                <Link
                  href="#"
                  className="group/link inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-98 hover:text-gray-70"
                >
                  <span>Read case study</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1.5"
                  >
                    <path
                      d="M4.5 2L8.5 6L4.5 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
