"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const CTA: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--background)] -z-10" />
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[140%] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-cyan), transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Frosted glass container */}
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Glass background */}
          <div
            className="absolute inset-0 backdrop-blur-[12px]"
            style={{ background: "rgba(255,255,255,0.025)" }}
          />
          {/* Border overlay */}
          <div
            className="absolute inset-0 rounded-[2rem] mix-blend-overlay pointer-events-none"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
            style={{
              backgroundImage: "url(/hero/noise-texture.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          />

          <div className="relative z-10 p-8 sm:p-16 md:p-24 text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Accent line */}
              <div className="flex justify-center mb-8">
                <div
                  className="h-[3px] w-[120px] rounded-full"
                  style={{ background: "var(--gradient-accent)" }}
                />
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-8">
                Ready to turn your vision <br className="hidden sm:block" />
                into a{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-accent)" }}
                >
                  market leader?
                </span>
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                Stop waiting for the perfect moment. Let&apos;s build your product,
                craft your strategy, and scale your business today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                  className="group inline-flex items-center justify-center gap-3 rounded-full px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                  style={{ background: "var(--accent-blue)" }}
                >
                  <span>Book Your Strategy Call</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </Link>

                <Link
                  href="mailto:admin@nativesquare.fr"
                  className="text-white/60 font-semibold hover:text-white transition-colors border-b border-white/20 hover:border-white/40 pb-1"
                >
                  Or drop us an email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
