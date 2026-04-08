"use client";

import Link from "next/link";
import { Check, Shield, Smartphone, Zap } from "lucide-react";
import { PORTFOLIO_URL } from "../data/config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const MobileSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      className="relative py-24 sm:py-32 bg-[var(--background)] overflow-hidden"
      ref={ref}
    >
      {/* Atmospheric glow behind phone */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(150px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Badge with gradient accent border */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-hover)",
                color: "var(--glow-cyan)",
              }}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Agency & Studio
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
              We build for clients. <br /> We build for ourselves.
            </h2>

            {/* Accent line */}
            <div
              className="h-[3px] w-[100px] rounded-full mb-6"
              style={{ background: "var(--gradient-accent)" }}
            />

            <p className="text-white/50 text-lg mb-8 max-w-lg leading-relaxed">
              As both an agency and an app studio, we bring real-world
              experience to every project. We know what it takes to launch and
              scale because we&apos;ve done it ourselves with our own apps
              serving 25,000+ paying users.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Zap className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Proven Track Record</h4>
                  <p className="text-sm text-white/40 mt-1">
                    Our own apps generate real revenue. We know what works.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Shield className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Full-Service Support</h4>
                  <p className="text-sm text-white/40 mt-1">
                    From product strategy to customer acquisition.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full text-white px-6 py-3.5 font-medium transition-all duration-300 hover:brightness-110"
                style={{ background: "var(--accent-blue)" }}
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.74 3.4 1.86-2.93 1.75-2.46 6.09.41 7.28-.65 1.62-1.55 3.19-2.46 3.87zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>View Our Apps</span>
              </Link>
              <Link
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full text-white/70 px-6 py-3.5 font-medium hover:text-white hover:border-white/20 transition-all duration-300"
                style={{ border: "1px solid var(--border-hover)" }}
              >
                <span>See Client Work</span>
              </Link>
            </div>
          </div>

          {/* Phone mockup — dark theme */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div
              className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] rounded-[3rem] border-4 shadow-2xl overflow-hidden"
              style={{
                background: "var(--surface)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="w-full h-full relative" style={{ background: "var(--surface-light)" }}>
                {/* Status bar */}
                <div
                  className="absolute top-0 left-0 w-full h-24 pt-10 px-6 flex justify-between items-center z-10"
                  style={{ background: "linear-gradient(180deg, var(--surface) 0%, transparent 100%)" }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                  <div className="w-20 h-4 rounded-full bg-white/[0.04]" />
                  <div className="w-8 h-8 rounded-full bg-white/[0.04]" />
                </div>

                <div className="pt-24 px-6 space-y-4">
                  <div
                    className="w-full h-40 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/[0.06] rounded-full mx-auto mb-2" />
                      <div className="w-24 h-3 bg-white/[0.08] rounded-full mx-auto" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2 h-32 rounded-2xl bg-white/[0.03]" />
                    <div className="w-1/2 h-32 rounded-2xl bg-white/[0.03]" />
                  </div>
                  <div
                    className="w-full h-16 rounded-xl flex items-center px-4 gap-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                    <div className="flex-1 space-y-2">
                      <div className="w-2/3 h-2 bg-white/[0.08] rounded-full" />
                      <div className="w-1/2 h-2 bg-white/[0.05] rounded-full" />
                    </div>
                  </div>
                  <div
                    className="w-full h-16 rounded-xl flex items-center px-4 gap-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-2 bg-white/[0.08] rounded-full" />
                      <div className="w-1/2 h-2 bg-white/[0.05] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Bottom nav */}
                <div
                  className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-around pb-4"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: "var(--accent-blue)" }}
                  />
                  <div className="w-6 h-6 rounded-full bg-white/[0.06]" />
                  <div className="w-6 h-6 rounded-full bg-white/[0.06]" />
                  <div className="w-6 h-6 rounded-full bg-white/[0.06]" />
                </div>
              </div>
            </div>

            {/* Floating notification card */}
            <div
              className="absolute top-20 -left-10 p-4 rounded-2xl shadow-2xl animate-bounce delay-700 duration-[4000ms]"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-hover)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40">TestFlight</p>
                  <p className="text-sm font-bold text-white">Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileSection;
