import type { CSSProperties, ReactNode } from "react";
import type { Dict } from "../content";

const delay = (d: string) => ({ "--d": d }) as CSSProperties;

const ROW_ICONS: { bg: string; icon: ReactNode }[] = [
  {
    bg: "linear-gradient(135deg,#E5FFFF,#BCEEFE)",
    icon: <path d="M12 3.5s5.5 6 5.5 10a5.5 5.5 0 0 1-11 0c0-4 5.5-10 5.5-10z" />,
  },
  {
    bg: "linear-gradient(135deg,#FFE5B2,#FFD499)",
    icon: <path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V11z" />,
  },
  {
    bg: "linear-gradient(135deg,#D6DFFF,#B2C2FF)",
    icon: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z" />,
  },
  {
    bg: "linear-gradient(135deg,#FFB2D7,#FF99BD)",
    icon: (
      <path d="M20.5 6.8a5 5 0 0 1-6.6 6.6L7 20.3a2 2 0 0 1-2.8-2.8l6.9-6.9a5 5 0 0 1 6.6-6.6l-3.2 3.2 2.6 2.6 3.4-3z" />
    ),
  },
];

const ROW_DELAYS = [".4s", "2.1s", "3.8s", "5.5s"];

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5l5 5L20 7" />
    </svg>
  );
}

/* CRM reactivation: dead rows wake one by one and flip to booked.
   Base state = all booked. */
export default function CrmReactivationArt({ t }: { t: Dict }) {
  const a = t.crmArt;
  return (
    <div className="crm-card">
      <div className="crm-head">
        <span className="crm-title">{a.title}</span>
        <span className="crm-count">{a.count}</span>
      </div>
      {a.rows.map((row, i) => (
        <div className="crm-row" style={delay(ROW_DELAYS[i])} key={row.name}>
          <span className="crm-ico" style={{ background: ROW_ICONS[i].bg }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F1E1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {ROW_ICONS[i].icon}
            </svg>
          </span>
          <div className="crm-lab">
            <div className="crm-name">{row.name}</div>
            <div className="crm-sub">{row.sub}</div>
          </div>
          <span className="crm-chips">
            <span className="crm-chip crm-dead" style={delay(ROW_DELAYS[i])}>{a.dead}</span>
            <span className="crm-chip crm-live" style={delay(ROW_DELAYS[i])}>
              <CheckIcon size={12} />
              {a.live}
            </span>
          </span>
        </div>
      ))}
      <div className="crm-foot">
        <span className="lc-chip booked">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
            <path d="M3.5 10h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 4-4" />
          </svg>
          {a.foot}
        </span>
      </div>
    </div>
  );
}
