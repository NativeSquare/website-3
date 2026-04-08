"use client";

import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const cases = [
  {
    title: "Doctr",
    tag: "Health Platform",
    description:
      "A comprehensive platform for Canadian healthcare providers. Streamlining patient management, appointments, and clinical workflows.",
    color: "#1a79ff",
  },
  {
    title: "Brain Analytics",
    tag: "Neuroscience",
    description:
      "Advanced sport and cognitive analytics platform powered by neuroscience. Measuring and improving athletic performance through brain data.",
    color: "#9e79ec",
  },
];

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

          {/* Cards — dark cards on light background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cases.map((c) => (
              <div
                key={c.title}
                className="group relative h-[380px] overflow-hidden rounded-lg bg-gray-5 p-8 flex flex-col justify-end transition-all duration-200 cursor-pointer hover:translate-y-[-2px]"
              >
                {/* Decorative header area */}
                <div className="absolute inset-0">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {Array.from({ length: 5 }).map((_, row) =>
                      Array.from({ length: 10 }).map((_, col) => (
                        <circle
                          key={`${row}-${col}`}
                          cx={`${8 + col * 10}%`}
                          cy={`${10 + row * 14}%`}
                          r="1"
                          fill="var(--gray-12)"
                          opacity="0.8"
                        />
                      ))
                    )}
                  </svg>
                  {/* Gradient fade to read text */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--gray-5) 35%, transparent 70%)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span
                    className="inline-block text-[12px] font-medium tracking-tight rounded-full px-3 py-1 mb-4"
                    style={{
                      color: c.color,
                      background: `${c.color}20`,
                    }}
                  >
                    {c.tag}
                  </span>
                  <h3 className="fs-24 font-medium leading-tight tracking-tight text-white mb-2">
                    {c.title}
                  </h3>
                  <p className="fs-15 leading-snug tracking-tight text-gray-60 mb-5">
                    {c.description}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
