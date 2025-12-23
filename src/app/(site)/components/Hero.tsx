"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  ChevronUp,
  PlayCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { PORTFOLIO_URL } from "../data/config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const Hero: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0);

  useEffect(() => {
    const scriptId = "unicorn-studio-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.onload = () => {
        // @ts-ignore
        if (window.UnicornStudio) {
          // @ts-ignore
          window.UnicornStudio.init();
        }
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.UnicornStudio) {
        // @ts-ignore
        window.UnicornStudio.init();
      }
    }
  }, []);

  return (
    <main className="relative min-h-screen">
      <div className="aura-background-component top-0 w-full -z-10 h-screen absolute">
        <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
          <div
            data-us-project="yACzULFKkgXAmEcep6hu"
            className="absolute w-full h-full left-0 top-0 -z-10"
          ></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24  sm:pb-32 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <section
            className={`order-2 lg:order-1 relative transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            ref={ref}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-gray-200/20 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              NativeSquare Studio
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-geist tracking-tighter leading-[0.95] text-gray-900 mt-6">
              From idea to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                market success
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 font-geist max-w-xl leading-relaxed">
              Your full-service software agency and app studio. We take your
              vision from ideation to launch—building your product, crafting
              your go-to-market strategy, and setting up sales funnels that
              convert.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-black hover:scale-105 transition-all duration-300"
              >
                <span>Book a Strategy Call</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
              <Link
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                <PlayCircle className="h-5 w-5 text-gray-500" />
                View Our Work
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100/50 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex text-amber-500 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill="currentColor"
                      className="mr-0.5"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900 font-geist">
                  5 Stars on Upwork
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-geist">
                  15+
                </h3>
                <p className="text-sm text-gray-500 mt-1">Projects Shipped</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-geist">
                  25k+
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Paying users across apps
                </p>
              </div>
            </div>
          </section>

          <section className="order-1 lg:order-2 relative perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10 opacity-50"></div>

            <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5 transform rotate-y-6 hover:rotate-y-0 transition-transform duration-700 ease-out">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 font-geist">
                    Project Performance
                  </h3>
                  <p className="text-xs text-gray-500">
                    Live analytics across all platforms
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-700">
                    System Healthy
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +24%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-lg font-bold text-gray-900">$2.4M</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Users size={16} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +12%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="text-lg font-bold text-gray-900">84.2k</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <Activity size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                      99.9%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-lg font-bold text-gray-900">Stable</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-700">
                      iOS App
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-700">
                      Android App
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-700">
                      Web Platform
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-3 shadow-xl border border-gray-100 animate-bounce delay-700 duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Monthly Growth
                    </p>
                    <p className="text-sm font-bold text-gray-900">+125%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur rounded-xl p-3 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                    <ChevronUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Conversion Rate
                    </p>
                    <p className="text-sm font-bold text-gray-900">Optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Hero;
