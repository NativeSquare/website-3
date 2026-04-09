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
            {/* Doctr — branded red card */}
            <div className="group relative h-[380px] overflow-hidden rounded-lg p-8 flex flex-col justify-end transition-all duration-200 cursor-pointer hover:translate-y-[-2px]"
              style={{ background: "#D63838" }}
            >
              {/* Doctr logo centered in top area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logos/doctr-on-red.svg"
                  alt="Doctr"
                  width={160}
                  height={68}
                  className="w-[160px] h-auto -translate-y-6"
                />
              </div>
              {/* Gradient fade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(180,30,30,0.95) 30%, transparent 65%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <span className="inline-block text-[12px] font-medium tracking-tight rounded-full px-3 py-1 mb-4 text-white/80 bg-white/15">
                  Health Platform
                </span>
                <h3 className="fs-24 font-medium leading-tight tracking-tight text-white mb-2">
                  Doctr
                </h3>
                <p className="fs-15 leading-snug tracking-tight text-white/70 mb-5">
                  A comprehensive platform for Canadian healthcare providers.
                  Streamlining patient management, appointments, and clinical
                  workflows.
                </p>
                <Link
                  href="#"
                  className="group/link inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-white hover:text-white/70"
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

            {/* StackUp Fantasy — dark green gradient card */}
            <div className="group relative h-[380px] overflow-hidden rounded-lg p-8 flex flex-col justify-end transition-all duration-200 cursor-pointer hover:translate-y-[-2px]"
              style={{ background: "linear-gradient(145deg, #0a2e1a 0%, #0f1f14 50%, #0b0c0e 100%)" }}
            >
              {/* Field lines pattern */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Horizontal field lines */}
                  <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#1a4a2e" strokeWidth="0.5" opacity="0.5" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1a4a2e" strokeWidth="0.8" opacity="0.6" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#1a4a2e" strokeWidth="0.5" opacity="0.5" />
                  {/* Center circle */}
                  <circle cx="50%" cy="50%" r="15%" stroke="#1a4a2e" strokeWidth="0.6" fill="none" opacity="0.4" />
                  <circle cx="50%" cy="50%" r="2" fill="#62bf59" opacity="0.3" />
                  {/* Vertical center line */}
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1a4a2e" strokeWidth="0.5" opacity="0.4" />
                </svg>
              </div>
              {/* StackUp logo centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logos/stack_up.webp"
                  alt="StackUp Fantasy"
                  width={200}
                  height={100}
                  className="w-[180px] h-auto max-md:w-[140px] -translate-y-4"
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
                  style={{ color: "#62bf59", background: "rgba(98,191,89,0.12)" }}
                >
                  Fantasy Sport
                </span>
                <h3 className="fs-24 font-medium leading-tight tracking-tight text-white mb-2">
                  StackUp Fantasy
                </h3>
                <p className="fs-15 leading-snug tracking-tight text-gray-60 mb-5">
                  A fantasy sport platform where users build lineups, compete in contests, and win based on real player performance. Real-time scoring, draft mechanics, and social features.
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
