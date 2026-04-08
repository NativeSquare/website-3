"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const faqs = [
  {
    question: "What kind of companies do you work with?",
    answer:
      "We work with health tech startups, digital health companies, and organizations building health, fitness, or wellness products. From early-stage founders to funded companies with Series A+, we partner with teams that are serious about building impactful health technology.",
  },
  {
    question: "How is NativeSquare different from a typical dev agency?",
    answer:
      "We're not vendors — we're builders who work in the same space as our clients. We build our own health platforms (like Cadence), so we understand the challenges of health tech from the inside. That means better technical decisions, regulatory awareness, and a shared understanding of what it takes to ship in healthcare.",
  },
  {
    question: "What is your approach to health tech compliance?",
    answer:
      "We build with HIPAA, GDPR health provisions, and HDS (French health data hosting) standards in mind from day one. Security and privacy are baked into our architecture — not bolted on as an afterthought.",
  },
  {
    question: "How long does a typical engagement last?",
    answer:
      "Most MVPs take 6 to 12 weeks. For ongoing partnerships, we offer monthly retainers. We use our Spec-Driven Development methodology — vision, milestones, versioned specs, tasks — so you always know exactly where your project stands.",
  },
  {
    question: "Do you take equity in the startups you build?",
    answer:
      "For early-stage startups we deeply believe in, we offer a shared CTO model: reduced rate combined with equity. This aligns our incentives and gives us real skin in the game.",
  },
];

const FAQ: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
      id="faq"
      ref={ref}
    >
      <div className="container-sm" style={{ maxWidth: "800px" }}>
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-[13px] font-medium tracking-tight text-[var(--primary-blue)] mb-4 uppercase">
            FAQ
          </p>
          <h2 className="font-title fs-36 font-medium leading-none tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="fs-16 leading-snug tracking-tight text-gray-40">
            Everything you need to know about working with us.
          </p>
        </div>

        <div
          className={`space-y-3 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden transition-colors duration-200"
              style={{
                background: "var(--gray-94)",
                border: `1px solid ${openIndex === idx ? "var(--gray-80)" : "var(--gray-90)"}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="fs-15 font-medium pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-gray-50 transition-transform duration-300 ${
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
                <div className="px-5 pb-5 fs-15 text-gray-30 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-10 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-[14px] text-gray-40">
            Still have questions?{" "}
            <a
              href="mailto:hello@nativesquare.fr"
              className="font-medium transition-colors"
              style={{ color: "var(--primary-blue)" }}
            >
              Reach out
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
