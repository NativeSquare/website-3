"use client";

import Link from "next/link";

/* Arrow chevron component reused across CTAs */
const ArrowChevron = () => (
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
);

/* Placeholder for interactive canvas / image — gray-5 rounded box */
const VisualPlaceholder = () => (
  <div className="aspect-[1.566] w-[736px] overflow-hidden rounded-[18px] max-[1023px]:rounded-2xl max-md:rounded-md max-lg:w-full">
    <div className="relative h-full w-full bg-gray-5">
      {/* Decorative dots grid */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={`${8 + col * 10}%`}
              cy={`${12 + row * 16}%`}
              r="1.5"
              fill="var(--gray-20)"
              opacity="0.5"
            />
          ))
        )}
        {/* Accent elements */}
        <circle cx="70%" cy="35%" r="4" fill="#1a79ff" opacity="0.6" />
        <circle cx="30%" cy="60%" r="3" fill="#62bf59" opacity="0.5" />
        <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="var(--gray-20)" strokeWidth="0.5" strokeDasharray="4 6" />
      </svg>
    </div>
  </div>
);

const sections = [
  {
    title: "Cadence — AI Running Coach",
    description: (
      <p>
        Our flagship product. A <strong>personalized AI training companion</strong> that adapts to your body, your schedule, and your goals. Built with{" "}
        <strong>real-time biomechanical analysis</strong> and science-backed progression methodology.
      </p>
    ),
    builtWith: [
      <p key="1">
        <strong>Adaptive training plans</strong> that respond to fatigue, recovery, and performance data in real-time.
      </p>,
      <p key="2">
        <strong>Garmin &amp; Apple HealthKit integrations</strong> for seamless data collection across devices.
      </p>,
    ],
    cta: { label: "Learn more", href: "#products" },
  },
  {
    title: "Health platforms, built to last",
    description: (
      <p>
        We bring <strong>regulatory-aware engineering</strong> to every project — HIPAA, GDPR health provisions, HDS compliance baked in from day one. Our{" "}
        <strong>spec-driven methodology</strong> gives you full visibility from vision to deployment.
      </p>
    ),
    builtWith: [
      <p key="1">
        <strong>Patient management platforms</strong> for healthcare providers handling sensitive clinical data.
      </p>,
      <p key="2">
        <strong>Sport &amp; cognitive analytics tools</strong> powered by neuroscience and real-time biometric data.
      </p>,
    ],
    cta: { label: "See our work", href: "#case-studies" },
  },
];

const verticals = [
  { label: "Digital Health", color: "#D22D2D" },
  { label: "Fitness & Wellness", color: "#62BF59" },
  { label: "MedTech", color: "#1A79FF" },
  { label: "Biotech", color: "#9E79EC" },
  { label: "Sport Analytics", color: "#73B5F2" },
  { label: "Mental Health", color: "#D973CE" },
  { label: "Clinical Trials", color: "#FEAD34" },
];

const ProductShowcase: React.FC = () => {
  return (
    <section
      id="products"
      className="pt-32 pb-24 max-xl:pt-[120px] max-[1023px]:pt-20"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
    >
      <div className="container-md max-[1023px]:max-w-3xl max-[1023px]:px-16 max-md:px-5">
        {/* Section heading */}
        <h2 className="max-w-lg pl-24 font-title fs-64 font-medium leading-tight tracking-tighter max-xl:!text-[56px] max-[1023px]:max-w-[323px] max-[1023px]:pl-0 max-[1023px]:!text-[48px] max-[1023px]:leading-snug max-[1023px]:tracking-tight max-md:max-w-[220px] max-md:!text-[32px]">
          What We Build
        </h2>

        {/* Block 1 — Cadence */}
        <div className="relative flex items-stretch gap-x-16 max-lg:items-start max-lg:justify-center max-lg:gap-x-8 max-[1023px]:mt-9 max-[1023px]:flex-wrap mt-12 max-lg:mt-10">
          <VisualPlaceholder />

          <div className="flex min-h-full w-full max-w-sm flex-col justify-between pb-[30px] pt-5 max-lg:py-0 max-[1023px]:mt-8 max-[1023px]:grid max-[1023px]:w-full max-[1023px]:max-w-full max-[1023px]:grid-cols-2 max-md:mt-6 max-md:grid-cols-1">
            <div>
              <h3 className="font-title fs-40 font-medium leading-none tracking-tight max-lg:!text-[36px] max-[1023px]:!text-[32px] max-md:!text-[28px]">
                {sections[0].title}
              </h3>
              <div className="mt-4 fs-20 font-light leading-snug tracking-tight text-gray-20 max-lg:!text-[18px] max-[1023px]:mt-2 max-md:!text-[16px] [&_strong]:font-medium [&_strong]:text-gray-5">
                {sections[0].description}
              </div>
              <Link
                href={sections[0].cta.href}
                className="group hidden max-[1023px]:mt-4 max-[1023px]:inline-flex max-md:hidden items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)]"
              >
                <span>{sections[0].cta.label}</span>
                <ArrowChevron />
              </Link>
            </div>
            <div className="max-lg:mt-8 max-[1023px]:mt-2.5 max-[1023px]:pl-8 max-md:mt-5 max-md:pl-0">
              <p className="font-medium leading-snug tracking-tight">
                What we&apos;ve built...
              </p>
              <ul className="mt-3 max-w-[352px] max-[1023px]:mt-2.5 max-md:mt-2 max-md:max-w-none">
                {sections[0].builtWith.map((item, i) => (
                  <li
                    key={i}
                    className="mt-3 font-light leading-snug tracking-tight text-gray-20 first:mt-0 max-lg:mt-5 max-[1023px]:mt-3.5 max-md:mt-2.5 [&_strong]:font-medium [&_strong]:text-gray-5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={sections[0].cta.href}
                className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)] mt-4 rounded-sm max-[1023px]:hidden max-md:mt-5 max-md:inline-flex"
              >
                <span>{sections[0].cta.label}</span>
                <ArrowChevron />
              </Link>
            </div>
          </div>
        </div>

        {/* Block 2 — Health platforms */}
        <div className="relative flex items-stretch gap-x-16 max-lg:items-start max-lg:justify-center max-lg:gap-x-8 max-[1023px]:mt-9 max-[1023px]:flex-wrap mt-20 max-md:mt-11">
          <VisualPlaceholder />

          <div className="flex min-h-full w-full max-w-sm flex-col justify-between pb-[30px] pt-5 max-lg:py-0 max-[1023px]:mt-8 max-[1023px]:grid max-[1023px]:w-full max-[1023px]:max-w-full max-[1023px]:grid-cols-2 max-md:mt-6 max-md:grid-cols-1">
            <div>
              <h3 className="font-title fs-40 font-medium leading-none tracking-tight max-lg:!text-[36px] max-[1023px]:!text-[32px] max-md:!text-[28px]">
                {sections[1].title}
              </h3>
              <div className="mt-4 fs-20 font-light leading-snug tracking-tight text-gray-20 max-lg:!text-[18px] max-[1023px]:mt-2 max-md:!text-[16px] [&_strong]:font-medium [&_strong]:text-gray-5">
                {sections[1].description}
              </div>
              <Link
                href={sections[1].cta.href}
                className="group hidden max-[1023px]:mt-4 max-[1023px]:inline-flex max-md:hidden items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)]"
              >
                <span>{sections[1].cta.label}</span>
                <ArrowChevron />
              </Link>
            </div>
            <div className="max-lg:mt-8 max-[1023px]:mt-2.5 max-[1023px]:pl-8 max-md:mt-5 max-md:pl-0">
              <p className="font-medium leading-snug tracking-tight">
                What we&apos;ve built...
              </p>
              <ul className="mt-3 max-w-[352px] max-[1023px]:mt-2.5 max-md:mt-2 max-md:max-w-none">
                {sections[1].builtWith.map((item, i) => (
                  <li
                    key={i}
                    className="mt-3 font-light leading-snug tracking-tight text-gray-20 first:mt-0 max-lg:mt-5 max-[1023px]:mt-3.5 max-md:mt-2.5 [&_strong]:font-medium [&_strong]:text-gray-5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={sections[1].cta.href}
                className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)] mt-4 rounded-sm max-[1023px]:hidden max-md:mt-5 max-md:inline-flex"
              >
                <span>{sections[1].cta.label}</span>
                <ArrowChevron />
              </Link>
            </div>
          </div>
        </div>

        {/* Vertical industries */}
        <h3 className="mt-12 fs-20 font-medium leading-none tracking-tighter max-lg:mt-10 max-lg:leading-snug max-[1023px]:mt-10 max-[1023px]:!text-[16px] max-[1023px]:leading-none max-[1023px]:tracking-tight max-md:mt-11">
          Industries We Serve
        </h3>
        <ul className="mt-4 flex flex-wrap gap-4 max-[1023px]:mt-5 max-md:gap-x-2">
          {verticals.map((v) => (
            <li key={v.label} className="flex items-center">
              <span className="inline-flex items-center gap-x-1.5 font-medium tracking-tight fs-14 leading-snug text-gray-5 h-11 rounded-full bg-gray-94 px-4.5 max-[1023px]:h-[42px] max-[1023px]:px-4 max-md:h-9">
                <span
                  className="w-[10px] h-[10px] rounded-full"
                  style={{ background: v.color }}
                />
                {v.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductShowcase;
