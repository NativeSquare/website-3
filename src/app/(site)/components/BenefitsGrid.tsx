import type { ReactNode } from "react";
import type { Dict } from "../content";

const TILES: { bg: string; icon: ReactNode }[] = [
  {
    bg: "linear-gradient(135deg,#E5FFFF,#BCEEFE)",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3.2 1.9" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#FFE5B2,#FFD499)",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
        <path d="M3.5 10h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 4-4" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#D6DFFF,#B2C2FF)",
    icon: (
      <>
        <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
        <rect x="3" y="13" width="4.4" height="7" rx="2.2" />
        <rect x="16.6" y="13" width="4.4" height="7" rx="2.2" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#FFB2D7,#FF99BD)",
    icon: (
      <>
        <path d="M20 10.5V5a2 2 0 0 0-2-2h-5.5a2 2 0 0 0-1.42.59l-7.5 7.5a2 2 0 0 0 0 2.82l5.01 5.01a2 2 0 0 0 2.82 0l7.5-7.5A2 2 0 0 0 20 10.5z" />
        <circle cx="15" cy="8" r="1.3" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#CCF6FF,#92DCF5)",
    icon: (
      <>
        <path d="M21.5 16.5l-8-8-5 5-6-6" />
        <path d="M15.5 16.5h6v-6" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#FFE5B2,#FFB266)",
    icon: <path d="M17 2.5l3.5 3.5L17 9.5M3.5 11V9.5a4 4 0 0 1 4-4h13M7 21.5L3.5 18 7 14.5M20.5 13v1.5a4 4 0 0 1-4 4h-13" />,
  },
  {
    bg: "linear-gradient(135deg,#FFD499,#FF99BD)",
    icon: <path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L3.4 9.8l6-.9L12 3.5z" />,
  },
];

export default function BenefitsGrid({ t }: { t: Dict }) {
  const b = t.benefits;
  return (
    <section className="get-sec">
      <div className="container-wide">
        <div className="sec-head">
          <span className="v-line" style={{ left: 0 }} aria-hidden="true"></span>
          <span className="v-line" style={{ right: 0 }} aria-hidden="true"></span>
          <div className="pill">{b.kicker}</div>
          <h2 className="statement">{b.title}</h2>
        </div>
        <div className="grid-cards get-grid">
          {b.items.map((item, i) => (
            <div className="card corners" key={item}>
              <i className="x tl"></i>
              <i className="x tr"></i>
              <i className="x bl"></i>
              <i className="x br"></i>
              <div className="tile-sm" style={{ background: TILES[i].bg }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F1E1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {TILES[i].icon}
                </svg>
              </div>
              <h3>{item}</h3>
            </div>
          ))}
          <div className="card card-ghost" aria-hidden="true">
            <span className="dots" style={{ top: "14%", left: "14%", right: "14%", bottom: "14%" }}></span>
            <span className="ghost-sq"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
