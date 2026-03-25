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
      {/* ─── Layer 1: Atmospheric glows ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-right teal glow (behind video) */}
        <div
          className="absolute -top-[10%] -right-[5%] w-[60%] h-[70%] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        {/* Bottom-left subtle cyan glow */}
        <div
          className="absolute -bottom-[15%] -left-[10%] w-[45%] h-[50%] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-cyan), transparent 70%)",
            filter: "blur(150px)",
          }}
        />
      </div>

      {/* ─── Layer 2: Subtle geometric shapes ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[15%] w-[400px] h-[400px] opacity-[0.02] rotate-12"
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "32px",
          }}
        />
        <div
          className="absolute bottom-[5%] right-[20%] w-[300px] h-[300px] opacity-[0.015] -rotate-6"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
          }}
        />
      </div>

      {/* ─── Layer 3: Noise texture ─── */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: "url(/hero/noise-texture.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ─── Layer 4: Content container ─── */}
      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-[1216px] h-full px-6 lg:px-8 pt-[80px] pb-[40px] transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* ─── Frosted glass card ─── */}
        <div className="relative rounded-[20px] overflow-hidden">
          {/* Glass background */}
          <div
            className="absolute inset-0 backdrop-blur-[16px]"
            style={{ background: "rgba(255,255,255,0.025)" }}
          />

          {/* Double border for intensity (bento card technique) */}
          <div
            className="absolute inset-0 rounded-[20px] mix-blend-overlay pointer-events-none"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <div
            className="absolute inset-0 rounded-[20px] mix-blend-overlay pointer-events-none"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          />

          {/* Top shine */}
          <div
            className="absolute inset-x-0 top-0 h-[80px] pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            }}
          />

          {/* Internal noise */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage: "url(/hero/noise-texture.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          />

          {/* ─── Glass card content ─── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 lg:gap-12 p-8 lg:p-12">
            {/* ─── Left column: Text content ─── */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              {/* Social proof: Stacked avatars */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[
                    "bg-gradient-to-br from-blue-400 to-indigo-600",
                    "bg-gradient-to-br from-emerald-400 to-teal-600",
                    "bg-gradient-to-br from-amber-400 to-orange-600",
                    "bg-gradient-to-br from-pink-400 to-rose-600",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${gradient} ring-2 ring-[var(--background)] flex items-center justify-center`}
                    >
                      <span className="text-[10px] font-semibold text-white/90">
                        {["A", "M", "S", "K"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[13px] tracking-[-0.2px] text-white/50">
                  Join <span className="text-white/80 font-medium">1k+</span> clients today
                </p>
              </div>

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
              <div className="flex flex-col gap-[6px] mt-6 mb-6">
                <div
                  className="h-[4px] w-[220px] rounded-full"
                  style={{ background: "var(--gradient-accent)" }}
                />
                <div className="h-[4px] w-[300px] rounded-full bg-white/[0.08]" />
                <div className="h-[4px] w-[260px] rounded-full bg-white/[0.05]" />
                <div className="h-[4px] w-[200px] rounded-full bg-white/[0.03]" />
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
              <div className="flex items-center gap-4">
                {/* Primary: Blue filled */}
                <Link
                  href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                  className="inline-flex items-center rounded-full px-6 py-3 text-[14px] font-semibold leading-[20px] tracking-[-0.28px] text-white transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{ background: "var(--accent-blue)" }}
                >
                  Book a call
                </Link>

                {/* Secondary: Outlined */}
                <Link
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-white/80 transition-all duration-300 hover:text-white hover:border-white/25"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Explore our work
                  <ArrowRight size={15} strokeWidth={1.5} />
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

                {/* Video */}
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
            {/* Fade edges */}
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
