import type { CSSProperties } from "react";
import type { Dict } from "../content";

const fall = (vars: Record<string, string>) => vars as CSSProperties;

function Crosshairs() {
  return (
    <>
      <i className="x tl"></i>
      <i className="x tr"></i>
      <i className="x bl"></i>
      <i className="x br"></i>
    </>
  );
}

/* Scene 1 — the waiting lead: speech bubble where the "?" gives way to the
   typing dots that never get answered. */
function WaitingScene() {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path
        d="M15 11h26a8 8 0 0 1 8 8v11a8 8 0 0 1-8 8H27l-8 7v-7h-4a8 8 0 0 1-8-8V19a8 8 0 0 1 8-8z"
        fill="#fff"
        stroke="#353231"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <text
        className="pq-q"
        x="28"
        y="30.5"
        textAnchor="middle"
        fontSize="16"
        fontWeight="500"
        fill="#060504"
        style={{ fontFamily: "var(--font-title)" }}
      >
        ?
      </text>
      <g className="pq-wait" fill="#9B9897">
        <circle cx="21.5" cy="25" r="1.8" />
        <circle cx="28" cy="25" r="1.8" />
        <circle cx="34.5" cy="25" r="1.8" />
      </g>
    </svg>
  );
}

/* Scene 2 — the dollar coin falls, hits the ground and shatters (looped).
   Static base = the shattered end state (prefers-reduced-motion). */
function CoinScene() {
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="pdL">
          <path d="M38 33A15 15 0 0 0 38 63L40 57 34.5 51.5 39.5 45 35 39Z" />
        </clipPath>
        <clipPath id="pdR">
          <path d="M38 33A15 15 0 0 1 38 63L40 57 34.5 51.5 39.5 45 35 39Z" />
        </clipPath>
      </defs>
      <path d="M8 64h60" stroke="#353231" strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
      <path className="pd-sp" d="M27 26v7" stroke="#353231" strokeOpacity=".35" strokeWidth="1.5" strokeLinecap="round" />
      <path
        className="pd-sp"
        style={{ animationDelay: ".15s" }}
        d="M49 21v8"
        stroke="#353231"
        strokeOpacity=".35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g className="pd-whole">
        <circle cx="38" cy="48" r="15" fill="#fff" stroke="#353231" strokeWidth="1.8" />
        <circle cx="38" cy="48" r="11.3" stroke="#353231" strokeOpacity=".25" strokeWidth="1" strokeDasharray="2.5 3" />
        <text x="38" y="53.5" textAnchor="middle" fontSize="16" fontWeight="600" fill="#33793E" style={{ fontFamily: "var(--font-sans)" }}>
          $
        </text>
      </g>
      <g className="pd-imp" stroke="#F7BE3A" strokeWidth="2" strokeLinecap="round">
        <path d="M20 56l-4-3M56 56l4-3M24 47l-5-1M52 47l5-1" />
      </g>
      <g className="pd-hl">
        <path d="M38 33A15 15 0 0 0 38 63L40 57 34.5 51.5 39.5 45 35 39Z" fill="#fff" stroke="#353231" strokeWidth="1.8" strokeLinejoin="round" />
        <text clipPath="url(#pdL)" x="38" y="53.5" textAnchor="middle" fontSize="16" fontWeight="600" fill="#33793E" style={{ fontFamily: "var(--font-sans)" }}>
          $
        </text>
      </g>
      <g className="pd-hr">
        <path d="M38 33A15 15 0 0 1 38 63L40 57 34.5 51.5 39.5 45 35 39Z" fill="#fff" stroke="#353231" strokeWidth="1.8" strokeLinejoin="round" />
        <text clipPath="url(#pdR)" x="38" y="53.5" textAnchor="middle" fontSize="16" fontWeight="600" fill="#33793E" style={{ fontFamily: "var(--font-sans)" }}>
          $
        </text>
      </g>
      <path className="pd-f" style={fall({ "--fx": "15px", "--fy": "-10px" })} d="M17 60l5-3 1.8 4.6-5.6 1z" fill="#fff" stroke="#353231" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        className="pd-f"
        style={fall({ "--fx": "-14px", "--fy": "-9px", animationDelay: ".06s" })}
        d="M56 59l4.6-2 1.4 4-5 .8z"
        fill="#fff"
        stroke="#353231"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        className="pd-f"
        style={fall({ "--fx": "9px", "--fy": "-16px", animationDelay: ".1s" })}
        d="M24 50l3.4-1.6 1.2 3.2-3.8.8z"
        fill="#F7BE3A"
        stroke="#353231"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        className="pd-f"
        style={fall({ "--fx": "-8px", "--fy": "-15px", animationDelay: ".14s" })}
        d="M50 49l3-1.4 1 2.8-3.4.7z"
        fill="#F7BE3A"
        stroke="#353231"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Scene 3 — the calendar with tasks that keep sliding around. */
function AdminScene() {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <rect x="9" y="12" width="38" height="34" rx="6" fill="#fff" stroke="#353231" strokeWidth="1.8" />
      <path d="M9 21h38" stroke="#353231" strokeWidth="1.8" />
      <path d="M19 8v7M37 8v7" stroke="#353231" strokeWidth="1.8" strokeLinecap="round" />
      <rect className="pc-a" x="14" y="26" width="13" height="7" rx="2.5" fill="#92DCF5" />
      <rect className="pc-b" x="29" y="35" width="13" height="7" rx="2.5" fill="#FFB266" />
    </svg>
  );
}

export default function PainSection({ t }: { t: Dict }) {
  const [card1, card2, card3] = t.pain.cards;
  return (
    <section className="pain" id="pain">
      <div className="container-wide">
        <div className="sec-head">
          <span className="v-line" style={{ left: 0 }} aria-hidden="true"></span>
          <span className="v-line" style={{ right: 0 }} aria-hidden="true"></span>
          <div className="pill">{t.pain.kicker}</div>
          <h2 className="statement">{t.pain.title}</h2>
        </div>
        <div className="grid-cards">
          <div className="card corners">
            <Crosshairs />
            <div className="tile" style={{ background: "linear-gradient(135deg,#E5FFFF,#BCEEFE)" }}>
              <WaitingScene />
            </div>
            <h3>{card1.h3}</h3>
            <p>{card1.p}</p>
          </div>
          <div className="card corners">
            <Crosshairs />
            <div className="tile tile-lg" style={{ background: "linear-gradient(135deg,#FFE5B2,#FFD499)" }}>
              <CoinScene />
            </div>
            <h3>{card2.h3}</h3>
            <p>{card2.p}</p>
          </div>
          <div className="card corners">
            <Crosshairs />
            <div className="tile" style={{ background: "linear-gradient(135deg,#FFB2D7,#FF99BD)" }}>
              <AdminScene />
            </div>
            <h3>{card3.h3}</h3>
            <p>{card3.p}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
