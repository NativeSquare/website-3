import type { CSSProperties, ReactNode } from "react";
import type { Dict } from "../content";

const delay = (d: string) => ({ "--d": d }) as CSSProperties;

const ROW_DELAYS = [".6s", "1.8s", "3s"];

const ROW_ICONS: { bg: string; icon: ReactNode }[] = [
  {
    bg: "linear-gradient(135deg,#FFE5B2,#FFD499)",
    icon: (
      <>
        <path d="M6 2.5h8l4.5 4.5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 21V4A1.5 1.5 0 0 1 6 2.5z" />
        <path d="M14 2.5V7h4.5M8.5 13h7M8.5 17h5" />
      </>
    ),
  },
  {
    bg: "linear-gradient(135deg,#FFB2D7,#FF99BD)",
    icon: <path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 5.9-5.4-2.8-5.4 2.8 1-5.9L3.4 9.8l6-.9L12 3.5z" />,
  },
  {
    bg: "linear-gradient(135deg,#CCF6FF,#92DCF5)",
    icon: (
      <>
        <path d="M18 9.5a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17s-2.5-1-2.5-7" />
        <path d="M10 20a2.2 2.2 0 0 0 4 0" />
      </>
    ),
  },
];

/* Overnight automations: night sky fades to morning while task rows tick
   themselves done. Base = morning, everything checked. */
export default function OvernightAutomationsArt({ t }: { t: Dict }) {
  const a = t.automationsArt;
  return (
    <div className="wa-card">
      <div className="wa-sky">
        <div className="wa-layer wa-day">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F7BE3A" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.6" fill="#F7BE3A" stroke="none" />
            <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.8 1.8M17 17l1.8 1.8M18.8 5.2L17 7M7 17l-1.8 1.8" />
          </svg>
          <span className="wa-tlab">{a.dayLabel}</span>
        </div>
        <div className="wa-layer wa-night">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17.5 13A7 7 0 0 1 9.8 4.5 7 7 0 1 0 17.5 13z" fill="#FFE9A8" />
            <circle cx="18.5" cy="6" r="1" fill="#fff" opacity=".9" />
            <circle cx="15" cy="9.5" r=".7" fill="#fff" opacity=".7" />
            <circle cx="20.5" cy="10.5" r=".7" fill="#fff" opacity=".6" />
          </svg>
          <span className="wa-tlab">{a.nightLabel}</span>
        </div>
      </div>
      {a.rows.map((row, i) => (
        <div className="wa-row" style={delay(ROW_DELAYS[i])} key={row.t}>
          <span className="wa-box" style={delay(ROW_DELAYS[i])}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#33793E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path className="wa-tick" style={delay(ROW_DELAYS[i])} d="M4.5 12.5l5 5L20 7" />
            </svg>
          </span>
          <div className="wa-lab">
            <div className="wa-t">{row.t}</div>
            <div className="wa-s">{row.s}</div>
          </div>
          <span className="wa-ico" style={{ background: ROW_ICONS[i].bg }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F1E1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {ROW_ICONS[i].icon}
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
