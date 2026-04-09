"use client";

import Image from "next/image";
import Link from "next/link";

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

const projects = [
  {
    title: "Doctr — Clinical Platform",
    description: (
      <p>
        A comprehensive platform for{" "}
        <strong>Canadian healthcare providers</strong>. Streamlining patient
        management, appointments, and{" "}
        <strong>clinical workflows</strong> with regulatory compliance baked in.
      </p>
    ),
    details: [
      <p key="1">
        <strong>Patient management</strong> and appointment scheduling for
        multi-location clinics.
      </p>,
      <p key="2">
        <strong>HIPAA-compliant infrastructure</strong> handling sensitive
        clinical data at scale.
      </p>,
      <p key="3">
        <strong>Real-time availability</strong> system syncing across
        practitioners and locations.
      </p>,
    ],
    visual: {
      type: "branded" as const,
      bg: "#D63838",
      logo: "/logos/doctr-on-red.svg",
    },
    tags: ["React Native", "Node.js", "PostgreSQL", "HIPAA"],
  },
  {
    title: "Brain Analytics — Neuroscience Platform",
    description: (
      <p>
        Advanced <strong>sport and cognitive analytics</strong> platform powered
        by neuroscience. Measuring and improving athletic performance through{" "}
        <strong>brain data and EEG signals</strong>.
      </p>
    ),
    details: [
      <p key="1">
        <strong>Real-time EEG processing</strong> pipeline for cognitive load
        and focus metrics during training.
      </p>,
      <p key="2">
        <strong>Dashboard analytics</strong> for coaches and sports scientists
        to track athlete progression.
      </p>,
    ],
    visual: {
      type: "placeholder" as const,
      bg: "var(--gray-5)",
    },
    tags: ["Next.js", "Python", "ML/AI", "WebSocket"],
  },
];

const BOOKING_URL = "https://calendar.app.google/BFYre7dXNFCy6GfT6";

const CaseStudiesPage: React.FC = () => {
  return (
    <section
      className="pt-32 pb-24 max-xl:pt-[120px] max-[1023px]:pt-24"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
    >
      <div className="container-md max-[1023px]:max-w-3xl max-[1023px]:px-16 max-md:px-5">
        {/* Page heading */}
        <h1 className="max-w-2xl pl-24 font-title fs-64 font-medium leading-tight tracking-tighter max-xl:!text-[56px] max-[1023px]:pl-0 max-[1023px]:!text-[48px] max-[1023px]:leading-snug max-[1023px]:tracking-tight max-md:!text-[32px]">
          Case Studies
        </h1>
        <p className="mt-4 pl-24 fs-20 font-light leading-snug tracking-tight text-gray-30 max-w-xl max-[1023px]:pl-0 max-md:!text-[16px]">
          Real health platforms, built and shipped. Each project deepens our
          expertise in the sector.
        </p>

        {/* Projects */}
        {projects.map((project, idx) => (
          <div
            key={idx}
            className={`relative flex items-stretch gap-x-16 max-lg:items-start max-lg:justify-center max-lg:gap-x-8 max-[1023px]:flex-wrap ${
              idx === 0 ? "mt-16 max-lg:mt-12" : "mt-24 max-md:mt-14"
            }`}
          >
            {/* Visual */}
            <div className="aspect-[1.566] w-[736px] overflow-hidden rounded-[18px] max-[1023px]:rounded-2xl max-md:rounded-md max-lg:w-full">
              {project.visual.type === "branded" ? (
                <div
                  className="relative h-full w-full flex items-center justify-center"
                  style={{ background: project.visual.bg }}
                >
                  <Image
                    src={project.visual.logo!}
                    alt={project.title}
                    width={200}
                    height={85}
                    className="w-[200px] h-auto max-lg:w-[160px] max-md:w-[140px]"
                  />
                </div>
              ) : (
                <div
                  className="relative h-full w-full"
                  style={{ background: project.visual.bg }}
                >
                  {/* Decorative dot grid */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {Array.from({ length: 8 }).map((_, row) =>
                      Array.from({ length: 12 }).map((_, col) => (
                        <circle
                          key={`${row}-${col}`}
                          cx={`${6 + col * 8}%`}
                          cy={`${8 + row * 12}%`}
                          r="1"
                          fill="var(--gray-12)"
                          opacity="0.6"
                        />
                      ))
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="fs-32 font-medium tracking-tight text-gray-30">
                      {project.title.split(" — ")[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Text content */}
            <div className="flex min-h-full w-full max-w-sm flex-col justify-between pb-[30px] pt-5 max-lg:py-0 max-[1023px]:mt-8 max-[1023px]:grid max-[1023px]:w-full max-[1023px]:max-w-full max-[1023px]:grid-cols-2 max-md:mt-6 max-md:grid-cols-1">
              <div>
                <h2 className="font-title fs-40 font-medium leading-none tracking-tight max-lg:!text-[36px] max-[1023px]:!text-[32px] max-md:!text-[28px]">
                  {project.title}
                </h2>
                <div className="mt-4 fs-20 font-light leading-snug tracking-tight text-gray-20 max-lg:!text-[18px] max-[1023px]:mt-2 max-md:!text-[16px] [&_strong]:font-medium [&_strong]:text-gray-5">
                  {project.description}
                </div>

                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-94 px-3 py-1 text-[12px] font-medium tracking-tight text-gray-30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="max-lg:mt-8 max-[1023px]:mt-2.5 max-[1023px]:pl-8 max-md:mt-5 max-md:pl-0">
                <p className="font-medium leading-snug tracking-tight">
                  What we built
                </p>
                <ul className="mt-3 max-w-[352px] max-[1023px]:mt-2.5 max-md:mt-2 max-md:max-w-none">
                  {project.details.map((item, i) => (
                    <li
                      key={i}
                      className="mt-3 font-light leading-snug tracking-tight text-gray-20 first:mt-0 max-lg:mt-5 max-[1023px]:mt-3.5 max-md:mt-2.5 [&_strong]:font-medium [&_strong]:text-gray-5"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="mt-24 max-md:mt-16 text-center">
          <p className="fs-24 font-medium leading-snug tracking-tight text-gray-30 max-md:!text-[18px]">
            Want to see how we can help with your project?
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-5 max-md:flex-wrap max-md:gap-y-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-200 rounded-full h-[46px] px-8 text-[16px] text-white min-w-[148px] max-[1023px]:h-[38px] max-[1023px]:px-6 max-[1023px]:text-[14px]"
              style={{ background: "var(--button-blue)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--button-light-blue)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--button-blue)")
              }
            >
              Book a call
            </a>
            <Link
              href="/"
              className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)] rounded-sm"
            >
              <span>Back to home</span>
              <ArrowChevron />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesPage;
