"use client";

import Link from "next/link";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const CTA: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gray-900 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-indigo-600/20 rounded-full blur-[120px] rotate-12"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[140%] bg-blue-600/20 rounded-full blur-[120px] -rotate-12"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[3rem] p-8 sm:p-16 md:p-24 text-center overflow-hidden relative">
          {/* Decorative icons */}
          <div className="absolute top-12 left-12 text-white/10 animate-pulse">
            <Zap size={64} />
          </div>
          <div className="absolute bottom-12 right-12 text-white/10 animate-pulse delay-700">
            <Sparkles size={64} />
          </div>

          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-geist mb-8">
              Ready to turn your vision <br className="hidden sm:block" />
              into a <span className="text-indigo-400">market leader?</span>
            </h2>
            <p className="text-xl text-indigo-100/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop waiting for the perfect moment. Let's build your product,
              craft your strategy, and scale your business today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-gray-900 shadow-2xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
              >
                <span>Book Your Strategy Call</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-700 transition-colors">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </Link>

              <Link
                href="mailto:admin@nativesquare.fr"
                className="text-white/80 font-semibold hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1"
              >
                Or drop us an email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
