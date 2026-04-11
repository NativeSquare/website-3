import { Target, Users, Heart, Award } from "lucide-react";
import FAQ from "./FAQ";
import CTA from "./CTA";

const values = [
  {
    icon: Target,
    title: "Skin in the Game",
    description:
      "We build our own health products. That means we understand the challenges from the inside — not from a brief.",
    color: "#1a79ff",
  },
  {
    icon: Users,
    title: "True Partnership",
    description:
      "We don't do vendor relationships. We work as peers — same standards, same urgency, same craft.",
    color: "#62bf59",
  },
  {
    icon: Heart,
    title: "User-Obsessed",
    description:
      "We build products people actually use. Design and UX are not afterthoughts — they're the starting point.",
    color: "#d973ce",
  },
  {
    icon: Award,
    title: "End-to-End",
    description:
      "From product strategy to App Store. We handle the full journey so you can focus on your business.",
    color: "#fead34",
  },
];

const About: React.FC = () => {
  return (
    <>
      {/* Hero section — dark like landing hero */}
      <section className="bg-gray-8 pt-32 pb-20 max-md:pt-24 max-md:pb-14">
        <div className="container-md max-[1023px]:px-16 max-md:px-5">
          <h1 className="font-title fs-64 font-medium leading-none tracking-tighter text-white max-xl:!text-[56px] max-[1023px]:!text-[48px] max-md:!text-[36px]">
            We are{" "}
            <span style={{ color: "var(--primary-blue)" }}>NativeSquare</span>.
          </h1>
          <div className="mt-8 max-w-2xl space-y-6">
            <p className="fs-18 leading-relaxed tracking-tight text-gray-70">
              NativeSquare is a healthcare-focused startup studio. We build our
              own health platforms — Cadence, Soma — and we partner with
              visionary companies to build theirs.
            </p>
            <p className="fs-18 leading-relaxed tracking-tight text-gray-70">
              We started because we saw the same problem everywhere: great
              health ideas dying in the gap between vision and execution.
              Regulatory complexity, device integrations, clinical data — most
              teams get stuck. We don&apos;t.
            </p>
            <p className="fs-18 leading-relaxed tracking-tight text-gray-70">
              Our edge is simple: we build in the same space as our clients. We
              know what it takes to ship a health product because we do it
              ourselves, every day.
            </p>
          </div>
        </div>
      </section>

      {/* Values — white section */}
      <section
        className="py-20 max-md:py-14"
        style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
      >
        <div className="container-md max-[1023px]:px-16 max-md:px-5">
          <h2 className="font-title fs-40 font-medium leading-none tracking-tight mb-12 max-md:mb-8 max-md:!text-[28px]">
            What drives us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-7"
                style={{
                  background: "var(--gray-94)",
                  border: "1px solid var(--gray-90)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${v.color}15` }}
                >
                  <v.icon size={20} strokeWidth={1.5} style={{ color: v.color }} />
                </div>
                <h3 className="fs-18 font-medium leading-snug tracking-tight mb-2">
                  {v.title}
                </h3>
                <p className="fs-14 leading-relaxed tracking-tight text-gray-30">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
      <CTA />
    </>
  );
};

export default About;
