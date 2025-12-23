"use client";

import { Star, Quote } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Andrew R.",
    company: "RYB",
    content:
      "The team is highly skilled and well-spoken professionals. They carefully reviewed all the requirements of the project and delivered everything to an exceptional standard. Their communication, attention to detail, and quality of work were outstanding. I’d gladly work with them again in the future. Cheers guys!",
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
      className="relative py-24 bg-gray-50/50 overflow-hidden"
      id="testimonials"
      ref={ref}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-24 -left-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
            Testimonials
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 font-geist">
            Trusted by founders <br />{" "}
            <span className="text-gray-500">around the globe</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Link
              key={idx}
              href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="absolute top-6 right-8 text-gray-100 group-hover:text-indigo-50 transition-colors duration-500">
                <Quote size={48} fill="currentColor" />
              </div>

              <div className="flex text-amber-400 mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 flex-grow relative z-10 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-gray-50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link
            href="https://www.upwork.com/freelancers/~0135c21091b0e3745d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            View all 50+ reviews on Upwork
            <Star size={16} fill="currentColor" className="text-amber-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

