"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { Dict } from "../content";

/* Node-graph panel — the reference "how-it-works" anatomy recomposed as a
   funnel: five app-icon-style squircle service tiles wired to a dashed-bracket
   storefront neck ("YOUR BUSINESS"), then a single drop line into a crafted
   gold-green coin. Tiles pop in via IntersectionObserver (adds .in on the
   panel); SMIL dots travel the connectors with cubic easing. All node artwork
   is factored into shared components (ServiceTile / StorefrontTile / CoinNode)
   parameterised by size + id prefix so the desktop and mobile SVGs render the
   exact same illustrations at different scales. */

const pd = (delay: string) => ({ "--pd": delay }) as CSSProperties;

const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-sans)",
  letterSpacing: "-.01em",
};

/* Opt a text element out of the global white label-halo (globals.css strokes
   every non-white <text> so hairlines never strike through labels). */
const NO_HALO: CSSProperties = { fontFamily: "var(--font-sans)", stroke: "none" };

/* ---------- Service tiles: per-service pastel duotone palettes ---------- */

type ServiceId = "phone" | "refresh" | "gear" | "sparkle" | "headset";

const TILE_PALETTES: Record<ServiceId, { g1: string; g2: string; edge: string; deep: string }> = {
  phone: { g1: "#FFE3B8", g2: "#FFB266", edge: "#E8A159", deep: "#8F4D12" },
  refresh: { g1: "#FFD5E4", g2: "#FF99BD", edge: "#EE86AE", deep: "#96284F" },
  gear: { g1: "#D9E1FF", g2: "#B2C2FF", edge: "#98ACF0", deep: "#3D4C93" },
  sparkle: { g1: "#DDF6FF", g2: "#92DCF5", edge: "#79C6E6", deep: "#155F86" },
  headset: { g1: "#FFEDC4", g2: "#F7CE6B", edge: "#DFAE3F", deep: "#8A5F0E" },
};

/* Richer duotone icons (24-unit box): deep hue-tinted fills + white accents. */
function TileIcon({ id, deep }: { id: ServiceId; deep: string }) {
  switch (id) {
    case "phone":
      // handset + outgoing wave: speed-to-lead
      return (
        <>
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
            fill={deep}
            transform="translate(-0.8,1.6) scale(0.88)"
          />
          <circle cx="4.7" cy="6.2" r="1" fill="#fff" opacity=".75" />
          <path d="M15 7.6a4.6 4.6 0 0 1 2.7 2.7" stroke={deep} strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <path d="M16.4 4.4a8 8 0 0 1 4.5 4.5" stroke={deep} strokeWidth="1.9" strokeLinecap="round" fill="none" opacity=".5" />
        </>
      );
    case "refresh":
      // circular arrows around an envelope: nurturing loop
      return (
        <>
          <path d="M4.6 10.6A7.7 7.7 0 0 1 17 5.8" stroke={deep} strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <polygon points="16.6,2.7 20.2,6.4 15.6,7.4" fill={deep} />
          <path d="M19.4 13.4A7.7 7.7 0 0 1 7 18.2" stroke={deep} strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <polygon points="7.4,21.3 3.8,17.6 8.4,16.6" fill={deep} />
          <rect x="8.2" y="8.9" width="7.6" height="6" rx="1.1" fill="#fff" stroke={deep} strokeWidth="1.4" />
          <path d="M8.7 9.8l3.3 2.6 3.3-2.6" stroke={deep} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    case "gear":
      // main gear + white sub-gear: automations
      return (
        <>
          <g transform="translate(10.3,10.5)">
            {[0, 45, 90, 135].map((a) => (
              <rect key={a} x="-1.6" y="-7.4" width="3.2" height="14.8" rx="1.3" fill={deep} transform={`rotate(${a})`} />
            ))}
            <circle r="4.9" fill={deep} />
            <circle r="2" fill="#fff" />
          </g>
          <g transform="translate(17.7,17.5)">
            <circle r="4.3" fill="#fff" opacity=".9" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1="0" y1="-2.9" x2="0" y2="-4.3" stroke={deep} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
            <circle r="2.9" fill="#fff" stroke={deep} strokeWidth="1.5" />
            <circle r="1" fill={deep} />
          </g>
        </>
      );
    case "sparkle":
      // twin sparkles: custom AI
      return (
        <>
          <path
            d="M10.3 2.9c.55 3.4 2.7 5.55 6.1 6.1-3.4.55-5.55 2.7-6.1 6.1-.55-3.4-2.7-5.55-6.1-6.1 3.4-.55 5.55-2.7 6.1-6.1z"
            fill={deep}
          />
          <path
            d="M17.7 13.9c.34 2.1 1.66 3.42 3.76 3.76-2.1.34-3.42 1.66-3.76 3.76-.34-2.1-1.66-3.42-3.76-3.76 2.1-.34 3.42-1.66 3.76-3.76z"
            fill="#fff"
            stroke={deep}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="4.8" r="1.15" fill={deep} />
        </>
      );
    case "headset":
      // headset + boom mic: receptionist
      return (
        <>
          <path d="M4.7 13.7v-2.2a7.3 7.3 0 0 1 14.6 0v2.2" stroke={deep} strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <rect x="3" y="12.4" width="4.3" height="6.9" rx="2.15" fill={deep} />
          <rect x="16.7" y="12.4" width="4.3" height="6.9" rx="2.15" fill={deep} />
          <circle cx="4.6" cy="14.2" r=".8" fill="#fff" opacity=".7" />
          <circle cx="18.3" cy="14.2" r=".8" fill="#fff" opacity=".7" />
          <path d="M18.9 19.5v.2a2.2 2.2 0 0 1-2.2 2.2h-2" stroke={deep} strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <circle cx="13.2" cy="21.9" r="1.8" fill="#fff" stroke={deep} strokeWidth="1.5" />
        </>
      );
  }
}

/* ---------- Shared gradient defs (one set per SVG, id-prefixed) ---------- */

function NodeDefs({ p }: { p: string }) {
  return (
    <>
      {/* tile gloss */}
      <linearGradient id={`${p}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".85" />
        <stop offset=".55" stopColor="#fff" stopOpacity=".22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {(Object.keys(TILE_PALETTES) as ServiceId[]).map((id) => (
        <linearGradient key={id} id={`${p}-tg-${id}`} x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" stopColor={TILE_PALETTES[id].g1} />
          <stop offset="1" stopColor={TILE_PALETTES[id].g2} />
        </linearGradient>
      ))}
      {/* storefront */}
      <linearGradient id={`${p}-sf-tile`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F0EBE2" />
      </linearGradient>
      <linearGradient id={`${p}-sf-wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF9EC" />
        <stop offset="1" stopColor="#F4E6CD" />
      </linearGradient>
      <linearGradient id={`${p}-sf-awn`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4CACFF" />
        <stop offset="1" stopColor="#0083F5" />
      </linearGradient>
      <linearGradient id={`${p}-sf-win`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E2F7FF" />
        <stop offset="1" stopColor="#92DCF5" />
      </linearGradient>
      <linearGradient id={`${p}-sf-door`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6E4F3A" />
        <stop offset="1" stopColor="#503626" />
      </linearGradient>
      {/* coin */}
      <linearGradient id={`${p}-coin-face`} x1="0" y1="0" x2=".8" y2="1">
        <stop offset="0" stopColor="#B9ECB4" />
        <stop offset=".55" stopColor="#6DC277" />
        <stop offset="1" stopColor="#4E9F5C" />
      </linearGradient>
      <linearGradient id={`${p}-coin-edge`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3E8B4A" />
        <stop offset="1" stopColor="#245F31" />
      </linearGradient>
      <radialGradient id={`${p}-coin-sheen`} cx=".32" cy=".2" r=".65">
        <stop offset="0" stopColor="#FFF3C4" stopOpacity=".65" />
        <stop offset=".55" stopColor="#FFF3C4" stopOpacity=".12" />
        <stop offset="1" stopColor="#FFF3C4" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${p}-coin-spec`} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#fff" stopOpacity=".9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

/* ---------- Service tile: app-icon squircle + duotone icon + labels ---------- */

type ChipText = { label: string; stat: string };

function ServiceTile({
  p,
  id,
  delay,
  cx,
  cy,
  s,
  labelX,
  labelY,
  text,
  filterId,
  labelSize,
  statSize,
}: {
  p: string;
  id: ServiceId;
  delay: string;
  cx: number;
  cy: number;
  s: number;
  labelX: number;
  labelY: number;
  text: ChipText;
  filterId: string;
  labelSize: number;
  statSize: number;
}) {
  const h = s / 2;
  const rx = s * 0.26;
  const pal = TILE_PALETTES[id];
  const k = (s * 0.62) / 24;
  return (
    <g className="gp-pop" style={pd(delay)}>
      <rect x={cx - h} y={cy - h} width={s} height={s} rx={rx} fill={`url(#${p}-tg-${id})`} stroke={pal.edge} strokeWidth="1" filter={`url(#${filterId})`} />
      <rect x={cx - h + 1.4} y={cy - h + 1.4} width={s - 2.8} height={s - 2.8} rx={rx - 1.4} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1" />
      <rect x={cx - h + 2.6} y={cy - h + 2.2} width={s - 5.2} height={s * 0.46} rx={rx - 2.6} fill={`url(#${p}-gloss)`} opacity=".6" />
      <g transform={`translate(${cx - 12 * k},${cy - 12 * k}) scale(${k})`}>
        <TileIcon id={id} deep={pal.deep} />
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

/* ---------- Storefront tile: the business (illustrated squircle) ---------- */

function StorefrontTile({ p, cx, cy, s, filterId }: { p: string; cx: number; cy: number; s: number; filterId: string }) {
  const k = s / 56;
  return (
    <g transform={`translate(${cx - s / 2},${cy - s / 2}) scale(${k})`}>
      {/* tile */}
      <rect x="0" y="0" width="56" height="56" rx="15" fill={`url(#${p}-sf-tile)`} stroke="#DCD7CE" strokeWidth="1" filter={`url(#${filterId})`} />
      <rect x="1.4" y="1.4" width="53.2" height="53.2" rx="13.6" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1" />
      {/* wall + fascia sign */}
      <rect x="10" y="19" width="36" height="28" rx="1.5" fill={`url(#${p}-sf-wall)`} stroke="#3A342E" strokeWidth="1.2" />
      <rect x="8.5" y="12" width="39" height="7.4" rx="2" fill="#FFE5B2" stroke="#3A342E" strokeWidth="1.2" />
      <circle cx="14.6" cy="15.7" r="1.3" fill="#0083F5" />
      <rect x="18.5" y="14.8" width="17" height="1.9" rx=".95" fill="#E3B95E" />
      {/* awning: striped, scalloped */}
      <clipPath id={`${p}-awn`}>
        <path d="M10 20.2H46l3.5 7.2a5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0Z" />
      </clipPath>
      <g clipPath={`url(#${p}-awn)`}>
        <rect x="5" y="19" width="46" height="14.5" fill="#F6FBFF" />
        <rect x="6.5" y="19" width="6.3" height="14.5" fill={`url(#${p}-sf-awn)`} />
        <rect x="19.1" y="19" width="6.3" height="14.5" fill={`url(#${p}-sf-awn)`} />
        <rect x="31.7" y="19" width="6.3" height="14.5" fill={`url(#${p}-sf-awn)`} />
        <rect x="44.3" y="19" width="6.3" height="14.5" fill={`url(#${p}-sf-awn)`} />
      </g>
      <path
        d="M10 20.2H46l3.5 7.2a5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0 5.4 4.8 0 0 1-10.75 0Z"
        fill="none"
        stroke="#3A342E"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* shade under the awning */}
      <rect x="10.8" y="32.4" width="34.4" height="2.4" rx="1.2" fill="#3A342E" opacity=".1" />
      {/* door */}
      <rect x="15" y="35" width="10" height="11.9" rx="1.8" fill={`url(#${p}-sf-door)`} stroke="#3A342E" strokeWidth="1.2" />
      <path d="M20 37.4v7.4" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".25" />
      <circle cx="22.6" cy="41.6" r="1" fill="#F7BE3A" />
      {/* window */}
      <rect x="28.5" y="34.6" width="14" height="9.4" rx="1.4" fill={`url(#${p}-sf-win)`} stroke="#3A342E" strokeWidth="1.2" />
      <path d="M35.5 35.2v8.2" stroke="#3A342E" strokeWidth=".9" opacity=".55" />
      <path d="M30.6 42.2l5.8-5.8M33.4 43.4l6.6-6.6" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
      <rect x="27.4" y="44" width="16.2" height="1.9" rx=".95" fill="#E2CFA6" stroke="#3A342E" strokeWidth="1" />
      {/* sidewalk */}
      <path d="M7.5 49.4H48.5" stroke="#C7C0B4" strokeWidth="1.2" strokeLinecap="round" />
      {/* tile gloss */}
      <rect x="2.6" y="2.2" width="50.8" height="23" rx="12.5" fill={`url(#${p}-gloss)`} opacity=".3" />
    </g>
  );
}

/* ---------- Coin node: the destination (gold-green coin with depth) ---------- */

function CoinNode({ p, cx, cy, r, filterId }: { p: string; cx: number; cy: number; r: number; filterId: string }) {
  const k = r / 34;
  const edgeDy = 3.2 * k;
  return (
    <g>
      {/* face ring groove */}
      <circle cx={cx} cy={cy + edgeDy} r={r} fill={`url(#${p}-coin-edge)`} stroke="#235E2F" strokeWidth="1" filter={`url(#${filterId})`} />
      <circle cx={cx} cy={cy + edgeDy} r={r - 1.6 * k} fill="none" stroke="#1D5228" strokeOpacity=".5" strokeWidth={1.7 * k} strokeDasharray={`${1.5 * k} ${2.6 * k}`} />
      {/* face */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${p}-coin-face)`} stroke="#3E8B4A" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${p}-coin-sheen)`} />
      {/* reeded face rim + embossed ring */}
      <circle cx={cx} cy={cy} r={r * 0.9} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth={1.5 * k} strokeDasharray={`${1.3 * k} ${4.2 * k}`} />
      <circle cx={cx} cy={cy} r={r * 0.76} fill="none" stroke="#2F7A3C" strokeOpacity=".45" strokeWidth={1.1 * k} />
      <circle cx={cx} cy={cy} r={r * 0.76 - 1.3 * k} fill="none" stroke="#ECFFE2" strokeOpacity=".55" strokeWidth={1 * k} />
      {/* inner bottom shadow */}
      <path
        d={`M ${cx - r * 0.62} ${cy + r * 0.62} A ${r * 0.88} ${r * 0.88} 0 0 0 ${cx + r * 0.62} ${cy + r * 0.62}`}
        fill="none"
        stroke="#2E6E3A"
        strokeOpacity=".3"
        strokeWidth={2.4 * k}
        strokeLinecap="round"
      />
      {/* embossed $ */}
      <text x={cx + 0.9 * k} y={cy + r * 0.31 + 1.4 * k} textAnchor="middle" fontSize={30 * k} fontWeight="800" fill="#2E6E3A" style={NO_HALO}>
        $
      </text>
      <text x={cx} y={cy + r * 0.31} textAnchor="middle" fontSize={30 * k} fontWeight="800" fill="#FFFBE8" style={NO_HALO}>
        $
      </text>
      {/* specular highlight */}
      <ellipse
        cx={cx - r * 0.42}
        cy={cy - r * 0.44}
        rx={r * 0.4}
        ry={r * 0.2}
        fill={`url(#${p}-coin-spec)`}
        opacity=".7"
        transform={`rotate(-30 ${cx - r * 0.42} ${cy - r * 0.44})`}
      />
      <path
        d={`M ${cx - r * 0.66} ${cy - r * 0.48} A ${r * 0.82} ${r * 0.82} 0 0 1 ${cx - r * 0.16} ${cy - r * 0.8}`}
        fill="none"
        stroke="#fff"
        strokeOpacity=".85"
        strokeWidth={2 * k}
        strokeLinecap="round"
      />
      {/* "+" ticks synced to dot arrivals (transient, hidden under reduced motion) */}
      <g className="gp-dots">
        <text x={cx - r * 1.1} y={cy - r * 0.62} textAnchor="middle" fontSize={15 * k} fontWeight="700" fill="#2F9E4F" opacity="0" style={NO_HALO}>
          +
          <animate attributeName="opacity" dur="4s" begin="1.6s" repeatCount="indefinite" values="0;1;0;0" keyTimes="0;.08;.3;1" />
          <animateTransform attributeName="transform" type="translate" dur="4s" begin="1.6s" repeatCount="indefinite" values={`0 0;0 ${-14 * k};0 ${-14 * k}`} keyTimes="0;.3;1" />
        </text>
        <text x={cx + r * 1.1} y={cy - r * 0.62} textAnchor="middle" fontSize={15 * k} fontWeight="700" fill="#2F9E4F" opacity="0" style={NO_HALO}>
          +
          <animate attributeName="opacity" dur="4s" begin="3.6s" repeatCount="indefinite" values="0;1;0;0" keyTimes="0;.08;.3;1" />
          <animateTransform attributeName="transform" type="translate" dur="4s" begin="3.6s" repeatCount="indefinite" values={`0 0;0 ${-14 * k};0 ${-14 * k}`} keyTimes="0;.3;1" />
        </text>
      </g>
    </g>
  );
}

/* ---------- SMIL flow dot ---------- */

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
                <NodeDefs p="gp" />
              </defs>

              {/* soft light-blue funnel wash between the two dashed right-hand connectors */}
              <polygon points="912,136 928,272 596,344" fill="#BCEEFE" opacity=".22" />

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
              <path d="M118 262 Q310 332 540 349" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />
              <path d="M496 126 Q506 228 553 324" stroke="#CDCCCB" strokeWidth="1.4" />
              <path d="M694 88 Q643 212 577 324" stroke="#CDCCCB" strokeWidth="1.4" />
              <path d="M912 136 Q760 228 590 338" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />
              <path d="M928 272 Q770 318 590 352" stroke="#B4B2B1" strokeWidth="1.3" strokeDasharray="5 5" />

              {/* tiny rotated-square diamonds sitting on the lines */}
              <rect x="-4" y="-4" width="8" height="8" transform="translate(514,224) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.2" />
              <rect x="-4" y="-4" width="8" height="8" transform="translate(640,205) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.2" />

              {/* dashed stub ending in a small gray dot */}
              <path d="M636 382 Q700 412 758 428" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="4 5" />
              <circle cx="766" cy="430" r="3.5" fill="#9B9897" />

              {/* eased dots flowing down the funnel (hidden under reduced motion) */}
              <g className="gp-dots">
                <FlowDot begin="0s" path="M118 262 Q310 332 540 349" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-0.8s" path="M496 126 Q506 228 553 324" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-1.6s" path="M694 88 Q643 212 577 324" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-2.4s" path="M912 136 Q760 228 590 338" r={3.5} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-3.2s" path="M928 272 Q770 318 590 352" r={3.5} fill="#0083F5" variant="funnel" />
              </g>

              {/* five service tiles: app-icon squircle + duotone icon + two-line label */}
              <ServiceTile p="gp" id="phone" delay=".05s" cx={110} cy={240} s={54} labelX={148} labelY={238} text={g.chips.speedToLead} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <ServiceTile p="gp" id="refresh" delay=".13s" cx={490} cy={104} s={54} labelX={528} labelY={102} text={g.chips.nurturing} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <ServiceTile p="gp" id="gear" delay=".21s" cx={700} cy={64} s={54} labelX={738} labelY={62} text={g.chips.automations} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <ServiceTile p="gp" id="sparkle" delay=".29s" cx={930} cy={120} s={54} labelX={968} labelY={118} text={g.chips.customAi} filterId="gp-sh" labelSize={14.5} statSize={13} />
              <ServiceTile p="gp" id="headset" delay=".37s" cx={950} cy={265} s={54} labelX={988} labelY={263} text={g.chips.receptionist} filterId="gp-sh" labelSize={14.5} statSize={13} />

              {/* funnel neck: storefront tile inside dashed corner brackets, tiny gray label above */}
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
                <path d="M523 322V308h14M593 308h14v14M523 378v14h14M593 392h14v-14" stroke="#9B9897" strokeWidth="1.3" strokeDasharray="2.5 2.5" />
                <StorefrontTile p="gp" cx={565} cy={350} s={62} filterId="gp-sh" />
              </g>

              {/* the money drop: everything funnels into dollars */}
              <path d="M565 396V484" stroke="#060504" strokeWidth="2" />
              <path d="M558 476l7 9 7-9" stroke="#060504" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <g className="gp-dots">
                <FlowDot begin="0s" path="M565 402 L565 480" r={4.5} fill="#6DC277" variant="money" />
                <FlowDot begin="-2s" path="M565 402 L565 480" r={4.5} fill="#6DC277" variant="money" />
              </g>

              {/* the destination: crafted gold-green coin with glow */}
              <circle cx="565" cy="540" r="44" fill="#6DC277" opacity=".3" filter="url(#gp-blur-lg)">
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
                <circle cx="565" cy="540" r="42" stroke="#6DC277" strokeOpacity=".4" strokeWidth="1.3" />
                <CoinNode p="gp" cx={565} cy={540} r={34} filterId="gp-sh" />
                <text x="618" y={g.moneySub ? 536 : 546} fontSize="18" fontWeight="600" fill="#060504" style={LABEL_STYLE}>
                  {g.moneyLabel}
                </text>
                {g.moneySub && (
                  <text x="618" y="558" fontSize="15.5" fontWeight="600" fill="#33793E" style={LABEL_STYLE}>
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
                <NodeDefs p="gpm" />
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
              <path d="M52 56 C150 96 202 160 202 308" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M256 58 C220 100 216 170 213 308" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M46 148 Q120 215 194 307" stroke="#B4B2B1" strokeWidth="1.2" strokeDasharray="5 5" />
              <path d="M240 150 Q230 240 227 308" stroke="#CDCCCB" strokeWidth="1.3" />
              <path d="M238 246 Q247 278 229 308" stroke="#CDCCCB" strokeWidth="1.3" />

              {/* diamonds on lines */}
              <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(160,141) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.1" />
              <rect x="-3.5" y="-3.5" width="7" height="7" transform="translate(235,201) rotate(45)" fill="#fff" stroke="#B4B2B1" strokeWidth="1.1" />

              {/* dashed stub + gray dot */}
              <path d="M162 366 Q120 400 88 418" stroke="#B4B2B1" strokeWidth="1.1" strokeDasharray="4 5" />
              <circle cx="84" cy="421" r="3" fill="#9B9897" />

              {/* eased dots */}
              <g className="gp-dots">
                <FlowDot begin="0s" path="M52 56 C150 96 202 160 202 308" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-0.8s" path="M256 58 C220 100 216 170 213 308" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-1.6s" path="M46 148 Q120 215 194 307" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-2.4s" path="M240 150 Q230 240 227 308" r={3.2} fill="#0083F5" variant="funnel" />
                <FlowDot begin="-3.2s" path="M238 246 Q247 278 229 308" r={3.2} fill="#0083F5" variant="funnel" />
              </g>

              {/* five service tiles */}
              <ServiceTile p="gpm" id="phone" delay=".05s" cx={36} cy={44} s={44} labelX={66} labelY={41} text={g.chips.speedToLead} filterId="gpm-sh" labelSize={13} statSize={12} />
              <ServiceTile p="gpm" id="sparkle" delay=".13s" cx={264} cy={40} s={44} labelX={294} labelY={37} text={g.chips.customAi} filterId="gpm-sh" labelSize={13} statSize={12} />
              <ServiceTile p="gpm" id="refresh" delay=".21s" cx={30} cy={138} s={44} labelX={60} labelY={135} text={g.chips.nurturing} filterId="gpm-sh" labelSize={13} statSize={12} />
              <ServiceTile p="gpm" id="gear" delay=".29s" cx={246} cy={132} s={44} labelX={276} labelY={129} text={g.chips.automations} filterId="gpm-sh" labelSize={13} statSize={12} />
              <ServiceTile p="gpm" id="headset" delay=".37s" cx={250} cy={228} s={44} labelX={280} labelY={225} text={g.chips.receptionist} filterId="gpm-sh" labelSize={13} statSize={12} />

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
                <path d="M175 307V295h12M233 295h12v12M175 351v12h12M233 363h12v-12" stroke="#9B9897" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
                <StorefrontTile p="gpm" cx={210} cy={329} s={50} filterId="gpm-sh" />
              </g>

              {/* money drop */}
              <path d="M210 368V450" stroke="#060504" strokeWidth="1.8" />
              <path d="M203 442l7 8 7-8" stroke="#060504" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <g className="gp-dots">
                <FlowDot begin="0s" path="M210 373 L210 446" r={4} fill="#6DC277" variant="money" />
                <FlowDot begin="-2s" path="M210 373 L210 446" r={4} fill="#6DC277" variant="money" />
              </g>

              {/* destination */}
              <circle cx="210" cy="496" r="36" fill="#6DC277" opacity=".3" filter="url(#gpm-blur-lg)">
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
                <circle cx="210" cy="496" r="34.5" stroke="#6DC277" strokeOpacity=".4" strokeWidth="1.2" />
                <CoinNode p="gpm" cx={210} cy={496} r={28} filterId="gpm-sh" />
                <text x="210" y="551" textAnchor="middle" fontSize="15.5" fontWeight="600" fill="#060504" style={LABEL_STYLE}>
                  {g.moneyLabel}
                </text>
                {g.moneySub && (
                  <text x="210" y="571" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="#33793E" style={LABEL_STYLE}>
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
