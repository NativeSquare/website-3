"use client";

import Image from "next/image";
import Link from "next/link";

const BOOKING_URL = "https://cal.com/nativesquare-office-orlgbk/30min";

/* Logo components — white versions for dark bg */
const LogoCadence = () => (
  <div className="flex items-center gap-2 opacity-40">
    <Image
      src="/logos/cadence.png"
      alt="Cadence"
      width={32}
      height={32}
      className="h-7 w-7 rounded-md"
      style={{ filter: "grayscale(1) brightness(2)" }}
    />
    <span className="text-[17px] font-bold tracking-[-0.04em] text-white">
      cadence
    </span>
  </div>
);

const LogoFoundersFactory = () => (
  <Image
    src="/logos/founders-factory.svg"
    alt="Founders Factory"
    width={180}
    height={58}
    className="h-9 w-auto opacity-40"
  />
);

const LogoRYB = () => (
  <Image
    src="/logos/ryb.svg"
    alt="RYB"
    width={35}
    height={24}
    className="h-7 w-auto"
    style={{ filter: "brightness(0) invert(1)", opacity: 0.4 }}
  />
);

const LogoStackUp = () => (
  <span className="text-[17px] font-bold tracking-tight text-white/40 whitespace-nowrap uppercase">
    StackUp
  </span>
);

const LogoVerbrio = () => (
  <Image
    src="/logos/verbrio.avif"
    alt="Verbrio"
    width={120}
    height={40}
    className="h-8 w-auto"
    style={{ filter: "brightness(0) invert(1)", opacity: 0.4 }}
  />
);

const LogoSoma = () => (
  <span className="text-[17px] font-bold tracking-tight text-white/40 whitespace-nowrap uppercase">
    Soma
  </span>
);

const LOGOS = [
  () => <LogoCadence />,
  () => <LogoFoundersFactory />,
  () => <LogoRYB />,
  () => <LogoStackUp />,
  () => <LogoVerbrio />,
  () => <LogoSoma />,
];

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
              In-house and as partners. Same vision, same craft.
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
