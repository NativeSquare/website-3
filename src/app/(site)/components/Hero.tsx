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
    <section className="relative bg-[var(--background)] overflow-hidden" style={{ minHeight: "760px" }}>
      {/* ─── Layer 0: Full-bleed background video (grayscale) ─── */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "grayscale(1) brightness(0.8)",
            opacity: 0.85,
          }}
        >
          <source src="/hero/glass-animation-loop.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to ensure readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(7,7,10,0.3) 0%, rgba(7,7,10,0.1) 40%, rgba(7,7,10,0.2) 100%)",
          }}
        />
      </div>

      {/* ─── Layer 1: Atmospheric glows ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[10%] -right-[5%] w-[60%] h-[70%] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute -bottom-[15%] -left-[10%] w-[45%] h-[50%] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-cyan), transparent 70%)",
            filter: "blur(150px)",
          }}
        />
      </div>

{/* Lines are rendered inside the content container to align with card edges */}

      {/* ─── Layer 3: Noise texture (global) ─── */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: "url(/hero/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ─── Layer 4: Content container ─── */}
      <div
        ref={ref}
        className={`relative mx-auto max-w-[1216px] h-full px-6 lg:px-8 pt-[100px] pb-[40px] transition-[opacity,transform] duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* ─── Frosted glass card — sharp corners, no overflow clip ─── */}
        <div className="relative">
          {/* Frosted glass — duplicated video with CSS blur */}
          {/* mask-image instead of overflow:hidden — Chrome clips overflow BEFORE filter, mask clips AFTER */}
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: "linear-gradient(black, black)",
              maskImage: "linear-gradient(black, black)",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover"
              style={{
                inset: "-20px",
                width: "calc(100% + 40px)",
                height: "calc(100% + 40px)",
                filter: "grayscale(1) brightness(0.6) blur(30px)",
                transform: "scale(1.15)",
              }}
            >
              <source src="/hero/glass-animation-loop.mp4" type="video/mp4" />
            </video>
            {/* Dark tint over the blurred video */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(8, 8, 14, 0.35)" }}
            />
          </div>

          {/* Pixel dot texture — masked brighter video copy so dots show real background colors */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              WebkitMaskImage: "url(/kpi/pixel-texture.png)",
              maskImage: "url(/kpi/pixel-texture.png)",
              WebkitMaskSize: "100px 100px",
              maskSize: "100px 100px" as string,
              WebkitMaskRepeat: "repeat",
              maskRepeat: "repeat" as string,
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover"
              style={{
                inset: "-20px",
                width: "calc(100% + 40px)",
                height: "calc(100% + 40px)",
                filter: "brightness(1.5) contrast(1.3) blur(8px)",
                transform: "scale(1.1)",
                opacity: 1,
              }}
            >
              <source src="/hero/glass-animation-loop.mp4" type="video/mp4" />
            </video>
            {/* Enlarged blurred copy of gradient bar — masked by pixel texture */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "2%",
                top: "32%",
                width: "55%",
                height: "20px",
                background: "linear-gradient(90deg, #ffcf8a 0%, #ff6b2c 15%, #ff4f6f 30%, #d946ef 45%, #8b5cf6 60%, #6366f1 75%, #3b82f6 100%)",
                filter: "blur(25px)",
                opacity: 0.8,
                transform: "scaleY(4) scaleX(1.2)",
              }}
            />
            {/* Enlarged blurred copy of CTA button — masked by pixel texture */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "4%",
                top: "80%",
                width: "18%",
                height: "40px",
                background: "linear-gradient(135deg, #5b9aff 0%, #3b82f6 50%, #2563eb 100%)",
                filter: "blur(25px)",
                opacity: 0.8,
                transform: "scale(1.8)",
                borderRadius: "10px",
              }}
            />
          </div>

          {/* Inner gradient for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 20%, transparent 50%, rgba(0,0,0,0.3) 100%)",
            }}
          />

          {/* Extending lines — card borders that overshoot corners */}
          {/* Top line */}
          <div
            className="absolute top-0 h-[1px] pointer-events-none"
            style={{ left: "-10vw", right: "-10vw", background: "linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.12) 8%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, rgba(255,255,255,0.12) 92%, transparent 98%)" }}
          />
          {/* Bottom line */}
          <div
            className="absolute bottom-0 h-[1px] pointer-events-none"
            style={{ left: "-10vw", right: "-10vw", background: "linear-gradient(90deg, transparent 2%, rgba(255,255,255,0.1) 8%, rgba(255,255,255,0.18) 15%, rgba(255,255,255,0.18) 85%, rgba(255,255,255,0.1) 92%, transparent 98%)" }}
          />
          {/* Left line */}
          <div
            className="absolute left-0 w-[1px] pointer-events-none"
            style={{ top: "-10vh", bottom: "-10vh", background: "linear-gradient(180deg, transparent 2%, rgba(255,255,255,0.12) 8%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, rgba(255,255,255,0.12) 92%, transparent 98%)" }}
          />
          {/* Right line */}
          <div
            className="absolute right-0 w-[1px] pointer-events-none"
            style={{ top: "-10vh", bottom: "-10vh", background: "linear-gradient(180deg, transparent 2%, rgba(255,255,255,0.1) 8%, rgba(255,255,255,0.18) 15%, rgba(255,255,255,0.18) 85%, rgba(255,255,255,0.1) 92%, transparent 98%)" }}
          />

          {/* Top edge shine */}
          <div
            className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.25) 25%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.25) 75%, transparent 95%)",
            }}
          />
          {/* Top glow fade */}
          <div
            className="absolute inset-x-0 top-0 h-[120px] pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)",
            }}
          />

          {/* Heavy noise texture for tactile glass feel */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage: "url(/hero/noise-texture.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "150px 150px",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: "url(/hero/noise-texture.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "80px 80px",
            }}
          />

          {/* ─── Glass card content ─── */}
          <div className="relative z-[20] grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 lg:gap-12 p-8 lg:p-12">
            {/* ─── Left column: Text content ─── */}
            <div className="flex flex-col justify-center order-2 lg:order-1">

              {/* H1 */}
              <h1
                className="text-[clamp(2.5rem,5.5vw,60px)] font-normal tracking-[-1.5px] bg-clip-text text-transparent overflow-visible pb-1"
                style={{
                  backgroundImage: "var(--gradient-text)",
                  lineHeight: "1.05",
                }}
              >
                Empower ambition.
                <br />
                Engineer success.
              </h1>

              {/* Accent bars — signature gradient */}
              <div className="relative flex flex-col gap-[10px] mt-8 mb-8">
                <div
                  className="h-[10px] w-[70%] max-w-[500px] rounded-full"
                  style={{
                    background: "var(--gradient-accent)",
                    boxShadow: "0 0 30px rgba(255,107,44,0.3), 0 0 60px rgba(217,70,239,0.15)",
                  }}
                />
                <div className="h-[8px] w-[80%] max-w-[560px] rounded-full bg-white/[0.12]" />
                <div className="h-[8px] w-[95%] max-w-[660px] rounded-full bg-white/[0.08]" />
                <div className="h-[8px] w-[75%] max-w-[520px] rounded-full bg-white/[0.05]" />
              </div>

              {/* Body text */}
              <p
                className="max-w-[505px] text-[clamp(15px,1.3vw,17.9px)] leading-[28px] tracking-[-0.45px] mb-6"
                style={{ color: "rgba(212, 212, 212, 0.8)" }}
              >
                We craft high-performance software solutions and cutting-edge
                applications that empower businesses to scale and succeed in the
                digital landscape.
              </p>

              {/* Upwork rating with gradient stars */}
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src="/hero/upwork-logo.svg"
                  alt="Upwork"
                  width={48}
                  height={34}
                  className="flex-shrink-0 opacity-70"
                />
                <div className="flex flex-col gap-[3px]">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <defs>
                          <linearGradient id={`star-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF6B2C" />
                            <stop offset="25%" stopColor="#FF4F6F" />
                            <stop offset="50%" stopColor="#D946EF" />
                            <stop offset="75%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#6366F1" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          fill={`url(#star-gradient-${i})`}
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[13px] leading-[18px] tracking-[-0.3px] text-white/50">
                    5 stars rating on{" "}
                    <span className="underline decoration-white/30 underline-offset-[3px] text-white/65">
                      upwork
                    </span>
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-5">
                <Link
                  href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                  className="inline-flex items-center justify-center rounded-[10px] px-10 py-4 text-[16px] font-semibold leading-[22px] tracking-[-0.3px] text-white transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(180deg, #5b9aff 0%, #3b82f6 50%, #2563eb 100%)",
                    boxShadow: "0 0 24px rgba(59,130,246,0.35), 0 6px 16px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Book a call
                </Link>
                <Link
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] px-10 py-4 text-[16px] font-medium leading-[22px] tracking-[-0.3px] text-white/80 transition-all duration-300 hover:text-white hover:border-white/25"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  Explore our work
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* ─── Right column: Video asset ─── */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center">
              <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[12px] overflow-hidden">
                {/* Video glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                  <div
                    className="w-[90%] h-[70%] rounded-full blur-[80px] opacity-30"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, var(--glow-teal) 0%, rgba(42,119,128,0.2) 40%, transparent 70%)",
                    }}
                  />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative w-full h-full object-cover mix-blend-lighten"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 60%, transparent 80%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 60%, transparent 80%)",
                  }}
                >
                  <source src="/hero/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Logo carousel: Trusted by ─── */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[12px] uppercase tracking-[0.15em] text-white/30 mb-6">
            Trusted by Creators & Businesses
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-scroll-logos gap-16 items-center py-2">
              {[...LOGO_BRANDS, ...LOGO_BRANDS, ...LOGO_BRANDS].map((brand, i) => (
                <span
                  key={`${brand.name}-${i}`}
                  className={`select-none whitespace-nowrap flex-shrink-0 ${brand.className}`}
                  style={{
                    color: `rgba(255, 255, 255, ${0.25 + (i % LOGO_BRANDS.length) * 0.05})`,
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
