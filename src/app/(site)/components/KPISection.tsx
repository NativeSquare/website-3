"use client";

import { useScrollAnimation } from "../hooks/useScrollAnimation";

/*──────────────────────────────────────────────────────────────
  KPI Section — Figma node 271:3554
  Colors matched to final Figma render using exact SVG colors:
  Teal: #6CB0B2 #6BAEB0 #1ABEB2 #59827F
  Purple: #946CB2 #806BB0 #9A6BB0
  Orange: #FFDBC0 #B0856B #B0906B
  Background: #7591F0
──────────────────────────────────────────────────────────────*/

const KPI_CARDS = [
  {
    label: "Products Built",
    value: "15+",
    borderColor: "#414155",
    shadow: "-1px 6px 19.6px 0px black",
    // Border glow: #6CB0B2 along top edge, mix-blend-lighten
    borderGlow:
      "radial-gradient(ellipse 75% 65% at 35% -15%, #6CB0B2 0%, rgba(108,176,178,0.5) 30%, transparent 60%)",
    // Composite fill: bright base + accent overlays (matched to Figma final render)
    fill: [
      // Bright teal highlight top-right — #1ABEB2
      "radial-gradient(ellipse 40% 50% at 85% 8%, rgba(26,190,178,0.55) 0%, transparent 55%)",
      // Teal accent spread — #6BAEB0
      "radial-gradient(ellipse 55% 50% at 75% 25%, rgba(107,174,176,0.45) 0%, transparent 60%)",
      // Small accent bottom-left
      "radial-gradient(ellipse 22% 30% at 14% 72%, rgba(107,174,176,0.2) 0%, transparent 50%)",
      // Base gradient — BOOSTED to match cumulative Figma result
      "radial-gradient(ellipse 95% 150% at 88% 8%, rgba(80,170,170,1) 0%, rgba(60,130,130,1) 18%, rgba(45,95,100,1) 35%, rgba(30,60,65,1) 55%, rgba(14,15,21,1) 85%)",
    ].join(", "),
  },
  {
    label: "Founders Accompanied",
    value: "100+",
    borderColor: "#231e27",
    shadow: "0px 6px 27.6px 0px black",
    // Border glow: #946CB2 centered top
    borderGlow:
      "radial-gradient(ellipse 70% 70% at 50% -20%, #946CB2 0%, rgba(148,108,178,0.5) 30%, transparent 55%)",
    // Composite fill: neon purple hotspot + vibrant base
    fill: [
      // Concentrated neon purple hotspot — center of card
      "radial-gradient(ellipse 35% 50% at 42% 40%, rgba(180,60,255,0.6) 0%, rgba(150,40,220,0.2) 40%, transparent 60%)",
      // Purple-pink highlight top
      "radial-gradient(ellipse 40% 45% at 50% 2%, rgba(200,120,255,0.35) 0%, transparent 48%)",
      // Side accent left
      "radial-gradient(ellipse 30% 50% at 18% 40%, rgba(140,90,170,0.2) 0%, transparent 50%)",
      // Base gradient — vivid neon purple
      "radial-gradient(ellipse 70% 160% at 48% -25%, rgba(175,65,245,1) 0%, rgba(140,55,200,1) 10%, rgba(105,42,160,1) 25%, rgba(70,30,100,1) 42%, rgba(35,20,55,1) 60%, rgba(17,14,21,1) 80%)",
    ].join(", "),
  },
  {
    label: "Monthly Paying Users",
    value: "25K+",
    borderColor: "#271e1e",
    shadow: "1px 6px 19.6px 0px black",
    // Border glow: #FFDBC0 (bright warm) left side
    borderGlow:
      "radial-gradient(ellipse 65% 70% at -10% 40%, #FFDBC0 0%, rgba(255,219,192,0.4) 30%, transparent 55%)",
    // Composite fill: bright base + accents (matched to warm Figma render)
    fill: [
      // Bright orange highlight top-left
      "radial-gradient(ellipse 40% 45% at 8% 15%, rgba(235,160,80,0.4) 0%, transparent 50%)",
      // Warm spread center-left
      "radial-gradient(ellipse 55% 55% at 25% 50%, rgba(176,144,107,0.3) 0%, transparent 55%)",
      // Base gradient — BOOSTED warm orange
      "radial-gradient(ellipse 180% 150% at -2% -15%, rgba(195,105,55,1) 0%, rgba(150,75,45,1) 18%, rgba(100,50,35,1) 35%, rgba(55,30,22,1) 55%, rgba(21,16,14,1) 80%)",
    ].join(", "),
  },
];

const KPISection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="relative bg-[#07070a] overflow-hidden">
      <div className="relative mx-auto max-w-[1216px] px-6 lg:px-8">
        {/* ===== Textured background (Figma 470:219) ===== */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: "visible" }}>
          {/* Main blue/indigo glow — #7591F0 */}
          <div
            className="absolute"
            style={{
              left: "10%",
              top: "-180px",
              width: "80%",
              height: "400px",
              background:
                "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(117,145,240,0.8) 0%, rgba(117,145,240,0.45) 30%, rgba(80,60,180,0.15) 55%, transparent 80%)",
              filter: "blur(50px)",
            }}
          />

          {/* Pixel grid texture */}
          <div
            className="absolute"
            style={{
              top: "-66px",
              left: "-24px",
              width: "1249px",
              height: "345px",
              backgroundImage: "url(/kpi/pixel-texture.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "100px 100px",
              opacity: 0.3,
              maskImage:
                "radial-gradient(ellipse 48% 40% at 50% 55%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 40% at 50% 55%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 90%)",
            }}
          />

          {/* Horizontal divider */}
          <div
            className="absolute left-0 h-px bg-white"
            style={{
              top: "0px",
              width: "1216px",
              maskImage:
                "radial-gradient(ellipse 45% 100% at 52% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 45% 100% at 52% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)",
            }}
          />
        </div>

        {/* ===== Cards ===== */}
        <div
          ref={ref}
          className={`relative z-10 pt-20 pb-16 lg:pt-24 lg:pb-20 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KPI_CARDS.map((card) => (
              <div
                key={card.label}
                className="relative h-[128px] rounded-[24px]"
                style={{ boxShadow: card.shadow }}
              >
                {/* Border base */}
                <div
                  className="absolute inset-0 rounded-[24px]"
                  style={{ backgroundColor: card.borderColor }}
                />

                {/* Border glow */}
                <div
                  className="absolute inset-0 rounded-[24px] overflow-hidden mix-blend-lighten"
                  style={{ backgroundImage: card.borderGlow }}
                />

                {/* Card fill with composite gradient layers */}
                <div
                  className="absolute inset-[1px] rounded-[23px] overflow-hidden"
                  style={{ backgroundImage: card.fill }}
                >
                  {/* Noise texture */}
                  <div
                    className="absolute inset-0 mix-blend-soft-light pointer-events-none"
                    style={{
                      opacity: 0.18,
                      backgroundImage: "url(/hero/noise-texture.png)",
                      backgroundRepeat: "repeat",
                      backgroundSize: "200px 200px",
                    }}
                  />

                  {/* Text */}
                  <div className="relative flex flex-col gap-3 p-6 h-full z-10">
                    <p
                      className="text-[13px] leading-[19.5px] tracking-[-0.325px] bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(116.565deg, rgb(255,255,255) 4.58%, rgb(237,255,254) 39.45%)",
                      }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-[46.5px] leading-[48px] tracking-[-1.2px] font-normal bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgb(255,255,255) 25.49%, rgb(86,86,86) 100.09%)",
                      }}
                    >
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KPISection;
