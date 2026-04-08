"use client";

import Link from "next/link";

/* Decorative SVG illustrations for each card */
const IllustrationBuild = () => (
  <svg width="389" height="242" viewBox="0 0 389 242" fill="none">
    {/* Molecular network */}
    <circle cx="195" cy="90" r="60" stroke="#2e3038" strokeWidth="1.5" fill="none" />
    <circle cx="195" cy="90" r="35" stroke="#2e3038" strokeWidth="1" fill="none" strokeDasharray="3 4" />
    <ellipse cx="195" cy="120" rx="120" ry="50" stroke="#2e3038" strokeWidth="0.8" fill="none" strokeDasharray="4 6" />
    {/* Nodes and connections */}
    <line x1="140" y1="60" x2="195" y2="90" stroke="#2e3038" strokeWidth="1" />
    <line x1="195" y1="90" x2="260" y2="70" stroke="#2e3038" strokeWidth="1" />
    <line x1="195" y1="90" x2="170" y2="140" stroke="#2e3038" strokeWidth="1" />
    <line x1="195" y1="90" x2="240" y2="130" stroke="#2e3038" strokeWidth="1" />
    <line x1="260" y1="70" x2="310" y2="50" stroke="#2e3038" strokeWidth="0.8" />
    <line x1="140" y1="60" x2="100" y2="40" stroke="#2e3038" strokeWidth="0.8" />
    <circle cx="195" cy="90" r="5" fill="#1a79ff" />
    <circle cx="140" cy="60" r="4" fill="#62bf59" />
    <circle cx="260" cy="70" r="4" fill="#62bf59" />
    <circle cx="170" cy="140" r="3.5" fill="#9e79ec" />
    <circle cx="240" cy="130" r="3.5" fill="#9e79ec" />
    <circle cx="310" cy="50" r="2.5" fill="#464853" />
    <circle cx="100" cy="40" r="2.5" fill="#464853" />
    {/* Labels */}
    <text x="205" y="87" fill="#5e616e" fontSize="9" fontFamily="Inter, sans-serif">Platform</text>
    <text x="110" y="55" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">API</text>
    <text x="268" y="67" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">Data</text>
    <text x="150" y="155" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">Mobile</text>
  </svg>
);

const IllustrationPartner = () => (
  <svg width="387" height="203" viewBox="0 0 387 203" fill="none">
    {/* Chart axes */}
    <line x1="50" y1="20" x2="50" y2="180" stroke="#2e3038" strokeWidth="1" />
    <line x1="50" y1="180" x2="350" y2="180" stroke="#2e3038" strokeWidth="1" />
    {/* Grid lines */}
    <line x1="50" y1="60" x2="350" y2="60" stroke="#2e3038" strokeWidth="0.5" strokeDasharray="3 5" />
    <line x1="50" y1="100" x2="350" y2="100" stroke="#2e3038" strokeWidth="0.5" strokeDasharray="3 5" />
    <line x1="50" y1="140" x2="350" y2="140" stroke="#2e3038" strokeWidth="0.5" strokeDasharray="3 5" />
    {/* Axis labels */}
    <text x="30" y="63" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">100</text>
    <text x="35" y="103" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">50</text>
    <text x="42" y="183" fill="#5e616e" fontSize="8" fontFamily="Inter, sans-serif">0</text>
    {/* Rising curve */}
    <path d="M70 165 Q120 160 160 145 T240 100 T310 45" stroke="#1a79ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Data cluster */}
    <circle cx="280" cy="60" r="4" fill="#1a79ff" opacity="0.8" />
    <circle cx="290" cy="55" r="3.5" fill="#1a79ff" opacity="0.7" />
    <circle cx="275" cy="52" r="3" fill="#1a79ff" opacity="0.6" />
    <circle cx="295" cy="48" r="3.5" fill="#1a79ff" opacity="0.8" />
    <circle cx="285" cy="45" r="3" fill="#1a79ff" opacity="0.7" />
    <circle cx="300" cy="55" r="2.5" fill="#1a79ff" opacity="0.5" />
    <circle cx="270" cy="58" r="2.5" fill="#1a79ff" opacity="0.5" />
    {/* Reference dots on curve */}
    <circle cx="160" cy="145" r="3" fill="white" stroke="#2e3038" strokeWidth="1" />
    <circle cx="240" cy="100" r="3" fill="white" stroke="#2e3038" strokeWidth="1" />
  </svg>
);

const IllustrationShip = () => (
  <svg width="392" height="229" viewBox="0 0 392 229" fill="none">
    {/* Diagonal dashed lines pattern */}
    {Array.from({ length: 8 }).map((_, i) => (
      <line
        key={i}
        x1={40 + i * 45}
        y1="20"
        x2={40 + i * 45 - 60}
        y2="210"
        stroke="#2e3038"
        strokeWidth="1.5"
        strokeDasharray="8 12"
      />
    ))}
    {/* Horizontal center line */}
    <line x1="20" y1="115" x2="370" y2="115" stroke="#2e3038" strokeWidth="1.5" strokeDasharray="10 8" />
    {/* Focus circle */}
    <circle cx="300" cy="80" r="12" stroke="#464853" strokeWidth="1" fill="none" />
    <circle cx="300" cy="80" r="4" fill="#fead34" />
    {/* Small accent dots */}
    <circle cx="120" cy="95" r="2" fill="#464853" />
    <circle cx="200" cy="130" r="2" fill="#464853" />
    <circle cx="80" cy="150" r="1.5" fill="#464853" />
    <circle cx="340" cy="140" r="1.5" fill="#464853" />
  </svg>
);

const cards = [
  {
    title: "We build our own health platforms",
    description:
      "We don't just consult — we ship our own products. Cadence, our AI running coach, is proof that we understand health tech from the inside.",
    cta: { label: "Explore Cadence", href: "#products" },
    Illustration: IllustrationBuild,
    illustrationClass: "absolute right-[3px] top-0",
  },
  {
    title: "Domain expertise is our moat",
    description:
      "Health data regulations, device API integrations, clinical workflows — we've built for all of it. That depth is what sets us apart from generalist agencies.",
    cta: { label: "Our approach", href: "#studio" },
    Illustration: IllustrationPartner,
    illustrationClass: "absolute top-0 left-[5px]",
  },
  {
    title: "Accelerate your path to market",
    description:
      "From strategy to App Store. Our spec-driven methodology gets health products shipped faster, with regulatory awareness baked in from day one.",
    cta: { label: "How we work", href: "#case-studies" },
    Illustration: IllustrationShip,
    illustrationClass: "absolute top-0 left-0",
  },
];

const WhatWeDo: React.FC = () => {
  return (
    <div className="container-md mt-[89px] max-xl:mt-16 max-lg:mt-[50px] max-[1023px]:mt-12 max-[1023px]:px-16 max-md:mt-[46px] max-md:px-5">
      <ul className="flex justify-center gap-x-5 max-lg:gap-x-4 max-[1023px]:grid max-[1023px]:auto-cols-fr max-[1023px]:grid-cols-2 max-[1023px]:gap-3.5 max-md:grid-cols-1 max-md:gap-4">
        {cards.map((card, idx) => (
          <li
            key={idx}
            className={`relative h-[445px] w-1/3 max-w-full overflow-hidden rounded-lg bg-gray-12 p-6 max-xl:h-[428px] max-xl:p-5 max-lg:h-[402px] max-md:h-[371px] max-md:pb-4 max-md:pt-3 ${
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
              <h2 className="line-clamp-3 fs-24 font-medium leading-tight tracking-tight text-white max-lg:!text-[20px] max-[1023px]:line-clamp-none max-[1023px]:max-w-xs max-md:max-w-full max-md:!text-[18px]">
                {card.title}
              </h2>
              <p className="mt-2 line-clamp-3 h-[68px] leading-snug tracking-tight text-gray-70 max-xl:mt-1.5 max-lg:mt-2.5 max-[1023px]:mt-3 max-[1023px]:line-clamp-none max-[1023px]:h-[88px] max-[1023px]:max-w-xs max-md:mt-1.5 max-md:h-auto max-md:max-w-full">
                {card.description}
              </p>
              <div className="mt-5 flex gap-x-7 max-xl:mt-5 max-lg:gap-x-[15px] max-md:flex-wrap max-md:gap-y-1.5">
                <Link
                  href={card.cta.href}
                  className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-98 hover:text-gray-70 rounded-sm"
                >
                  <span>{card.cta.label}</span>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatWeDo;
