"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Dict } from "../content";

/* Node-graph panel — the reference "how-it-works" anatomy recomposed as a
   funnel: five white circular icon chips wired to a dashed-bracket
   "YOUR BUSINESS" neck, then a single drop line into the glowing green $ node.
   Chips pop in via IntersectionObserver (adds .in on the panel, same contract
   as the mockup); SMIL dots travel the connectors with cubic easing. */

const pd = (delay: string) => ({ "--pd": delay }) as CSSProperties;

const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-sans)",
  letterSpacing: "-.01em",
};

const ICONS: Record<string, ReactNode> = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  refresh: (
    <path d="M17 2.5l3.5 3.5L17 9.5M3.5 11V9.5a4 4 0 0 1 4-4h13M7 21.5L3.5 18 7 14.5M20.5 13v1.5a4 4 0 0 1-4 4h-13" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.8l1.7 5.4 5.5 1.8-5.5 1.8L12 17.2l-1.7-5.4-5.5-1.8 5.5-1.8L12 2.8z" />
      <path d="M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" strokeWidth="1.4" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3" y="13" width="4.4" height="7" rx="2.2" />
      <rect x="16.6" y="13" width="4.4" height="7" rx="2.2" />
      <path d="M19.5 20v.4a2.1 2.1 0 0 1-2.1 2.1H14" />
    </>
  ),
};

type ChipText = { label: string; stat: string };

function Chip({
  delay,
  cx,
  cy,
  r,
  iconTransform,
  icon,
  labelX,
  labelY,
  text,
  filterId,
  labelSize,
  statSize,
}: {
  delay: string;
  cx: number;
  cy: number;
  r: number;
  iconTransform: string;
  icon: ReactNode;
  labelX: number;
  labelY: number;
  text: ChipText;
  filterId: string;
  labelSize: number;
  statSize: number;
}) {
  return (
    <g className="gp-pop" style={pd(delay)}>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#E6E5E5" filter={`url(#${filterId})`} />
      <g
        transform={iconTransform}
        stroke="#1F1E1E"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </g>
      <text x={labelX} y={labelY} fontSize={labelSize} fontWeight="600" fill="#060504" style={LABEL_STYLE}>
        {text.label}
      </text>
      <text x={labelX} y={labelY + 18 - (labelSize < 14 ? 1 : 0)} fontSize={statSize} fill="#82807D" style={LABEL_STYLE}>
        {text.stat}
      </text>
    </g>
  );
}

function FlowDot({
  begin,
  path,
  r,
  fill,
  variant,
}: {
  begin: string;
  path: string;
  r: number;
  fill: string;
  variant: "funnel" | "money";
}) {
  const keyTimes = variant === "funnel" ? "0;0.45;1" : "0;0.4;1";
  const opacityKeyTimes =
    variant === "funnel" ? "0;0.05;0.38;0.45;1" : "0;0.05;0.32;0.4;1";
  return (
    <circle r={r} fill={fill} opacity="0">
      <animateMotion
        dur="4s"
        begin={begin}
        repeatCount="indefinite"
        calcMode="spline"
        keyPoints="0;1;1"
        keyTimes={keyTimes}
        keySplines="0.4 0 0.2 1;0 0 1 1"
        path={path}
      />
      <animate
        attributeName="opacity"
        dur="4s"
        begin={begin}
        repeatCount="indefinite"
        values="0;1;1;0;0"
        keyTimes={opacityKeyTimes}
      />
    </circle>
  );
}

export default function FunnelGraph({ t }: { t: Dict }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const g = t.graph;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (!("IntersectionObserver" in window)) {
      panel.classList.add("in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="graph-sec">
      <div className="container-wide">
        <div className="panel-wrap">
          <div className="graph-panel corners" ref={panelRef}>
            <i className="x bl dark"></i>
            <i className="x br dark"></i>
            <span className="gp-blob" aria-hidden="true"></span>
            <span className="gp-blob b2" aria-hidden="true"></span>
            <h2 className="gp-head">{g.title}</h2>

            {/* Desktop graph */}
            <svg
              className="gp-svg gp-desktop"
              viewBox="0 0 1160 640"
              fill="none"
              aria-label={g.ariaLabel}
              role="img"
            >
              <defs>
                <filter id="gp-sh" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="1" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity=".08" />
                </filter>
                <filter id="gp-blur" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
                <filter id="gp-blur-lg" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
              </defs>

              {/* soft light-blue funnel wash between the two dashed right-hand connectors */}
              <polygon points="912,136 928,272 610,342" fill="#BCEEFE" opacity=".22" />

              {/* scattered accents: glowing yellow hexagon, orange dot, blue dot, ghost hexagon */}
              <g className="gp-pop" style={pd(".65s")}>
                <polygon
                  points="250,442 261.3,448.5 261.3,461.5 250,468 238.7,461.5 238.7,448.5"
                  fill="#F7BE3A"
                  opacity=".65"
                  filter="url(#gp-blur)"
                />
                <polygon
                  points="250,442 261.3,448.5 261.3,461.5 250,468 238.7,461.5 238.7,448.5"
                  fill="#F7BE3A"
                  transform="rotate(9 250 455)"
                />
              </g>
              <circle className="gp-pop" style={pd(".75s")} cx="1052" cy="345" r="7" fill="#FFB266" />
              <circle className="gp-pop" style={pd(".85s")} cx="205" cy="185" r="5.5" fill="#92DCF5" />
              <polygon
                points="900,382 956.3,414.5 956.3,479.5 900,512 843.7,479.5 843.7,414.5"
                stroke="#E8E6E4"
                strokeWidth="1.5"
              />

              {/* hairline connectors: every service converges on the business */}
              <path d="M118 262 Q310 332 515 348" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />
              <path d="M496 126 Q506 228 549 310" stroke="#CDCCCB" strokeWidth="1.4" />
              <path d="M694 88 Q643 212 581 310" stroke="#CDCCCB" strokeWidth="1.4" />
              <path d="M912 136 Q760 228 614 334" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />
              <path d="M928 272 Q770 318 614 352" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />

              {/* tiny rotated-square diamonds sitting on the lines */}
              <rect x="-4" y="-4" width="8" height="8" transform="translate(514,224) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.2" />
              <rect x="-4" y="-4" width="8" height="8" transform="translate(640,205) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.2" />

              {/* dashed stub ending in a small gray dot */}
              <path d="M636 382 Q700 412 758 428" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="4 5" />
              <circle cx="766" cy="430" r="3.5" fill="#9B9897" />

              {/* eased dots flowing down the funnel (hidden under reduced motion) */}
              <g className="gp-dots">
                <FlowDot begin="0s" path="M118 262 Q310 332 515 348" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-0.8s" path="M496 126 Q506 228 549 310" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-1.6s" path="M694 88 Q643 212 581 310" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-2.4s" path="M912 136 Q760 228 614 334" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-3.2s" path="M928 272 Q770 318 614 352" r={3.5} fill="#0083F5" variant="funnel" />
              </g>

              {/* five service chips: white circular icon chip + two-line label */}
              <Chip delay=".05s" cx={110} cy={240} r={18} iconTransform="translate(100.5,230.5) scale(0.79)" icon={ICONS.phone} labelX={140} labelY={238} text={g.chips.speedToLead} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <Chip delay=".13s" cx={490} cy={104} r={18} iconTransform="translate(480.5,94.5) scale(0.79)" icon={ICONS.refresh} labelX={520} labelY={102} text={g.chips.nurturing} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <Chip delay=".21s" cx={700} cy={64} r={18} iconTransform="translate(690.5,54.5) scale(0.79)" icon={ICONS.gear} labelX={730} labelY={62} text={g.chips.automations} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <Chip delay=".29s" cx={930} cy={120} r={18} iconTransform="translate(920.5,110.5) scale(0.79)" icon={ICONS.sparkle} labelX={960} labelY={118} text={g.chips.customAi} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <Chip delay=".37s" cx={950} cy={265} r={18} iconTransform="translate(940.5,255.5) scale(0.79)" icon={ICONS.headset} labelX={980} labelY={263} text={g.chips.receptionist} filterId="gp-sh" labelSize={14.5} statSize={13} />

              {/* funnel neck: solid ink dot inside dashed corner brackets, tiny gray label above */}
              <g className="gp-pop">
                <text
                  x="565"
                  y="296"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="500"
                  fill="#82807D"
                  style={{ fontFamily: "var(--font-title)", letterSpacing: ".14em" }}
                >
                  {g.center}
                </text>
                <path d="M521 332V318h14M595 318h14v14M521 368v14h14M595 382h14v-14" stroke="#9B9897" strokeWidth="1.3" strokeDasharray="2.5 2.5" />
                <circle cx="565" cy="350" r="6" fill="#060504" />
              </g>

              {/* the money drop: everything funnels into dollars */}
              <path d="M565 390V482" stroke="#060504" strokeWidth="2" />
              <path d="M558 474l7 9 7-9" stroke="#060504" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <g className="gp-dots">
                <FlowDot begin="0s" path="M565 396 L565 478" r={4.5} fill="#6DC277" variant="money" />
                <FlowDot begin="-2s" path="M565 396 L565 478" r={4.5} fill="#6DC277" variant="money" />
              </g>

              {/* the destination: big green dollar node with glow */}
              <circle cx="565" cy="540" r="40" fill="#6DC277" opacity=".3" filter="url(#gp-blur-lg)">
                <animate
                  attributeName="opacity"
                  dur="2s"
                  begin="1.6s"
                  repeatCount="indefinite"
                  values=".3;.55;.3"
                  keyTimes="0;.25;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                />
              </circle>
              <g className="gp-pop" style={pd(".5s")}>
                <circle cx="565" cy="540" r="32" stroke="#6DC277" strokeOpacity=".4" strokeWidth="1.3" />
                <circle cx="565" cy="540" r="26" fill="#6DC277" filter="url(#gp-sh)" />
                <text x="565" y="548" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>
                  $
                </text>
                <text x="612" y={g.moneySub ? 536 : 546} fontSize="18" fontWeight="600" fill="#060504" style={LABEL_STYLE}>
                  {g.moneyLabel}
                </text>
                {g.moneySub && (
                  <text x="612" y="558" fontSize="15.5" fontWeight="600" fill="#33793E" style={LABEL_STYLE}>
                    {g.moneySub}
                  </text>
                )}
              </g>
            </svg>

            {/* Mobile graph (same anatomy, stacked) */}
            <svg className="gp-svg gp-mobile" viewBox="0 0 420 590" fill="none" aria-hidden="true">
              <defs>
                <filter id="gpm-sh" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity=".08" />
                </filter>
                <filter id="gpm-blur" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <filter id="gpm-blur-lg" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="11" />
                </filter>
              </defs>

              {/* funnel wash between the two dashed left-hand connectors */}
              <polygon points="52,58 46,150 198,292" fill="#BCEEFE" opacity=".22" />

              {/* accents */}
              <g className="gp-pop" style={pd(".65s")}>
                <polygon
                  points="386,187 394.7,192 394.7,202 386,207 377.3,202 377.3,192"
                  fill="#F7BE3A"
                  opacity=".65"
                  filter="url(#gpm-blur)"
                />
                <polygon
                  points="386,187 394.7,192 394.7,202 386,207 377.3,202 377.3,192"
                  fill="#F7BE3A"
                  transform="rotate(9 386 197)"
                />
              </g>
              <circle className="gp-pop" style={pd(".75s")} cx="28" cy="282" r="5" fill="#FFB266" />
              <circle className="gp-pop" style={pd(".85s")} cx="382" cy="262" r="4.5" fill="#92DCF5" />
              <polygon points="350,430 384.6,450 384.6,490 350,510 315.4,490 315.4,450" stroke="#E8E6E4" strokeWidth="1.4" />

              {/* connectors */}
              <path d="M52 56 C150 96 202 160 202 296" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M256 58 C220 100 216 170 214 296" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M46 148 Q120 215 190 298" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M240 150 Q230 240 228 298" stroke="#CDCCCB" strokeWidth="1.3" />
              <path d="M238 242 Q250 272 250 298" stroke="#CDCCCB" strokeWidth="1.3" />

              {/* diamonds on lines */}
              <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(160,141) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.1" />
              <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(235,201) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.1" />

              {/* dashed stub + gray dot */}
              <path d="M162 366 Q120 400 88 418" stroke="#B4B2B1" strokeWidth="1.1" strokeDasharray="4 5" />
              <circle cx="84" cy="421" r="3" fill="#9B9897" />

              {/* eased dots */}
              <g className="gp-dots">
                <FlowDot begin="0s" path="M52 56 C150 96 202 160 202 296" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-0.8s" path="M256 58 C220 100 216 170 214 296" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-1.6s" path="M46 148 Q120 215 190 298" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-2.4s" path="M240 150 Q230 240 228 298" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-3.2s" path="M238 242 Q250 272 250 298" r={3.2} fill="#0083F5" variant="funnel" />
              </g>

              {/* five service chips */}
              <Chip delay=".05s" cx={36} cy={44} r={16} iconTransform="translate(28,36) scale(0.66)" icon={ICONS.phone} labelX={60} labelY={41} text={g.chips.speedToLead} filterId="gpm-sh" labelSize={13} statSize={12} />
              <Chip delay=".13s" cx={264} cy={40} r={16} iconTransform="translate(256,32) scale(0.66)" icon={ICONS.sparkle} labelX={288} labelY={37} text={g.chips.customAi} filterId="gpm-sh" labelSize={13} statSize={12} />
              <Chip delay=".21s" cx={30} cy={138} r={16} iconTransform="translate(22,130) scale(0.66)" icon={ICONS.refresh} labelX={54} labelY={135} text={g.chips.nurturing} filterId="gpm-sh" labelSize={13} statSize={12} />
              <Chip delay=".29s" cx={246} cy={132} r={16} iconTransform="translate(238,124) scale(0.66)" icon={ICONS.gear} labelX={270} labelY={129} text={g.chips.automations} filterId="gpm-sh" labelSize={13} statSize={12} />
              <Chip delay=".37s" cx={250} cy={228} r={16} iconTransform="translate(242,220) scale(0.66)" icon={ICONS.headset} labelX={274} labelY={225} text={g.chips.receptionist} filterId="gpm-sh" labelSize={13} statSize={12} />

              {/* funnel neck */}
              <g className="gp-pop">
                <text
                  x="210"
                  y="286"
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="500"
                  fill="#82807D"
                  style={{ fontFamily: "var(--font-title)", letterSpacing: ".14em" }}
                >
                  {g.center}
                </text>
                <path d="M166 312V300h12M242 300h12v12M166 346v12h12M242 358h12v-12" stroke="#9B9897" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
                <circle cx="210" cy="329" r="5" fill="#060504" />
              </g>

              {/* money drop */}
              <path d="M210 362V448" stroke="#060504" strokeWidth="1.8" />
              <path d="M203 441l7 8 7-8" stroke="#060504" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <g className="gp-dots">
                <FlowDot begin="0s" path="M210 368 L210 444" r={4} fill="#6DC277" variant="money" />
                <FlowDot begin="-2s" path="M210 368 L210 444" r={4} fill="#6DC277" variant="money" />
              </g>

              {/* destination */}
              <circle cx="210" cy="496" r="34" fill="#6DC277" opacity=".3" filter="url(#gpm-blur-lg)">
                <animate
                  attributeName="opacity"
                  dur="2s"
                  begin="1.6s"
                  repeatCount="indefinite"
                  values=".3;.55;.3"
                  keyTimes="0;.25;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                />
              </circle>
              <g className="gp-pop" style={pd(".5s")}>
                <circle cx="210" cy="496" r="28" stroke="#6DC277" strokeOpacity=".4" strokeWidth="1.2" />
                <circle cx="210" cy="496" r="23" fill="#6DC277" filter="url(#gpm-sh)" />
                <text x="210" y="503" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>
                  $
                </text>
                <text x="210" y="545" textAnchor="middle" fontSize="15.5" fontWeight="600" fill="#060504" style={LABEL_STYLE}>
                  {g.moneyLabel}
                </text>
                {g.moneySub && (
                  <text x="210" y="565" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="#33793E" style={LABEL_STYLE}>
                    {g.moneySub}
                  </text>
                )}
              </g>
            </svg>

            <div className="gp-caps">
              <span className="gp-cap">{g.capLeft}</span>
              <span className="gp-cap">{g.capRight}</span>
            </div>
          </div>
          <span className="blob glow-orange" aria-hidden="true"></span>
          <span className="blob glow-blue" aria-hidden="true"></span>
        </div>
      </div>
    </section>
  );
}
