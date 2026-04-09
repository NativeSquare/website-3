"use client";

import { Quote } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Andrew R.",
    company: "RYB",
    content:
      "The team is highly skilled and well-spoken professionals. They carefully reviewed all the requirements of the project and delivered everything to an exceptional standard. Their communication, attention to detail, and quality of work were outstanding.",
    rating: 5,
  },
  {
    name: "Thomas S.",
    company: "StackUp",
    content:
      "The team was always available when needed and incredibly helpful in the production of our project. They even pointed out shortcomings and made additions and improvements that we didn't foresee. Really impressive work.",
    rating: 5,
  },
  {
    name: "Magdalena Z.",
    company: "Founders Factory",
    content:
      "It has been a pleasure to work with the team! They are consistently punctual, keep their promises, and bring a high level of professionalism to the project. Highly recommend for anyone looking for a dependable and skilled developer!",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
      id="testimonials"
      ref={ref}
    >
      <div className="container-md">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-[13px] font-medium tracking-tight text-[var(--primary-blue)] mb-4 uppercase">
            Testimonials
          </p>
          <h2 className="font-title fs-40 font-medium leading-none tracking-tight mb-4">
            What our partners say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <Link
              key={idx}
              href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl p-8 flex flex-col h-full transition-all duration-700 hover:translate-y-[-2px] ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`,
                background: "var(--gray-94)",
                border: "1px solid var(--gray-90)",
              }}
            >
              {/* Quote */}
              <div className="absolute top-6 right-8 text-gray-90 group-hover:text-gray-80 transition-colors duration-500">
                <Quote size={40} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="#fead34"
                    />
                  </svg>
                ))}
              </div>

              <p className="fs-15 leading-snug tracking-tight text-gray-30 mb-8 flex-grow">
                &ldquo;{t.content}&rdquo;
              </p>

              <div
                className="flex items-center gap-3 mt-auto pt-6"
                style={{ borderTop: "1px solid var(--gray-90)" }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-[13px] text-gray-50 bg-gray-90">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-[14px] font-medium">
                    {t.name}
                  </h4>
                  <p className="text-[13px] text-gray-50">
                    {t.company}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-medium tracking-tight text-gray-50 hover:text-gray-30 transition-colors"
          >
            View all 15+ reviews on Upwork
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#fead34"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
