"use client";

import Image from "next/image";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const BENEFITS = [
  {
    icon: "/benefits/icon-sdk-dev.svg",
    title: "SDK Development",
    description:
      "Empower developers with reliable, well-designed SDKs that integrate seamlessly into your platform, inspiring them to build amazing solutions.",
  },
  {
    icon: "/benefits/icon-sdk-maint.svg",
    title: "SDK Maintenance",
    description:
      "Keep your SDKs up-to-date, secure, and efficient with our maintenance services, handling updates, fixes, and compatibility, so your team can focus.",
  },
  {
    icon: "/benefits/icon-cross-plat.svg",
    title: "Cross-Platform Development",
    description:
      "Accelerate development and time-to-market with a unified codebase. We migrate apps to Flutter or React Native, enabling faster builds and innovation.",
  },
];

const Benefits: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section
      ref={ref}
      className="relative bg-[#07070a] pt-4 pb-20 md:pt-4 md:pb-28 overflow-hidden"
    >
      <div
        className={`max-w-[1200px] mx-auto px-6 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Heading */}
        <h2 className="text-[#eeeff1] text-[36px] leading-[40px] tracking-[-0.9px] font-normal mb-11">
          Benefits
        </h2>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
          {BENEFITS.map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              {/* Icon + Title row */}
              <div className="flex items-center gap-2.5">
                <Image
                  src={item.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 flex-shrink-0"
                />
                <span className="text-[#eeeff1] text-[18px] font-medium leading-[22.5px] tracking-[-0.36px]">
                  {item.title}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#abaebb] text-[16px] font-light leading-[22px] tracking-[-0.32px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
