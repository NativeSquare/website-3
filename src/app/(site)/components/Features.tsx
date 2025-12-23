"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Cloud, Code2, Database, Smartphone } from "lucide-react";
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
      icon: <Code2 className="w-6 h-6 text-gray-700" />,
      badge: "Strategy First",
    },
    {
      title: "Custom Software",
      desc: "We build beautiful, intuitive apps and web platforms that your customers will love. No off-the-shelf solutions—everything is tailored to your business.",
      icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
      badge: "Agency & Studio",
    },
    {
      title: "Launch Preparation",
      desc: "Getting to market is just the beginning. We help you craft compelling messaging, prepare your launch materials, and set up the infrastructure for success.",
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      badge: "Go-to-Market",
    },
    {
      title: "Sales Funnels",
      desc: "We design and implement conversion-optimized sales pipelines that turn visitors into customers. From landing pages to checkout flows, we maximize your revenue.",
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      badge: "Revenue Growth",
    },
  ];

  return (
    <section
      className="relative overflow-hidden border-t border-gray-100 py-24 bg-white"
      ref={ref}
    >
      <div className="absolute top-24 -right-24 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-8 mb-12">
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-sm font-semibold text-indigo-600 mb-2">
              Complete Business Solutions
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 font-geist">
              We handle everything <br /> so{" "}
              <span className="text-gray-500">you can focus on growth</span>
            </h2>
          </div>

          <div
            className={`hidden sm:flex gap-2 transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-black transition-colors"
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
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="min-w-[85%] sm:min-w-[400px] lg:min-w-[450px] snap-center bg-white border border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-geist">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {feature.badge}
                  </span>
                </div>
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
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-black transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
