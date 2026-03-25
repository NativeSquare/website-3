"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const faqs = [
  {
    question: "What services does the team offer?",
    answer:
      "We provide end-to-end product development, including product strategy, UX/UI design, custom software development (web and mobile), and go-to-market execution. We also specialize in building conversion-optimized sales funnels.",
  },
  {
    question: "How long does it take to build a typical MVP?",
    answer:
      "Most MVPs take between 6 to 12 weeks depending on the complexity. We focus on getting you to market as quickly as possible with a high-quality product that solves your core problem.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We primarily work with modern, scalable stacks like React, Next.js, TypeScript, and Node.js. For mobile, we use React Native. We choose the best tools for your specific needs to ensure performance and longevity.",
  },
  {
    question: "How do you handle project communication?",
    answer:
      "We believe in radical transparency. We use tools like Slack for daily communication, Loom for quick updates, and Notion or Jira for project tracking. You'll always know exactly where your project stands.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes, we offer flexible maintenance and support packages to ensure your product continues to run smoothly and scales as your user base grows.",
  },
];

const FAQ: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-24 bg-[var(--surface)]"
      id="faq"
      ref={ref}
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--glow-cyan)",
            }}
          >
            <HelpCircle size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about working with us. Can&apos;t find the
            answer you&apos;re looking for? Feel free to reach out.
          </p>
        </div>

        <div
          className={`space-y-4 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden transition-colors"
              style={{
                background: "var(--background)",
                border: `1px solid ${openIndex === idx ? "var(--border-hover)" : "var(--border)"}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/30 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="p-6 pt-0 text-white/50 leading-relaxed"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-white/35">
            Still have questions?{" "}
            <a
              href="mailto:admin@nativesquare.fr"
              className="font-semibold hover:text-white/70 transition-colors"
              style={{ color: "var(--glow-cyan)" }}
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
