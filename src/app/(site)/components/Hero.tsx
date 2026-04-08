"use client";

import Image from "next/image";
import Link from "next/link";

const BOOKING_URL = "https://calendar.app.google/BFYre7dXNFCy6GfT6";

/* Logoipsum-style SVG logos */
const LogoA = () => (
  <svg height="32" viewBox="0 0 120 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#2e3038" />
    <circle cx="16" cy="16" r="8" fill="#5e616e" />
    <text
      x="40"
      y="22"
      fill="#777a88"
      fontSize="16"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Logotype
    </text>
  </svg>
);
const LogoB = () => (
  <svg height="32" viewBox="0 0 110 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#2e3038" />
    <path
      d="M10 16h12M16 10v12"
      stroke="#5e616e"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="38"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      MedTech
    </text>
  </svg>
);
const LogoC = () => (
  <svg height="32" viewBox="0 0 130 32" fill="none">
    <rect width="28" height="28" x="2" y="2" rx="4" fill="#2e3038" />
    <path
      d="M9 16l5 5 9-10"
      stroke="#5e616e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="38"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      HealthOS
    </text>
  </svg>
);
const LogoD = () => (
  <svg height="32" viewBox="0 0 105 32" fill="none">
    <path d="M4 16a12 12 0 0124 0 12 12 0 01-24 0z" fill="#2e3038" />
    <path
      d="M12 12l8 8M20 12l-8 8"
      stroke="#5e616e"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="34"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Nucleus
    </text>
  </svg>
);
const LogoE = () => (
  <svg height="32" viewBox="0 0 120 32" fill="none">
    <rect width="32" height="32" rx="16" fill="#2e3038" />
    <circle cx="16" cy="12" r="4" fill="#5e616e" />
    <path
      d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8"
      stroke="#5e616e"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="40"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Careflow
    </text>
  </svg>
);
const LogoF = () => (
  <svg height="32" viewBox="0 0 115 32" fill="none">
    <rect width="28" height="28" x="2" y="2" rx="14" fill="#2e3038" />
    <path
      d="M10 16h12"
      stroke="#5e616e"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="16" cy="16" r="3" fill="#5e616e" />
    <text
      x="38"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Synapse
    </text>
  </svg>
);
const LogoG = () => (
  <svg height="32" viewBox="0 0 100 32" fill="none">
    <polygon points="16,2 30,28 2,28" fill="#2e3038" />
    <circle cx="16" cy="20" r="3" fill="#5e616e" />
    <text
      x="36"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Praxis
    </text>
  </svg>
);
const LogoH = () => (
  <svg height="32" viewBox="0 0 110 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#2e3038" />
    <rect x="8" y="8" width="16" height="16" rx="3" fill="#5e616e" />
    <text
      x="40"
      y="22"
      fill="#777a88"
      fontSize="15"
      fontWeight="500"
      fontFamily="Inter, sans-serif"
    >
      Vitalix
    </text>
  </svg>
);

const LOGOS = [LogoA, LogoB, LogoC, LogoD, LogoE, LogoF, LogoG, LogoH];

const Hero: React.FC = () => {
  return (
    <section className="hero overflow-hidden bg-gray-8 pb-[72px] pt-[84px]">
      <div className="container-md">
        {/* Main hero row */}
        <div className="flex min-h-[468px] justify-between max-lg:flex-wrap max-lg:justify-center">
          {/* Left — text */}
          <div className="max-w-lg shrink-0 pt-[93px] max-xl:max-w-md max-lg:w-full max-lg:max-w-full max-lg:pt-0 max-lg:pl-8 max-md:pl-0">
            <h1 className="font-title fs-64 font-medium leading-none tracking-tighter text-white max-xl:!text-[56px] max-lg:max-w-lg max-lg:!text-[48px] max-lg:leading-snug max-lg:tracking-tight max-md:!text-[36px] max-md:leading-none">
              Building AI-Powered HealthTech
            </h1>

            <p className="mt-3 fs-15 leading-snug tracking-tight text-gray-90 max-md:pr-5">
              In-house and as partners — we build health, fitness, and wellness
              platforms powered by AI. One vision, one craft, one standard
            </p>

            <div className="mt-9 flex items-center gap-x-6 max-xl:mt-8 max-lg:mt-6 max-lg:gap-x-5 max-md:flex-wrap max-md:gap-y-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-200 rounded-full h-[46px] px-8 text-[16px] text-white min-w-[148px] max-lg:h-[38px] max-lg:min-w-[122px] max-lg:px-6 max-lg:text-[14px]"
                style={{ background: "var(--button-blue)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--button-light-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--button-blue)")
                }
              >
                <span>Let&apos;s build together</span>
              </a>

              <Link
                href="#case-studies"
                className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-98 hover:text-gray-70 rounded-sm"
              >
                <span>Explore projects</span>
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

          {/* Right — asset */}
          <div className="relative max-lg:mt-[35px] max-md:mt-[59px] max-md:aspect-[320/266] max-md:h-auto max-md:w-full">
            <Image
              src="/hero/grid.webp"
              alt=""
              aria-hidden
              width={1667}
              height={452}
              priority
              className="pointer-events-none absolute right-[-23px] top-[47px] max-w-none max-xl:right-[-214px] max-xl:top-[18px] max-lg:right-[-272px] max-lg:top-[25px] max-lg:h-[386px] max-lg:w-auto max-md:right-[-45%] max-md:top-[-8%] max-md:h-[109%]"
              style={{ color: "transparent" }}
            />
            <Image
              src="/hero/hero_asset.webp"
              alt="3D molecular structure"
              width={780}
              height={550}
              priority
              className="pointer-events-none relative -left-3 max-w-none max-xl:left-0 max-xl:top-3 max-xl:h-auto max-xl:w-[672px] max-lg:top-[71px] max-lg:w-[514px] max-[1023px]:top-0 max-[1023px]:w-[640px] max-md:left-[-14%] max-md:w-[118%]"
              style={{ color: "transparent" }}
            />
          </div>
        </div>

        {/* Logo carousel */}
        <div className="mt-[89px] w-full max-xl:mt-16 max-lg:mt-[50px] max-lg:mx-auto max-lg:max-w-[962px] max-[1023px]:mt-12 max-[1023px]:px-16 max-md:mt-[46px] max-md:px-5">
          <div className="logos logos-sides-fade grow">
            <ul className="logos-content shrink-0 items-center">
              {LOGOS.map((Logo, i) => (
                <li key={i} className="shrink-0">
                  <Logo />
                </li>
              ))}
            </ul>
            <ul
              className="logos-content shrink-0 items-center"
              aria-hidden="true"
            >
              {LOGOS.map((Logo, i) => (
                <li key={`dup-${i}`} className="shrink-0">
                  <Logo />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
