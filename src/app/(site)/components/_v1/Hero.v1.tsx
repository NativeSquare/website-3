"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO_URL } from "../data/config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const LOGO_BRANDS = [
  { name: "ORLT", className: "font-bold tracking-[0.25em] text-[17px] uppercase" },
  { name: "nexus", className: "font-light text-[28px] tracking-wide" },
  { name: "Velum", className: "font-bold italic text-[28px]" },
  { name: "Picto", className: "font-serif italic text-[28px] tracking-wide" },
  { name: "Dango", className: "font-serif italic text-[28px]" },
  { name: "BRIND", className: "font-bold tracking-[0.3em] text-[17px] uppercase" },
];

const Hero: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0);

  return (
    <section className="relative bg-[#07070a] overflow-hidden" style={{ height: "710px" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-background.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: "url(/hero/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content — Figma: Hero Container at x:352, y:0, 1216x572 */}
      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-[1216px] h-full px-6 lg:px-8 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Main grid — no extra padding, exact Figma positions */}
        <div className="grid grid-cols-1 lg:grid-cols-[576px_1fr] gap-10 lg:gap-0">
          {/* Left — Text content */}
          {/* Figma: Right Container at y:123, h:449 */}
          <div className="order-2 lg:order-1 flex flex-col" style={{ paddingTop: "123px" }}>
            {/* H1 — Figma: 60px, lh 60px, ls -1.5px, gradient, weight 400 */}
            <h1
              className="text-[clamp(2.5rem,5.5vw,60px)] font-normal tracking-[-1.5px] bg-clip-text text-transparent overflow-visible pb-1"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #f5f5f5 0%, #e5e5e5 50%, #a3a3a3 100%)",
                lineHeight: "60px",
              }}
            >
              Empower ambition.
              <br />
              Engineer success.
            </h1>

            {/* Body — Figma: y:148 from heading top, 17.9px, lh 28px, ls -0.45px */}
            <p
              className="max-w-[505px] text-[clamp(15px,1.3vw,17.9px)] leading-[28px] tracking-[-0.45px]"
              style={{
                color: "rgba(212, 212, 212, 0.9)",
                marginTop: "28px",
              }}
            >
              We craft high-performance software solutions and cutting-edge
              applications that empower businesses to scale and succeed in the
              digital landscape.
            </p>

            {/* Social proof — Figma: y:260 from Right Container top = 260-148-84=28px gap */}
            <div style={{ marginTop: "28px" }}>
              {/* Label — Figma: 12px, lh 16px, ls -0.3px, rgba(255,255,255,0.85), y offset 16px */}
              <p
                className="text-[12px] leading-[16px] tracking-[-0.3px] uppercase"
                style={{ color: "rgba(255, 255, 255, 0.85)", marginBottom: "28px" }}
              >
                Already approuved by enterprises and entrepreneurs
              </p>

              {/* Upwork rating — Figma: y:320, logo 55x39, stars 23x23 */}
              <div className="flex items-center gap-4">
                <Image
                  src="/hero/upwork-logo.svg"
                  alt="Upwork"
                  width={55}
                  height={39}
                  className="flex-shrink-0"
                />
                <div className="flex flex-col gap-[2px]">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Image key={i} src="/hero/star.svg" alt="" width={23} height={23} />
                    ))}
                  </div>
                  <p
                    className="text-[14px] leading-[20px] tracking-[-0.35px] bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(90deg, #f8f5f5 0%, #bababa 100%)",
                    }}
                  >
                    5 stars rating on{" "}
                    <span className="underline decoration-solid underline-offset-[3px]">
                      upwork
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs — Figma: y:390 from Right Container top */}
            <div className="flex items-center gap-4" style={{ marginTop: "28px" }}>
              {/* Book a call — white bg, gradient border frame */}
              <Link
                href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                className="relative inline-flex rounded-full p-[1px] overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(161, 166, 191, 0.7) 0%, rgba(161, 166, 191, 0) 100%)",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(96deg, rgba(94,97,110,0) 3%, rgba(94,97,110,1) 26%, rgba(94,97,110,0) 41%, rgba(94,97,110,0) 62%, rgba(94,97,110,1) 77%, rgba(94,97,110,0) 96%), linear-gradient(90deg, rgba(94,97,110,0.4), rgba(94,97,110,0.4))",
                  }}
                />
                <span className="relative rounded-full bg-white px-[16px] py-[8px] text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-[#08080a] group-hover:bg-gray-100 transition-colors">
                  Book a call
                </span>
              </Link>

              {/* Explore our work — Figma: 14px, #d4d4d4 */}
              <Link
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[14px] leading-[20px] tracking-[-0.35px] text-[#d4d4d4] hover:text-white transition-colors duration-300"
              >
                Explore our work
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Right — Video asset */}
          {/* Figma: Hero asset at x:705, y:41, 527x382 */}
          <div
            className="order-1 lg:order-2 relative flex items-start justify-end"
            style={{ paddingTop: "41px" }}
          >
            <div className="relative w-[527px] max-w-full">
              {/* Glow behind video */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <div
                  className="w-[90%] h-[70%] rounded-full blur-[100px] opacity-40"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.6) 0%, rgba(236, 72, 153, 0.35) 40%, transparent 70%)",
                  }}
                />
              </div>

              {/* Video — Figma: mix-blend-lighten + soft elliptical mask
                  Figma mask: blurred ellipse (rx=263.5, ry=191, blur=38.5)
                  on a 681x536 canvas for a 527x395 video.
                  Reproduced as a very soft radial-gradient mask */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="relative w-full h-auto mix-blend-lighten"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 77% 72% at 50% 51%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 77% 72% at 50% 51%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 65%, transparent 80%)",
                }}
              >
                <source src="/hero/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Logo carousel — Figma: at y:486, starting at x:563 within container */}
        <div className="absolute bottom-[138px] left-6 lg:left-8 right-0 flex items-center">
          <div className="hidden lg:block flex-shrink-0" style={{ width: "480px" }} />

          <div className="flex-1 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#07070a]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#07070a]/80 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-scroll-logos gap-16 items-center py-4">
              {[...LOGO_BRANDS, ...LOGO_BRANDS, ...LOGO_BRANDS].map((brand, i) => (
                <span
                  key={`${brand.name}-${i}`}
                  className={`select-none whitespace-nowrap flex-shrink-0 ${brand.className}`}
                  style={{
                    color: `rgba(255, 255, 255, ${0.35 + (i % LOGO_BRANDS.length) * 0.07})`,
                  }}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
