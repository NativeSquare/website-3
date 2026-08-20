"use client";

import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import BookingLink from "./BookingLink";

/* Decorative SVG — abstract molecular/connection illustration */
const CTAIllustration = () => (
  <svg
    width="576"
    height="160"
    viewBox="0 0 576 160"
    fill="none"
    className="w-[576px] shrink-0 max-lg:w-[512px] max-[1023px]:w-[404px] max-md:w-[320px]"
  >
    {/* Connection lines */}
    <g stroke="var(--gray-80)" strokeWidth="0.8" opacity="0.5">
      <line x1="100" y1="80" x2="200" y2="40" />
      <line x1="200" y1="40" x2="300" y2="80" />
      <line x1="300" y1="80" x2="400" y2="50" />
      <line x1="400" y1="50" x2="480" y2="80" />
      <line x1="200" y1="40" x2="250" y2="120" />
      <line x1="300" y1="80" x2="350" y2="130" />
      <line x1="100" y1="80" x2="150" y2="130" />
      <line x1="400" y1="50" x2="450" y2="120" />
    </g>
    {/* Orbital rings */}
    <ellipse cx="288" cy="80" rx="200" ry="50" stroke="var(--gray-90)" strokeWidth="0.5" strokeDasharray="4 6" fill="none" opacity="0.6" />
    <ellipse cx="288" cy="80" rx="120" ry="30" stroke="var(--gray-90)" strokeWidth="0.5" strokeDasharray="3 5" fill="none" opacity="0.4" />
    {/* Nodes */}
    <circle cx="100" cy="80" r="6" fill="#1a79ff" opacity="0.7" />
    <circle cx="200" cy="40" r="8" fill="#1a79ff" />
    <circle cx="300" cy="80" r="10" fill="#62bf59" />
    <circle cx="400" cy="50" r="7" fill="#9e79ec" />
    <circle cx="480" cy="80" r="5" fill="#fead34" />
    {/* Secondary nodes */}
    <circle cx="250" cy="120" r="4" fill="var(--gray-60)" />
    <circle cx="350" cy="130" r="3.5" fill="var(--gray-60)" />
    <circle cx="150" cy="130" r="3" fill="var(--gray-70)" />
    <circle cx="450" cy="120" r="3.5" fill="var(--gray-70)" />
    {/* Highlight dots */}
    <circle cx="200" cy="40" r="3" fill="white" opacity="0.4" />
    <circle cx="300" cy="80" r="3.5" fill="white" opacity="0.3" />
  </svg>
);

const CTA: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      className="pt-24 pb-32 max-lg:pb-24 max-[1023px]:pb-20 max-md:pb-16"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
      ref={ref}
    >
      <div
        className={`container-sm flex flex-col items-center transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ maxWidth: "1152px" }}
      >
        {/* Decorative illustration */}
        <CTAIllustration />

        {/* Title */}
        <h2 className="mt-4 text-balance text-center font-title fs-56 font-medium leading-none tracking-tighter max-lg:mt-3 max-lg:!text-[48px] max-lg:tracking-tight max-[1023px]:!text-[36px] max-md:!text-[32px]">
          Let&apos;s build something meaningful
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-[478px] text-center fs-18 leading-snug tracking-tight text-gray-20 max-[1023px]:mt-3.5 max-[1023px]:!text-[16px]">
          Whether you&apos;re launching a health platform or need a technical
          partner who understands the sector — we&apos;d love to talk.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex items-center justify-center gap-x-5 max-xl:mt-8 max-[1023px]:mt-6 max-[1023px]:gap-x-5 max-md:flex-wrap max-md:gap-y-3">
          <BookingLink
            source="cta"
            className="group inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-200 rounded-full h-[46px] px-[26px] text-[16px] text-white min-w-[154px] max-[1023px]:h-[38px] max-[1023px]:min-w-[122px] max-[1023px]:px-6 max-[1023px]:text-[14px]"
            style={{ background: "var(--button-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--button-light-blue)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--button-blue)")
            }
          >
            <span>Book a call</span>
          </BookingLink>

          <Link
            href="#products"
            className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-14 leading-snug text-gray-5 hover:text-[var(--button-blue)] rounded-sm"
          >
            <span>Explore our work</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1.5"
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
    </section>
  );
};

export default CTA;
