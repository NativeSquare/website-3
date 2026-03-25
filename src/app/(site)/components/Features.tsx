"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Cloud, Database, Smartphone } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const Features: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const current = scrollContainerRef.current;
    if (!current) return;
    const scrollAmount = 400;
    current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const features = [
    {
      title: "Product Strategy",
      desc: "We start by understanding your business goals and target audience. Together, we refine your concept and create a roadmap that positions you for market success.",
      icon: <Code2 className="w-6 h-6 text-white/50" />,
      badge: "Strategy First",
    },
    {
      title: "Custom Software",
      desc: "We build beautiful, intuitive apps and web platforms that your customers will love. No off-the-shelf solutions—everything is tailored to your business.",
      icon: <Smartphone className="w-6 h-6 text-white/50" />,
      badge: "Agency & Studio",
    },
    {
      title: "Launch Preparation",
      desc: "Getting to market is just the beginning. We help you craft compelling messaging, prepare your launch materials, and set up the infrastructure for success.",
      icon: <Cloud className="w-6 h-6 text-white/50" />,
      badge: "Go-to-Market",
    },
    {
      title: "Sales Funnels",
      desc: "We design and implement conversion-optimized sales pipelines that turn visitors into customers. From landing pages to checkout flows, we maximize your revenue.",
      icon: <Database className="w-6 h-6 text-white/50" />,
      badge: "Revenue Growth",
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-24 bg-[var(--surface)]"
      ref={ref}
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-8 mb-12">
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-[13px] font-medium tracking-[0.15em] uppercase mb-2 text-white/40">
              Complete Business Solutions
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white">
              We handle everything <br /> so{" "}
              <span className="text-white/40">you can focus on growth</span>
            </h2>
          </div>

          <div
            className={`hidden sm:flex gap-2 transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              style={{ border: "1px solid var(--border-hover)" }}
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-white/50" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--accent-blue)" }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          className={`relative mt-8 transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--surface), transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--surface), transparent)" }}
          />

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="min-w-[85%] sm:min-w-[400px] lg:min-w-[450px] snap-center rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/50 mb-8 leading-relaxed text-[15px]">
                  {feature.desc}
                </p>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white/50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {feature.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-12 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:brightness-110"
            style={{ background: "var(--accent-blue)" }}
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
