"use client";

import Link from "next/link";
import { Check, Shield, Smartphone, Zap } from "lucide-react";
import { PORTFOLIO_URL } from "../data/config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const MobileSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      className="relative py-24 sm:py-32 bg-white overflow-hidden"
      ref={ref}
    >
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-[-10%] w-[800px] h-[800px] bg-blue-50/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-indigo-50/80 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700 mb-6">
              <Smartphone className="w-3.5 h-3.5" />
              Agency & Studio
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 font-geist mb-6">
              We build for clients. <br /> We build for ourselves.
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
              As both an agency and an app studio, we bring real-world experience to every project. We know what it takes to launch and scale because we&apos;ve done it ourselves with our own apps serving 25,000+ paying users.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-geist">
                    Proven Track Record
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Our own apps generate real revenue. We know what works.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-geist">
                    Full-Service Support
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-6 py-3.5 font-medium hover:bg-gray-800 transition-colors shadow-lg"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-900 px-6 py-3.5 font-medium hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 fill-current text-gray-800"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M3.5 18.5h17v-13h-17v13zm17-14.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-17c-.83 0-1.5-.67-1.5-1.5v-13c0-.83.67-1.5 1.5-1.5h17zm-11 5.5h-2v4h2v-4zm4 0h-2v4h2v-4zm4 0h-2v4h2v-4z" />
                </svg>
                <span>See Client Work</span>
              </Link>
            </div>
          </div>

          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-white relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white pt-10 px-6 flex justify-between items-center z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-20 h-4 rounded-full bg-gray-100"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                </div>

                <div className="pt-24 px-6 space-y-4">
                  <div className="w-full h-40 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full mx-auto mb-2"></div>
                      <div className="w-24 h-3 bg-indigo-200 rounded-full mx-auto"></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2 h-32 rounded-2xl bg-gray-50"></div>
                    <div className="w-1/2 h-32 rounded-2xl bg-gray-50"></div>
                  </div>
                  <div className="w-full h-16 rounded-xl bg-gray-50 flex items-center px-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-2/3 h-2 bg-gray-200 rounded-full"></div>
                      <div className="w-1/2 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-full h-16 rounded-xl bg-gray-50 flex items-center px-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                      <div className="w-1/2 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-20 bg-white border-t border-gray-100 flex items-center justify-around pb-4">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="absolute top-20 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce delay-700 duration-[4000ms]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">TestFlight</p>
                  <p className="text-sm font-bold text-gray-900">Approved</p>
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

