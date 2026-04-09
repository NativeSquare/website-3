"use client";

import Link from "next/link";

/* Decorative SVG illustrations for each card — with hover animations */
const IllustrationBuild = () => (
  <svg width="389" height="242" viewBox="0 0 389 242" fill="none" className="transition-transform duration-700 ease-out group-hover:scale-105">
    {/* Outer dashed orbit — rotates on hover */}
    <circle cx="195" cy="110" r="80" stroke="#2e3038" strokeWidth="0.8" fill="none" strokeDasharray="4 6"
      className="origin-[195px_110px] transition-transform duration-[2s] ease-out group-hover:rotate-[20deg]" />
    {/* Inner dashed orbit — counter-rotates */}
    <circle cx="195" cy="110" r="48" stroke="#2e3038" strokeWidth="0.8" fill="none" strokeDasharray="3 5"
      className="origin-[195px_110px] transition-transform duration-[2s] ease-out group-hover:-rotate-[15deg]" />
    {/* Connection lines */}
    <line x1="195" y1="110" x2="130" y2="65" stroke="#464853" strokeWidth="0.8" />
    <line x1="195" y1="110" x2="270" y2="72" stroke="#464853" strokeWidth="0.8" />
    <line x1="195" y1="110" x2="145" y2="160" stroke="#464853" strokeWidth="0.8" />
    <line x1="195" y1="110" x2="260" y2="155" stroke="#464853" strokeWidth="0.8" />
    <line x1="195" y1="110" x2="195" y2="32" stroke="#464853" strokeWidth="0.8" />
    <line x1="195" y1="110" x2="300" y2="118" stroke="#464853" strokeWidth="0.8" />
    {/* Central node — pulses on hover */}
    <circle cx="195" cy="110" r="8" fill="#1a79ff"
      className="transition-all duration-500 group-hover:r-[10] group-hover:opacity-90" />
    <circle cx="195" cy="110" r="8" fill="#1a79ff" opacity="0"
      className="transition-all duration-700 group-hover:opacity-20 group-hover:r-[16]" />
    {/* Orbital nodes */}
    <circle cx="130" cy="65" r="4.5" fill="#62bf59" className="transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
    <circle cx="270" cy="72" r="4" fill="#9e79ec" className="transition-opacity duration-500 delay-75 group-hover:opacity-100 opacity-70" />
    <circle cx="145" cy="160" r="4" fill="#fead34" className="transition-opacity duration-500 delay-100 group-hover:opacity-100 opacity-70" />
    <circle cx="260" cy="155" r="3.5" fill="#62bf59" className="transition-opacity duration-500 delay-150 group-hover:opacity-100 opacity-70" />
    <circle cx="195" cy="32" r="4" fill="#9e79ec" className="transition-opacity duration-500 delay-75 group-hover:opacity-100 opacity-70" />
    <circle cx="300" cy="118" r="3.5" fill="#fead34" className="transition-opacity duration-500 delay-100 group-hover:opacity-100 opacity-70" />
    {/* Atmosphere dots */}
    <circle cx="105" cy="42" r="1.5" fill="#464853" opacity="0.6" />
    <circle cx="320" cy="55" r="1.5" fill="#464853" opacity="0.5" />
    <circle cx="88" cy="130" r="1.5" fill="#464853" opacity="0.4" />
    <circle cx="310" cy="170" r="1.5" fill="#464853" opacity="0.5" />
    <circle cx="170" cy="200" r="1.5" fill="#464853" opacity="0.4" />
    <circle cx="230" cy="20" r="1.5" fill="#464853" opacity="0.5" />
    <circle cx="340" cy="90" r="1.5" fill="#464853" opacity="0.3" />
    {/* Labels */}
    <text x="107" y="60" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif"
      className="transition-opacity duration-500 group-hover:opacity-100 opacity-60">Product</text>
    <text x="278" y="69" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif"
      className="transition-opacity duration-500 group-hover:opacity-100 opacity-60">Data</text>
    <text x="200" y="30" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif"
      className="transition-opacity duration-500 group-hover:opacity-100 opacity-60">Users</text>
  </svg>
);

const IllustrationPartner = () => (
  <svg width="389" height="242" viewBox="0 0 389 242" fill="none" className="transition-transform duration-700 ease-out group-hover:scale-105">
    {/* Background dot grid */}
    {Array.from({ length: 7 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle
          key={`dot-${row}-${col}`}
          cx={75 + col * 28}
          cy={30 + row * 28}
          r="1"
          fill="#2e3038"
          opacity="0.5"
        />
      ))
    )}
    {/* Outer layer — expands slightly on hover */}
    <rect x="60" y="28" width="270" height="180" rx="12" stroke="#464853" strokeWidth="1" fill="none"
      className="transition-all duration-700 ease-out group-hover:stroke-[#5e616e]" />
    {/* Middle layer */}
    <rect x="100" y="58" width="190" height="120" rx="8" stroke="#464853" strokeWidth="0.8" fill="none"
      className="transition-all duration-700 delay-100 ease-out group-hover:stroke-[#5e616e]" />
    {/* Inner layer */}
    <rect x="140" y="88" width="110" height="60" rx="6" stroke="#464853" strokeWidth="0.8" fill="none"
      className="transition-all duration-700 delay-200 ease-out group-hover:stroke-[#62bf59] group-hover:opacity-80" />
    {/* Lock icons */}
    <circle cx="72" cy="40" r="4" stroke="#5e616e" strokeWidth="0.8" fill="none" />
    <rect x="69" y="42" width="6" height="5" rx="1" fill="#5e616e" />
    <circle cx="318" cy="40" r="4" stroke="#5e616e" strokeWidth="0.8" fill="none" />
    <rect x="315" y="42" width="6" height="5" rx="1" fill="#5e616e" />
    <circle cx="72" cy="196" r="4" stroke="#5e616e" strokeWidth="0.8" fill="none" />
    <rect x="69" y="198" width="6" height="5" rx="1" fill="#5e616e" />
    <circle cx="318" cy="196" r="4" stroke="#5e616e" strokeWidth="0.8" fill="none" />
    <rect x="315" y="198" width="6" height="5" rx="1" fill="#5e616e" />
    {/* Dashed data-flow lines */}
    <line x1="60" y1="90" x2="330" y2="90" stroke="#2e3038" strokeWidth="0.6" strokeDasharray="3 5" />
    <line x1="60" y1="118" x2="330" y2="118" stroke="#2e3038" strokeWidth="0.6" strokeDasharray="3 5" />
    <line x1="60" y1="146" x2="330" y2="146" stroke="#2e3038" strokeWidth="0.6" strokeDasharray="3 5" />
    {/* Green checkmarks — brighten on hover with stagger */}
    <circle cx="100" cy="90" r="2.5" fill="#62bf59" className="transition-all duration-500 opacity-50 group-hover:opacity-100" />
    <circle cx="195" cy="90" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-75 opacity-50 group-hover:opacity-100" />
    <circle cx="290" cy="90" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-150 opacity-50 group-hover:opacity-100" />
    <circle cx="140" cy="118" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-200 opacity-50 group-hover:opacity-100" />
    <circle cx="250" cy="118" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-300 opacity-50 group-hover:opacity-100" />
    <circle cx="100" cy="146" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-350 opacity-50 group-hover:opacity-100" />
    <circle cx="195" cy="146" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-[400ms] opacity-50 group-hover:opacity-100" />
    <circle cx="290" cy="146" r="2.5" fill="#62bf59" className="transition-all duration-500 delay-[450ms] opacity-50 group-hover:opacity-100" />
  </svg>
);

const IllustrationShip = () => (
  <svg width="389" height="242" viewBox="0 0 389 242" fill="none" className="transition-transform duration-700 ease-out group-hover:scale-105">
    {/* Diagonal dashed background lines */}
    {Array.from({ length: 6 }).map((_, i) => (
      <line
        key={i}
        x1={60 + i * 55}
        y1="10"
        x2={60 + i * 55 - 80}
        y2="230"
        stroke="#2e3038"
        strokeWidth="0.6"
        strokeDasharray="4 7"
      />
    ))}
    {/* Ascending curve */}
    <path
      d="M50 200 Q130 185 170 155 Q210 125 240 100 Q270 75 310 45"
      stroke="#464853"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      className="transition-all duration-700 group-hover:stroke-[#5e616e]"
    />
    {/* Milestone dots — slide up slightly on hover */}
    <circle cx="100" cy="190" r="4" fill="#1a79ff"
      className="transition-transform duration-500 group-hover:-translate-y-1" />
    <circle cx="170" cy="155" r="4" fill="#62bf59"
      className="transition-transform duration-500 delay-100 group-hover:-translate-y-1" />
    <circle cx="230" cy="108" r="4" fill="#1a79ff"
      className="transition-transform duration-500 delay-200 group-hover:-translate-y-1" />
    <circle cx="275" cy="68" r="4" fill="#62bf59"
      className="transition-transform duration-500 delay-300 group-hover:-translate-y-1" />
    {/* Orange accent at peak — grows on hover */}
    <circle cx="310" cy="45" r="5" fill="#fead34"
      className="transition-all duration-500 delay-[400ms] group-hover:opacity-100 opacity-80" />
    <circle cx="310" cy="45" r="5" fill="#fead34" opacity="0"
      className="transition-all duration-700 delay-[400ms] group-hover:opacity-15 group-hover:r-[12]" />
    {/* User cluster — fades in on hover */}
    <g className="transition-opacity duration-700 delay-300 opacity-40 group-hover:opacity-100">
      <circle cx="330" cy="38" r="2.5" fill="#1a79ff" />
      <circle cx="338" cy="34" r="2" fill="#1a79ff" />
      <circle cx="335" cy="42" r="2.5" fill="#1a79ff" />
      <circle cx="343" cy="38" r="2" fill="#1a79ff" />
      <circle cx="328" cy="30" r="2" fill="#1a79ff" />
      <circle cx="340" cy="28" r="1.5" fill="#1a79ff" />
      <circle cx="348" cy="33" r="1.5" fill="#1a79ff" />
      <circle cx="345" cy="44" r="1.5" fill="#1a79ff" />
    </g>
    {/* Labels */}
    <text x="87" y="210" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif"
      className="transition-opacity duration-500 opacity-60 group-hover:opacity-100">MVP</text>
    <text x="260" y="60" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif"
      className="transition-opacity duration-500 delay-200 opacity-60 group-hover:opacity-100">Launch</text>
  </svg>
);

const cards = [
  {
    title: "We build in the same space",
    description:
      "We\u2019re not outsiders. We build Cadence in-house \u2014 so we understand healthtech challenges from the inside. Skin in the game.",
    cta: { label: "Explore Cadence", href: "#products" },
    Illustration: IllustrationBuild,
    illustrationClass: "absolute right-[3px] top-0",
  },
  {
    title: "Compliant by architecture",
    description:
      "HIPAA, GDPR, HDS \u2014 not bolted on at the end. Security and compliance are baked into our infrastructure from day one.",
    cta: { label: "Our approach", href: "#studio" },
    Illustration: IllustrationPartner,
    illustrationClass: "absolute top-0 left-[5px]",
  },
  {
    title: "From zero to users",
    description:
      "From strategy to App Store. We\u2019ve shipped Cadence from concept to real users \u2014 and we do the same for our partners.",
    cta: { label: "How we work", href: "#case-studies" },
    Illustration: IllustrationShip,
    illustrationClass: "absolute top-0 left-0",
  },
];

const WhatWeDo: React.FC = () => {
  return (
    <div className="container-md mt-[89px] pb-24 max-xl:mt-16 max-lg:mt-[50px] max-lg:pb-20 max-[1023px]:mt-12 max-[1023px]:px-16 max-[1023px]:pb-16 max-md:mt-[46px] max-md:px-5 max-md:pb-12">
      <ul className="flex justify-center gap-x-5 max-lg:gap-x-4 max-[1023px]:grid max-[1023px]:auto-cols-fr max-[1023px]:grid-cols-2 max-[1023px]:gap-3.5 max-md:grid-cols-1 max-md:gap-4">
        {cards.map((card, idx) => (
          <li
            key={idx}
            className={`group relative h-[445px] w-1/3 max-w-full overflow-hidden rounded-lg bg-gray-12 p-6 max-xl:h-[428px] max-xl:p-5 max-lg:h-[402px] max-md:h-[371px] max-md:pb-4 max-md:pt-3 ${
              idx === 0
                ? "max-[1023px]:col-span-2 max-[1023px]:h-[216px] max-[1023px]:w-auto max-md:col-span-1"
                : "max-[1023px]:col-span-1 max-[1023px]:w-full"
            }`}
          >
            {/* Decorative illustration (absolute positioned) */}
            <div className={card.illustrationClass}>
              <card.Illustration />
            </div>
            {/* Gradient fade so text is readable */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, var(--gray-12) 35%, transparent 75%)",
              }}
            />

            {/* Content */}
            <div
              className={`relative z-10 flex h-full flex-col justify-end ${
                idx === 0
                  ? "max-[1023px]:justify-start max-[1023px]:pt-3 max-md:justify-end max-md:pt-0"
                  : ""
              }`}
            >
              <h2 className="fs-24 font-medium leading-tight tracking-tight text-white max-lg:!text-[20px] max-[1023px]:max-w-xs max-md:max-w-full max-md:!text-[18px]">
                {card.title}
              </h2>
              <p className="mt-2 leading-snug tracking-tight text-gray-70 max-xl:mt-1.5 max-lg:mt-2.5 max-[1023px]:mt-3 max-[1023px]:max-w-xs max-md:mt-1.5 max-md:max-w-full fs-15">
                {card.description}
              </p>
              <div className="mt-5 flex gap-x-7 max-xl:mt-5 max-lg:gap-x-[15px] max-md:flex-wrap max-md:gap-y-1.5">
                <Link
                  href={card.cta.href}
                  className="group/link inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-98 hover:text-gray-70 rounded-sm"
                >
                  <span>{card.cta.label}</span>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatWeDo;
