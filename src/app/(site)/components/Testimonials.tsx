"use client";

import { Quote } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Andrew R.",
    company: "RYB",
    content:
      "The team is highly skilled and well-spoken professionals. They carefully reviewed all the requirements of the project and delivered everything to an exceptional standard. Their communication, attention to detail, and quality of work were outstanding. I'd gladly work with them again in the future. Cheers guys!",
    rating: 5,
  },
  {
    name: "Thomas S.",
    company: "StackUp",
    content:
      "The team was always available when needed and incredibly helpful in the production of our project. They even pointed out shortcomings on our project and made additions and improvements that we didn't foresee. The best fit for our development! Really impressive work.",
    rating: 5,
  },
  {
    name: "Magdalena Z.",
    company: "Founders Factory",
    content:
      "It has been a pleasure to work with The team! They are consistently punctual, keep their promises, and bring a high level of professionalism to the project. Their reliability makes the entire process smooth and stress-free. Highly recommend for anyone looking for a dependable and skilled developer!",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      className="relative py-24 bg-[var(--background)] overflow-hidden"
      id="testimonials"
      ref={ref}
    >
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-teal), transparent 70%)",
            filter: "blur(150px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-[13px] font-medium tracking-[0.15em] uppercase mb-3 text-white/40">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            Trusted by founders{" "}
            <span className="text-white/40">around the globe</span>
          </h2>
          {/* Accent line */}
          <div className="flex justify-center mt-4">
            <div
              className="h-[3px] w-[80px] rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Link
              key={idx}
              href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl p-8 flex flex-col h-full transition-all duration-700 hover:-translate-y-1 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`,
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Hover border effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ border: "1px solid var(--border-hover)" }}
              />

              {/* Quote icon */}
              <div className="absolute top-6 right-8 text-white/[0.04] group-hover:text-white/[0.06] transition-colors duration-500">
                <Quote size={48} fill="currentColor" />
              </div>

              {/* Gradient stars */}
              <div className="flex mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id={`tstar-${idx}-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF6B2C" />
                        <stop offset="25%" stopColor="#FF4F6F" />
                        <stop offset="50%" stopColor="#D946EF" />
                        <stop offset="75%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill={`url(#tstar-${idx}-${i})`}
                    />
                  </svg>
                ))}
              </div>

              <p className="text-white/60 leading-relaxed mb-8 flex-grow relative z-10 text-[15px]">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white/70 text-sm"
                  style={{ background: "var(--surface-light)" }}
                >
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[15px]">
                    {testimonial.name}
                  </h4>
                  <p className="text-[13px] text-white/35">{testimonial.company}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`mt-14 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/50 font-medium hover:text-white/70 transition-colors text-[14px]"
          >
            View all 50+ reviews on Upwork
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="link-star" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B2C" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="url(#link-star)"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
