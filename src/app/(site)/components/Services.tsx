"use client";

import Link from "next/link";

/* Gradient horizontal divider */
const HDivider = ({ className = "" }: { className?: string }) => (
  <li
    className={`col-span-3 h-px rotate-180 max-md:hidden ${className}`}
    style={{
      background:
        "linear-gradient(270deg, rgba(212,214,221,0) 1.4%, #D4D6DD 40.2%, rgba(212,214,221,0) 93.23%)",
    }}
    aria-hidden
  />
);

const Services: React.FC = () => {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
    >
      <div className="container-sm max-lg:max-w-5xl max-lg:pl-7 max-[1023px]:pl-16 max-md:px-5">
        {/* Section title */}
        <h2 className="max-w-[346px] font-title fs-64 font-medium leading-snug tracking-tighter max-xl:pl-9 max-xl:!text-[56px] max-[1023px]:pl-8 max-[1023px]:!text-[48px] max-[1023px]:tracking-tight max-md:pl-0 max-md:!text-[32px] max-md:leading-tight">
          How We Work
        </h2>

        {/* Bento grid */}
        <ul className="relative mt-[25px] grid grid-cols-[352px_352px_448px] max-lg:mt-[33px] max-lg:grid-cols-[292px_320px_352px] max-[1023px]:mt-7 max-[1023px]:grid-cols-[289px_288px_128px] max-md:mt-2.5 max-md:grid-cols-1">
          {/* Top row absolute line */}
          <li
            className="absolute left-0 top-0 h-px w-full rotate-180 max-md:hidden"
            style={{
              background:
                "linear-gradient(270deg, rgba(212,214,221,0) 1.05%, #D4D6DD 30.17%, rgba(212,214,221,0) 69.97%)",
            }}
            aria-hidden
          />

          {/* Row 1: col 1 */}
          <li
            className="pb-[33px] pt-[47px] max-lg:pl-9 max-lg:py-6 max-[1023px]:pl-8 max-[1023px]:pt-5 max-[1023px]:pb-[22px] max-[1023px]:-order-10 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
            style={{
              borderRight: "1px solid transparent",
              borderImage:
                "linear-gradient(180deg, #D4D6DD 0%, #DFE1E6 100%) 1/1/0 stretch",
            }}
          >
            <div className="max-w-64 max-lg:max-w-[232px] max-[1023px]:max-w-[236px] max-md:max-w-none">
              <h3 className="fs-20 font-medium leading-snug tracking-tighter opacity-80 max-md:!text-[16px] max-md:leading-none max-md:tracking-tight">
                Product Strategy
              </h3>
              <p className="mt-2.5 fs-15 leading-snug tracking-tight text-gray-30 max-[1023px]:mt-2">
                From concept to spec. We define your health product&apos;s MVP, user flows, and technical architecture.
              </p>
            </div>
          </li>

          {/* Row 1: col 2+3 */}
          <li
            className="col-span-2 pb-[33px] pt-[47px] pl-10 max-lg:pl-6 max-lg:py-6 max-[1023px]:px-5 max-[1023px]:pt-5 max-[1023px]:pb-[22px] max-[1023px]:-order-9 max-md:col-span-1 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
          >
            <div className="max-w-64 max-lg:max-w-[244px] max-md:max-w-none">
              <h3 className="fs-20 font-medium leading-snug tracking-tighter opacity-80 max-md:!text-[16px] max-md:leading-none max-md:tracking-tight">
                Full-Stack Development
              </h3>
              <p className="mt-2.5 fs-15 leading-snug tracking-tight text-gray-30 max-[1023px]:mt-2">
                React Native, Next.js, Node.js, AI/ML — modern stacks built for health data at scale.
              </p>
            </div>
          </li>

          <HDivider className="max-[1023px]:-order-8" />

          {/* Row 2: Big feature — Spec-Driven Development */}
          <li
            className="max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
            style={{
              borderRight: "1px solid transparent",
              borderImage:
                "linear-gradient(180deg, #DFE1E6 0%, #F3F4F6 100%) 1/1/0 stretch",
            }}
          >
            {/* Placeholder visual */}
            <div className="w-full h-[221px] max-[1023px]:h-[231px] max-md:h-auto max-md:max-w-md max-md:mx-auto max-md:aspect-[40/21] bg-gray-94 rounded-lg flex items-center justify-center">
              <span className="fs-14 text-gray-50 font-medium tracking-tight">Visual placeholder</span>
            </div>
          </li>

          <li
            className="col-span-2 pt-12 pl-10 max-lg:pl-6 max-lg:pt-6 max-[1023px]:p-5 max-[1023px]:-order-6 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:col-span-1 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
          >
            <div className="max-w-[480px] max-[1023px]:max-w-[351px] max-md:max-w-none">
              <h3 className="font-title fs-64 font-medium leading-none tracking-tighter max-lg:!text-[56px] max-[1023px]:!text-[40px] max-[1023px]:leading-tight max-[1023px]:tracking-tight max-md:!text-[32px]">
                Spec-Driven Development
              </h3>
              <p className="mt-3.5 fs-28 leading-tight tracking-tighter text-gray-50 max-lg:mt-3 max-lg:!text-[24px] max-lg:leading-snug max-[1023px]:mt-2 max-[1023px]:!text-[18px] max-[1023px]:leading-tight max-[1023px]:tracking-tight max-md:!text-[15px] max-md:leading-snug">
                Vision, milestones, versioned specs, tasks. Full transparency at every stage — no black boxes.
              </p>
            </div>
            <ul className="mt-6 max-lg:mt-4 max-[1023px]:mt-3.5 flex w-full gap-x-6 max-[1023px]:flex-wrap max-[1023px]:gap-x-4 max-[1023px]:gap-y-1">
              {["Milestone planning", "Versioned specs", "Task tracking"].map(
                (label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="group inline-flex items-center font-medium tracking-tight transition-all duration-200 fs-15 leading-snug text-gray-5 hover:text-[var(--button-blue)] rounded-sm max-md:!text-[14px]"
                    >
                      <span>{label}</span>
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
                  </li>
                )
              )}
            </ul>
          </li>

          <HDivider className="max-[1023px]:-order-5" />

          {/* Row 3 */}
          <li
            className="pb-[33px] pt-[47px] max-lg:pl-9 max-lg:py-6 max-[1023px]:pl-8 max-[1023px]:py-5 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
            style={{
              borderRight: "1px solid #D5D7DE",
            }}
          >
            <div className="max-w-64 max-lg:max-w-56 max-[1023px]:max-w-64 max-md:max-w-none">
              <h3 className="fs-20 font-medium leading-snug tracking-tighter opacity-80 max-md:!text-[16px] max-md:leading-none max-md:tracking-tight">
                Regulatory Compliance
              </h3>
              <p className="mt-2.5 fs-15 leading-snug tracking-tight text-gray-30 max-[1023px]:mt-2">
                HIPAA, GDPR health provisions, HDS — compliance baked into architecture, not bolted on.
              </p>
            </div>
          </li>

          <li
            className="pb-[33px] pt-[47px] pl-10 max-lg:pl-6 max-lg:py-6 max-[1023px]:col-span-2 max-[1023px]:py-5 max-[1023px]:pl-5 max-md:col-span-1 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
            style={{
              borderRight: "1px solid transparent",
              borderImage:
                "linear-gradient(180deg, #E6E8EC 0%, #D5D7DE 100%) 1/1/0 stretch",
            }}
          >
            <div className="max-w-64 max-md:max-w-none">
              <h3 className="fs-20 font-medium leading-snug tracking-tighter opacity-80 max-md:!text-[16px] max-md:leading-none max-md:tracking-tight">
                Device Integrations
              </h3>
              <p className="mt-2.5 fs-15 leading-snug tracking-tight text-gray-30 max-[1023px]:mt-2">
                Garmin, Apple HealthKit, medical devices — we handle the complex APIs so you don&apos;t have to.
              </p>
            </div>
          </li>

          <li
            className="pb-[33px] pt-[47px] pl-10 max-lg:pl-6 max-lg:py-6 max-[1023px]:col-span-2 max-[1023px]:-order-1 max-[1023px]:py-6 max-[1023px]:pl-5 max-md:col-span-1 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
          >
            <div className="max-w-[236px] max-md:max-w-none">
              <h3 className="fs-20 font-medium leading-snug tracking-tighter opacity-80 max-md:!text-[16px] max-md:leading-none max-md:tracking-tight">
                Launch & Scale
              </h3>
              <p className="mt-2.5 fs-15 leading-snug tracking-tight text-gray-30 max-[1023px]:mt-2">
                From beta to App Store. Go-to-market strategy for health products that actually ship.
              </p>
            </div>
          </li>

          <HDivider />

          {/* Row 4: Big feature — Security */}
          <li
            className="col-span-2 pt-10 max-lg:pl-9 max-lg:py-6 max-[1023px]:pl-8 max-[1023px]:py-5 max-md:col-span-1 max-md:px-0 max-md:pb-[19px] max-md:pt-4.5 max-md:relative max-md:after:absolute max-md:after:bottom-0 max-md:after:left-0 max-md:after:h-px max-md:after:w-full max-md:after:bg-[linear-gradient(270deg,rgba(212,214,221,0)_1.57%,#D4D6DD_22.23%,#D4D6DD_60.66%,rgba(212,214,221,0)_95.45%)]"
            style={{
              borderRight: "1px solid transparent",
              borderImage:
                "linear-gradient(180deg, rgba(212,214,221,0.5) 4.23%, #D4D6DD 17.6%, #D4D6DD 100%) 1/1/0 stretch",
            }}
          >
            <div className="max-w-[487px] max-lg:max-w-[415px] max-[1023px]:max-w-[332px] max-md:max-w-none">
              <h3 className="font-title fs-64 font-medium leading-none tracking-tighter max-lg:!text-[56px] max-[1023px]:!text-[40px] max-[1023px]:leading-tight max-[1023px]:tracking-tight max-md:!text-[32px]">
                Security First
              </h3>
              <p className="mt-3.5 fs-28 leading-tight tracking-tighter text-gray-50 max-lg:mt-3 max-lg:!text-[24px] max-lg:leading-snug max-[1023px]:mt-2 max-[1023px]:!text-[18px] max-[1023px]:leading-tight max-[1023px]:tracking-tight max-md:!text-[15px] max-md:leading-snug">
                Health data demands the highest standard. We build with encryption, access control, and audit trails from day one.
              </p>
            </div>
          </li>

          <li className="max-md:hidden">
            {/* Placeholder visual for security */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[145px] h-[200px] max-lg:h-[180px] max-[1023px]:h-[150px] bg-gray-94 rounded-lg flex items-center justify-center">
                <span className="fs-13 text-gray-50 font-medium tracking-tight text-center">Visual</span>
              </div>
            </div>
          </li>

          {/* Bottom line */}
          <li
            className="absolute bottom-0 left-0 h-px w-full rotate-180 max-[1023px]:hidden"
            style={{
              background:
                "linear-gradient(270deg, rgba(212,214,221,0) 21.32%, #D4D6DD 70.1%, rgba(212,214,221,0) 94.1%)",
            }}
            aria-hidden
          />
        </ul>
      </div>
    </section>
  );
};

export default Services;
